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
      <header className="mb-12 animate-fade-in text-center">
        <h1 className="heading-artistic mb-6">Catálogo de Productos</h1>
        <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
          ✨ Descubre nuestra selección exclusiva de productos premium
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
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3 min-h-[600px] sm:min-h-[700px] lg:min-h-[800px]">
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
                    className="group card-premium overflow-hidden rounded-3xl border-2 border-transparent bg-white shadow-xl animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, ${index % 3 === 0 ? '#667eea, #764ba2' : index % 3 === 1 ? '#f093fb, #f5576c' : '#4facfe, #00f2fe'}) border-box`
                    }}
                  >
                    <Link to={`/productos/${product.slug}`} className="block relative">
                      {product.images && product.images.length > 0 && (
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            width="400"
                            height="400"
                            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-3"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-neutral-900 line-clamp-2 transition-all duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text">
                          {product.name}
                        </h3>
                        {product.brand && (
                          <p className="mt-2 text-sm font-semibold text-purple-600 uppercase tracking-wide">{product.brand}</p>
                        )}
                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            {product.offerPriceWithIVA ? (
                              <div>
                                <div className="price-artistic">
                                  {formatCLP(product.offerPriceWithIVA)}
                                </div>
                                <span className="ml-2 text-sm text-neutral-400 line-through">
                                  {formatCLP(product.priceWithIVA)}
                                </span>
                              </div>
                            ) : (
                              <div className="price-artistic">
                                {formatCLP(product.priceWithIVA)}
                              </div>
                            )}
                            <p className="text-xs font-medium text-neutral-500 mt-1">IVA incluido</p>
                          </div>
                          {product.stock > 0 ? (
                            <span className="badge-artistic text-xs px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500">
                              ✓ Disponible
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-red-500 bg-red-100 px-3 py-1.5 rounded-full border-2 border-red-300">
                              Agotado
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="px-6 pb-6">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={addingToCart === product._id || product.stock === 0}
                        className="btn-premium w-full rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 px-6 py-4 text-base font-bold text-white shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.6)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-md transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border-2 border-white/20"
                        style={{
                          backgroundSize: '200% 100%',
                          animation: addingToCart === product._id ? 'none' : 'gradientShift 3s ease infinite'
                        }}
                      >
                        {addingToCart === product._id ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="inline-block h-5 w-5 animate-spin rounded-full border-3 border-white border-r-transparent"></span>
                            Agregando...
                          </span>
                        ) : product.stock === 0 ? (
                          "❌ Sin stock"
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span>🛒</span>
                            Agregar al carrito
                          </span>
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
