import { defineQuery } from "next-sanity";

const PRODUCT_FIELDS = `
  _id,
  "name": title,
  "slug": slug.current,
  sku,
  price,
  status,
  description,
  "category": categories[0]->{ "name": title, "slug": slug.current },
  "image": images[0]{ asset, hotspot, crop, alt }
`;

const IS_LISTED = `_type == "product" && status == "active" && defined(slug.current) && defined(sku)`;

export const STOREFRONT_PRODUCTS_QUERY = defineQuery(`
  *[${IS_LISTED}
    && (!defined($category) || $category in categories[]->slug.current)
    && (!defined($q) || title match $q || pt::text(description) match $q)
  ] | order(title asc) { ${PRODUCT_FIELDS} }
`);

export const NEWEST_PRODUCTS_QUERY = defineQuery(`
  *[${IS_LISTED}] | order(_createdAt desc) [0...8] { ${PRODUCT_FIELDS} }
`);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[${IS_LISTED} && slug.current == $slug][0] { ${PRODUCT_FIELDS} }
`);

export const PRODUCTS_BY_SKU_QUERY = defineQuery(`
  *[_type == "product" && sku in $skus] { ${PRODUCT_FIELDS} }
`);

export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && defined(sku)] | order(title asc) { ${PRODUCT_FIELDS} }
`);

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    "name": title,
    "slug": slug.current
  }
`);
