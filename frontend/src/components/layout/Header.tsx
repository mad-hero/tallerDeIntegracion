import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/productos", label: "Productos" },
  { to: "/quienes-somos", label: "Quiénes Somos" },
  { to: "/politicas", label: "Políticas" },
  { to: "/contacto", label: "Contacto" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 glass shadow-sm transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 animate-fade-in">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-lg font-bold text-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              JSP
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                JSP Detailing
              </span>
              <span className="text-xs text-neutral-500">
                Cuidado automotriz profesional
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "link-underline text-sm font-medium transition-all duration-300 hover:text-blue-600 animate-fade-in",
                  isActive ? "text-blue-600 font-semibold" : "text-neutral-700",
                ].join(" ")
              }
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex animate-fade-in">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:border-purple-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/cuenta"
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                {user?.firstName}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="btn-premium rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Crear cuenta
              </Link>
            </>
          )}
          <Link
            to="/carro"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all duration-300"
            aria-label="Ver carrito"
          >
            <span className="text-lg">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-semibold text-white shadow-md animate-pulse-soft">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 hover:rotate-90 lg:hidden transition-all duration-300"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">Abrir menú</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5"
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden animate-slide-in-right"
        >
          <nav className="space-y-1 border-t border-neutral-200 bg-white px-4 py-4 shadow-lg">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-neutral-700 hover:bg-neutral-100",
                  ].join(" ")
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="flex flex-col gap-2 pt-2">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="rounded-full border border-purple-200 px-4 py-2 text-center text-sm font-medium text-purple-700 hover:border-purple-300 hover:bg-purple-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Panel Admin
                    </Link>
                  )}
                  <Link
                    to="/cuenta"
                    className="rounded-full border border-neutral-200 px-4 py-2 text-center text-sm font-medium text-neutral-700 hover:border-primary hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Cuenta
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-center text-sm font-medium text-neutral-700 hover:border-primary hover:text-primary"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-full border border-neutral-200 px-4 py-2 text-center text-sm font-medium text-neutral-700 hover:border-primary hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Crear cuenta
                  </Link>
                </>
              )}
              <Link
                to="/carro"
                className="flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-primary hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>🛒</span>
                <span>Carro</span>
                {itemCount > 0 && (
                  <span className="ml-auto inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

