import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error("SESSION_SECRET is not set");
const key = new TextEncoder().encode(secret);

export interface SessionPayload {
  userId: string; // User.publicId (UUID) — never the sequential Int PK
  role: string;
  expiresAt: Date;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await encrypt({ userId, role, expiresAt });
  const store = await cookies();
  store.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const store = await cookies();
  store.delete("session");
}

export async function verifySession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get("session")?.value;
  return decrypt(token);
}

// Explicit authorization gate for admin-only entry points (API routes, server
// actions). Returns the session when the caller is a valid admin, or null —
// callers decide how to respond (JSON 401 vs. throw). Centralizes the role
// check so it isn't re-derived ad hoc.
export async function requireAdmin(): Promise<SessionPayload | null> {
  const session = await verifySession();
  if (!session || session.role !== "admin") return null;
  return session;
}
