import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { logout } from "@/app/admin/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">NimbusTech Admin</h1>
          <p className="text-sm text-gray-500">Signed in as {session.user.email}</p>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium text-gray-700">
          <Link href="/admin" className="hover:text-indigo-600">
            Dashboard
          </Link>
          <Link href="/admin/products" className="hover:text-indigo-600">
            Products
          </Link>
          <Link href="/admin/orders" className="hover:text-indigo-600">
            Orders
          </Link>
          <form action={logout}>
            <button type="submit" className="text-red-600 hover:underline">
              Sign out
            </button>
          </form>
        </nav>
      </div>

      <div className="py-8">{children}</div>
    </div>
  );
}
