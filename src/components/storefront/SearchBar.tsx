export function SearchBar({
  defaultValue,
  category,
}: {
  defaultValue?: string;
  category?: string;
}) {
  return (
    <form action="/products" method="GET" className="flex w-full max-w-sm gap-2">
      {category && <input type="hidden" name="category" value={category} />}
      <input
        type="search"
        name="q"
        placeholder="Search products..."
        defaultValue={defaultValue}
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Search
      </button>
    </form>
  );
}
