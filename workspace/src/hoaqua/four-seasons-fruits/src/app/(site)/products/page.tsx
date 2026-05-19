// Product Listing Page with search, category filter, and pagination

import { db } from "@/lib/db";
import { ProductCard } from "@/components/site/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

const PRODUCTS_PER_PAGE = 12;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const categoryId = params.category || "";
  const page = parseInt(params.page || "1");

  // Build filter conditions
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Fetch products and categories
  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
    }),
    db.product.count({ where }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sản phẩm</h1>
        <p className="text-gray-600 mt-2">
          Khám phá bộ sưu tập trái cây tươi ngon của chúng tôi
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <form className="flex-1 relative" action="/products" method="GET">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {categoryId && (
            <input type="hidden" name="category" value={categoryId} />
          )}
        </form>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Link href="/products">
            <Button
              variant={!categoryId ? "default" : "outline"}
              size="sm"
              className={!categoryId ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              Tất cả
            </Button>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.id}`}>
              <Button
                variant={categoryId === cat.id ? "default" : "outline"}
                size="sm"
                className={
                  categoryId === cat.id
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : ""
                }
              >
                {cat.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
          <Link href="/products">
            <Button variant="outline" className="mt-4">
              Xem tất cả sản phẩm
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              salePrice={product.salePrice}
              image={product.image}
              unit={product.unit}
              isOnSale={product.isOnSale}
              category={product.category}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`/products?page=${page - 1}${search ? `&search=${search}` : ""}${categoryId ? `&category=${categoryId}` : ""}`}
            >
              <Button variant="outline">← Trước</Button>
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/products?page=${p}${search ? `&search=${search}` : ""}${categoryId ? `&category=${categoryId}` : ""}`}
            >
              <Button
                variant={p === page ? "default" : "outline"}
                className={p === page ? "bg-emerald-600" : ""}
              >
                {p}
              </Button>
            </Link>
          ))}

          {page < totalPages && (
            <Link
              href={`/products?page=${page + 1}${search ? `&search=${search}` : ""}${categoryId ? `&category=${categoryId}` : ""}`}
            >
              <Button variant="outline">Sau →</Button>
            </Link>
          )}
        </div>
      )}

      {/* Results count */}
      <p className="text-center text-sm text-gray-500 mt-4">
        Hiển thị {products.length} / {total} sản phẩm
      </p>
    </div>
  );
}
