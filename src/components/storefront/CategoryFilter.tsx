import Link from "next/link";

type Category = { slug: string; name: string };

export function CategoryFilter({
  categories,
  activeSlug,
  q,
}: {
  categories: Category[];
  activeSlug?: string;
  q?: string;
}) {
  const qParam = q ? `&q=${encodeURIComponent(q)}` : "";

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`}
        className={`rounded-full px-3 py-1 text-sm ${
          !activeSlug
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}${qParam}`}
          className={`rounded-full px-3 py-1 text-sm ${
            activeSlug === category.slug
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
