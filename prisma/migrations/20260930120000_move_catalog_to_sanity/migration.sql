-- Catalog content (name, slug, description, price, image, category, visibility)
-- now lives in Sanity. Postgres keeps inventory (sku + stock), orders and users.
-- Run the Sanity import (studio/scripts/import-fullstack.ts) BEFORE applying.

-- Snapshot product names onto existing order items before the name column goes away
ALTER TABLE "OrderItem" ADD COLUMN "productName" TEXT;

UPDATE "OrderItem" AS oi
SET "productName" = p."name"
FROM "Product" AS p
WHERE oi."productId" = p."id";

ALTER TABLE "OrderItem" ALTER COLUMN "productName" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropIndex
DROP INDEX "Product_slug_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categoryId",
DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "isActive",
DROP COLUMN "name",
DROP COLUMN "priceCents",
DROP COLUMN "slug";

-- DropTable
DROP TABLE "Category";
