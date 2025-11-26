import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import { useState } from "react";

const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/;

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Ingresa tu nombre")
      .max(50, "Nombre demasiado largo"),
    lastName: z
      .string()
      .min(2, "Ingresa tu apellido")
      .max(50, "Apellido demasiado largo"),
    rut: z
      .string()
      .regex(rutRegex, "Formato válido: XX.XXX.XXX-X"),
    email: z.string().email("Ingresa un correo válido"),
    phone: z
      .string()
      .regex(/^\+56 9 [0-9]{4} [0-9]{4}$/, "Formato válido: +56 9 XXXX XXXX"),
    password: z
      .string()
      .min(8, "Debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Incluye al menos una mayúscula")
      .regex(/[0-9]/, "Incluye al menos un número")
      .regex(/[^A-Za-z0-9]/, "Incluye al menos un carácter especial"),
    confirmPassword: z.string(),
    agreeTerms: z
      .boolean()
      .refine((value) => value, {
        message: "Debes aceptar los términos y condiciones",
      }),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Las contraseñas deben coincidir",
    },
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      rut: "",
      email: "",
      phone: "+56 9 ",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      setError(null);
      setSuccess(false);
      
      await api.register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        rut: values.rut,
        phone: values.phone,
        agreeTerms: values.agreeTerms,
      });

      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Cuenta creada exitosamente. Por favor verifica tu correo electrónico." }
        });
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.error || 
        err.message || 
        "Error al crear cuenta. Por favor intenta nuevamente."
      );
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <header className="mb-12 text-center">
        <div className="inline-block text-6xl mb-4 animate-float">✨</div>
        <h1 className="heading-artistic mb-6">
          Crea tu Cuenta
        </h1>
        <p className="mt-4 text-lg text-neutral-700 max-w-2xl mx-auto leading-relaxed">
          🎁 Registra tus datos para acceder a beneficios, historial de pedidos y promociones exclusivas
        </p>
      </header>

      {success && (
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-white/20 p-6 text-white shadow-2xl animate-scale-in">
          <p className="font-black text-xl flex items-center gap-2">
            <span>🎉</span> ¡Cuenta creada exitosamente!
          </p>
          <p className="text-sm mt-2 opacity-90">Te redirigiremos al login en un momento...</p>
        </div>
      )}

      {error && (
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 border-2 border-white/20 p-6 text-white shadow-2xl animate-scale-in">
          <p className="font-black text-xl flex items-center gap-2">
            <span>❌</span> Error al crear cuenta
          </p>
          <p className="text-sm mt-2 opacity-90">{error}</p>
        </div>
      )}

      <form
        className="card-premium space-y-8 rounded-3xl border-2 border-transparent bg-white p-8 shadow-2xl lg:p-12"
        style={{
          background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea, #764ba2, #f093fb) border-box`
        }}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700" htmlFor="firstName">
              Nombre
            </label>
            <input
              id="firstName"
              type="text"
              className="w-full rounded-xl border-2 border-neutral-200 px-5 py-4 text-sm shadow-sm outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:scale-105"
              placeholder="Ej: Juan"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700" htmlFor="lastName">
              Apellido
            </label>
            <input
              id="lastName"
              type="text"
              className="w-full rounded-xl border-2 border-neutral-200 px-5 py-4 text-sm shadow-sm outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:scale-105"
              placeholder="Ej: Pérez"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-red-600">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700" htmlFor="rut">
              RUT
            </label>
            <input
              id="rut"
              type="text"
              className="w-full rounded-xl border-2 border-neutral-200 px-5 py-4 text-sm shadow-sm outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:scale-105"
              placeholder="12.345.678-9"
              {...register("rut")}
            />
            {errors.rut && <p className="text-xs text-red-600">{errors.rut.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border-2 border-neutral-200 px-5 py-4 text-sm shadow-sm outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:scale-105"
              placeholder="tu.correo@ejemplo.cl"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700" htmlFor="phone">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full rounded-xl border-2 border-neutral-200 px-5 py-4 text-sm shadow-sm outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:scale-105"
              placeholder="+56 9 1234 5678"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-xl border-2 border-neutral-200 px-5 py-4 text-sm shadow-sm outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:scale-105"
              placeholder="Crea una contraseña segura"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700" htmlFor="confirmPassword">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full rounded-xl border-2 border-neutral-200 px-5 py-4 text-sm shadow-sm outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:scale-105"
              placeholder="Repite tu contraseña"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600">
          <label className="inline-flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary/30"
              {...register("agreeTerms")}
            />
            <span>
              Acepto los{" "}
              <Link to="/politicas#terminos" className="font-semibold text-primary hover:underline">
                términos y condiciones
              </Link>
              ,{" "}
              <Link to="/politicas#privacidad" className="font-semibold text-primary hover:underline">
                política de privacidad
              </Link>{" "}
              y confirmo que mi información es verídica.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-xs text-red-600">{errors.agreeTerms.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn-premium w-full rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 px-8 py-5 text-lg font-black text-white shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.8)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
          style={{
            backgroundSize: '200% 100%',
            animation: isSubmitting ? 'none' : 'gradientShift 3s ease infinite'
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-3 border-white border-r-transparent"></span>
              Creando cuenta...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>🚀</span>
              Crear cuenta
            </span>
          )}
        </button>

        <p className="text-center text-sm text-neutral-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </div>
  );
}

