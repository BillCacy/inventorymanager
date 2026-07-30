import Link from "next/link";
import { auth } from "@/lib/auth";
import { CartButton } from "@/components/storefront/CartButton";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          NimbusTech
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/products" className="hover:text-indigo-600">
            Shop
          </Link>
          <CartButton />
          {session?.user ? (
            <Link href="/admin" className="hover:text-indigo-600">
              Admin
            </Link>
          ) : (
            <Link href="/login" className="hover:text-indigo-600">
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
