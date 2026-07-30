export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500 sm:px-6">
        <p>NimbusTech is a fictional store built as a full-stack portfolio demo. No real orders are processed.</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} NimbusTech Demo.</p>
      </div>
    </footer>
  );
}
