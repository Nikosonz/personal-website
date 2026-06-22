import AdminShell from "@/components/admin/AdminShell";
import { fontVariables } from "@/app/fonts";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
