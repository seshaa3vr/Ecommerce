import type { ProductInput } from '../shared/schemas.ts';
import type { CategoryId, Gender, Product } from '../shared/types.ts';
import { db, now, transaction } from './db.ts';
import { HttpError } from './http.ts';
import { seedProducts } from './seed-products.ts';

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  gender: string;
  price: number;
  original_price: number | null;
  rating: number;
  review_count: number;
  stock: number;
  sizes: string;
  colors: string;
  images: string;
  description: string;
  details: string;
  is_new: number;
  is_bestseller: number;
  created_at: string;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category as CategoryId,
    gender: row.gender as Gender,
    price: row.price,
    ...(row.original_price ? { originalPrice: row.original_price } : {}),
    rating: row.rating,
    reviewCount: row.review_count,
    stock: row.stock,
    sizes: JSON.parse(row.sizes),
    colors: JSON.parse(row.colors),
    images: JSON.parse(row.images),
    description: row.description,
    details: JSON.parse(row.details),
    ...(row.is_new ? { isNew: true } : {}),
    ...(row.is_bestseller ? { isBestseller: true } : {}),
    createdAt: row.created_at,
  };
}

export function listProducts(): Product[] {
  return (db.prepare('SELECT * FROM products ORDER BY position, id').all() as ProductRow[]).map(toProduct);
}

export function getProduct(id: number): Product | undefined {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as ProductRow | undefined;
  return row && toProduct(row);
}

function requireProduct(id: number) {
  const product = getProduct(id);
  if (!product) throw new HttpError(404, 'Product not found');
  return product;
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'product'
  );
}

/** Builds a URL slug from the name, adding -2, -3… if another product already uses it. */
function uniqueSlug(name: string, excludeId = 0) {
  const base = slugify(name);
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    if (!db.prepare('SELECT 1 FROM products WHERE slug = ? AND id != ?').get(slug, excludeId)) return slug;
  }
}

const json = JSON.stringify;

export function createProduct(input: ProductInput): Product {
  // New products appear first in the "Featured" order.
  const { top } = db.prepare('SELECT COALESCE(MIN(position), 0) - 1 AS top FROM products').get() as { top: number };
  const result = db
    .prepare(
      `INSERT INTO products (slug, name, brand, category, gender, price, original_price, stock, sizes, colors, images,
         description, details, is_new, is_bestseller, position, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      uniqueSlug(input.name),
      input.name,
      input.brand,
      input.category,
      input.gender,
      input.price,
      input.originalPrice,
      input.stock,
      json(input.sizes),
      json(input.colors),
      json(input.images),
      input.description,
      json(input.details),
      Number(input.isNew),
      Number(input.isBestseller),
      top,
      now().slice(0, 10),
    );
  return requireProduct(Number(result.lastInsertRowid));
}

export function updateProduct(id: number, input: ProductInput): Product {
  const existing = requireProduct(id);
  db.prepare(
    `UPDATE products SET slug = ?, name = ?, brand = ?, category = ?, gender = ?, price = ?, original_price = ?, stock = ?,
       sizes = ?, colors = ?, images = ?, description = ?, details = ?, is_new = ?, is_bestseller = ?
     WHERE id = ?`,
  ).run(
    input.name === existing.name ? existing.slug : uniqueSlug(input.name, id),
    input.name,
    input.brand,
    input.category,
    input.gender,
    input.price,
    input.originalPrice,
    input.stock,
    json(input.sizes),
    json(input.colors),
    json(input.images),
    input.description,
    json(input.details),
    Number(input.isNew),
    Number(input.isBestseller),
    id,
  );
  return requireProduct(id);
}

export function patchProduct(id: number, patch: { price?: number; originalPrice?: number | null; stock?: number }): Product {
  const existing = requireProduct(id);
  const price = patch.price ?? existing.price;
  const stock = patch.stock ?? existing.stock;
  let originalPrice = patch.originalPrice !== undefined ? patch.originalPrice : (existing.originalPrice ?? null);
  if (patch.originalPrice !== undefined && originalPrice !== null && originalPrice <= price) {
    throw new HttpError(400, 'Original price must be higher than the selling price', {
      originalPrice: 'Must be higher than the selling price',
    });
  }
  // Raising the price to or above the old "was" price ends the sale.
  if (originalPrice !== null && originalPrice <= price) originalPrice = null;
  db.prepare('UPDATE products SET price = ?, original_price = ?, stock = ? WHERE id = ?').run(price, originalPrice, stock, id);
  return requireProduct(id);
}

export function deleteProduct(id: number) {
  requireProduct(id);
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
}

export function seedProductsIfEmpty() {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM products').get() as { count: number };
  if (count > 0) return;
  transaction(() => {
    const insert = db.prepare(
      `INSERT INTO products (id, slug, name, brand, category, gender, price, original_price, rating, review_count, stock,
         sizes, colors, images, description, details, is_new, is_bestseller, position, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    seedProducts.forEach((p, index) =>
      insert.run(
        p.id,
        p.slug,
        p.name,
        p.brand,
        p.category,
        p.gender,
        p.price,
        p.originalPrice ?? null,
        p.rating,
        p.reviewCount,
        p.stock,
        json(p.sizes),
        json(p.colors),
        json(p.images),
        p.description,
        json(p.details),
        Number(Boolean(p.isNew)),
        Number(Boolean(p.isBestseller)),
        index,
        p.createdAt,
      ),
    );
  });
  console.log(`✓ Seeded ${seedProducts.length} demo products`);
}
