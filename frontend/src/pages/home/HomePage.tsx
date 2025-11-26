import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { HomeBanner, Category } from "../../types";

export function HomePage() {
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadHomeBanners();
    loadCategories();
  }, []);

  const loadHomeBanners = async () => {
    try {
      const data = await api.getHomeBanners();
      setBanners(data.filter((b: HomeBanner) => b.active));
    } catch (error) {
      console.error("Error loading banners:", error);
    } finally {
      setLoadingBanners(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      // Solo mostrar las primeras 3 categorías activas
      setCategories(data.filter((c: Category) => c.status === 'active').slice(0, 3));
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section with Banners */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-gradient">
        {loadingBanners ? (
          <div className="mx-auto max-w-7xl px-4 py-24 text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-neutral-600">Cargando...</p>
          </div>
        ) : banners.length > 0 ? (
          // Mostrar primer banner activo
          <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:px-8 lg:py-24">
            <div className="w-full space-y-6 lg:w-1/2 animate-fade-in">
              <span className="rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm animate-pulse-soft">
                ✨ Detailing profesional en Chile
              </span>
              <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl lg:text-6xl leading-tight">
                {banners[0].title}
              </h1>
              <p className="text-lg text-neutral-600 leading-relaxed">
                {banners[0].subtitle || "En JSP Detailing encontrarás soluciones especializadas para lavado, descontaminación y protección de tu auto."}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to={banners[0].ctaLink || "/productos"}
                  className="btn-premium group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                >
                  {banners[0].ctaText || "Comprar ahora"}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  to="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-neutral-300 px-8 py-4 text-base font-semibold text-neutral-700 transition-all duration-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 hover:-translate-y-1"
                >
                  💬 Habla con un asesor
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 animate-fade-in" style={{animationDelay: '200ms'}}>
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <img
                  src={banners[0].image || "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1000&q=80"}
                  alt={banners[0].title}
                  className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl lg:aspect-auto lg:h-[500px] transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="eager"
                />
                <div className="absolute bottom-4 left-4 rounded-2xl glass p-4 shadow-xl backdrop-blur-md animate-float">
                  <p className="text-xs font-semibold uppercase text-neutral-600">
                    ⭐ Confían en nosotros
                  </p>
                  <p className="text-lg font-bold text-gradient">
                    +5.000 detalladores en Chile
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Fallback si no hay banners
          <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:px-8 lg:py-24">
            <div className="w-full space-y-6 lg:w-1/2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Detailing profesional en Chile
              </span>
              <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">
                Realza el brillo de tu vehículo con productos de alto desempeño.
              </h1>
              <p className="text-lg text-neutral-600">
                En JSP Detailing encontrarás soluciones especializadas para lavado,
                descontaminación y protección de tu auto, con precios en pesos
                chilenos y entrega a todo el país.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/productos"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5 hover:bg-primary-dark"
                >
                  Comprar ahora
                </Link>
                <Link
                  to="/contacto"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-primary hover:text-primary"
                >
                  Habla con un asesor
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1000&q=80"
                  alt="Detalle automotriz profesional"
                  className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl lg:aspect-auto lg:h-[500px]"
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 p-3 shadow-xl sm:p-4">
                  <p className="text-xs font-semibold uppercase text-neutral-500">
                    Confían en nosotros
                  </p>
                  <p className="text-base font-bold text-neutral-900 sm:text-lg">
                    +5.000 detalladores en Chile
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Categorías destacadas
            </h2>
            <p className="text-sm text-neutral-600">
              Encuentra productos seleccionados para cada etapa del detailing.
            </p>
          </div>
          <Link
            to="/productos"
            className="text-sm font-semibold text-primary hover:text-primary-dark"
          >
            Ver todas las categorías →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {loadingCategories ? (
            <div className="col-span-3 py-12 text-center text-neutral-600">
              Cargando categorías...
            </div>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <article
                key={category._id}
                className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {category.description || "Encuentra los mejores productos de esta categoría."}
                  </p>
                  <Link
                    to={`/productos?category=${category.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-dark"
                  >
                    Ver productos
                    <span aria-hidden className="ml-1">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-3 py-12 text-center text-neutral-600">
              No hay categorías disponibles aún.
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary/20 bg-white/80 p-4 text-center shadow-sm">
              <p className="text-sm font-semibold text-neutral-700">
                Envíos a todo Chile
              </p>
              <p className="text-xs text-neutral-500">Chilexpress, Starken, Bluexpress y más</p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-white/80 p-4 text-center shadow-sm">
              <p className="text-sm font-semibold text-neutral-700">
                Pagos seguros
              </p>
              <p className="text-xs text-neutral-500">Webpay, Transferencia, Mercado Pago</p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-white/80 p-4 text-center shadow-sm">
              <p className="text-sm font-semibold text-neutral-700">
                IVA incluido
              </p>
              <p className="text-xs text-neutral-500">Precios finales en pesos chilenos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900">
            Métodos de pago y seguridad
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Webpay Plus", description: "Aceptamos tarjetas de débito y crédito." },
              { title: "Transferencia", description: "Pagos directos a cuenta JSP Detailing." },
              { title: "Mercado Pago", description: "Cuotas sin interés con bancos seleccionados." },
              { title: "SERNAC", description: "Cumplimos normativa Ley 19.496 y SERNAC." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-neutral-200 p-6 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
