import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../utils/imageUrl";
import { formatCLP } from "../../utils/currency";
import type { Product, Category } from "../../types";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { addToCart } = useCart();

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [category, search, sort, page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 20,
        sort,
      };
      if (category) params.category = category;
      if (search) params.search = search;

      const data = await api.getProducts(params);
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId);
      await addToCart(productId);
      alert("Producto agregado al carrito");
    } catch (error: any) {
      alert(error.response?.data?.error || "Error al agregar al carrito");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Catálogo de Productos</h1>
        <p className="mt-2 text-neutral-600">
          Filtra por categoría, marca, precio y disponibilidad.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 animate-fade-in">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
            <h2 className="mb-4 font-semibold text-neutral-900">Filtros</h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Buscar
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none cursor-pointer"
                >
                  <option value="">Todas</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Ordenar por
                </label>
                <select
                  value={sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Más recientes</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                  <option value="popular">Más populares</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-neutral-600">Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center shadow-md">
              <p className="text-neutral-600">No se encontraron productos</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, index) => (
                  <div
                    key={product._id}
                    className="group card-premium overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-md animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link to={`/productos/${product.slug}`}>
                      {product.images && product.images.length > 0 && (
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100">
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-neutral-900 line-clamp-2 transition-colors group-hover:text-blue-600">
                          {product.name}
                        </h3>
                        {product.brand && (
                          <p className="mt-1 text-sm text-neutral-500">{product.brand}</p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            {product.offerPriceWithIVA ? (
                              <div>
                                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                  {formatCLP(product.offerPriceWithIVA)}
                                </span>
                                <span className="ml-2 text-sm text-neutral-500 line-through">
                                  {formatCLP(product.priceWithIVA)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-neutral-900">
                                {formatCLP(product.priceWithIVA)}
                              </span>
                            )}
                            <p className="text-xs text-neutral-500">IVA incluido</p>
                          </div>
                          {product.stock > 0 ? (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              En stock
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                              Sin stock
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="px-4 pb-4">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={addingToCart === product._id || product.stock === 0}
                        className="btn-premium w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-xl hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        {addingToCart === product._id ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
                            Agregando...
                          </span>
                        ) : product.stock === 0 ? (
                          "Sin stock"
                        ) : (
                          "Agregar al carrito"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
