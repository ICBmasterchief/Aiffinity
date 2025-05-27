// frontend/src/app/register/page.js
"use client";

import { useState, useContext, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_USER, LOGIN_USER } from "@/graphql/userMutations";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import useToast from "@/hooks/useToast";
import AuthCard from "@/components/AuthCard";

export default function RegisterPage() {
  const { user, login } = useContext(AuthContext);
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { toasts, showToast, clearToast } = useToast();

  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      login(data.login);
      router.push("/profile");
    },
    onError: (err) => showToast("Fallo de Autologin: (", "error"),
  });

  const [register, { loading, error }] = useMutation(REGISTER_USER, {
    onCompleted: () => {
      showToast("¡Registro correcto!", "success");
      loginUser({
        variables: {
          email: formState.email,
          password: formState.password,
        },
        onError: (err) => {
          const msg =
            err?.graphQLErrors?.[0]?.message || "Error al iniciar sesión";
          showToast(msg);
        },
      });
    },
    onError: (err) => {
      const msg = err?.graphQLErrors?.[0]?.message || "Error al registrar";
      showToast(msg);
    },
  });

  useEffect(() => {
    if (user) router.replace("/discover");
  }, [user, router]);
  if (user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];

    if (!formState.name.trim()) errors.push("El nombre es obligatorio");
    if (formState.name.length > 20)
      errors.push("El nombre no puede superar los 20 caracteres");

    const emailRegex = /^[\w.+-]+@\w+\.\w+$/;
    if (!emailRegex.test(formState.email)) errors.push("E-mail no válido");

    if (formState.password.length < 4)
      errors.push("La contraseña debe tener al menos 4 caracteres");

    if (formState.password !== formState.confirmPassword)
      errors.push("Las contraseñas no coinciden");

    if (errors.length) {
      errors.forEach((msg) => showToast(msg));
      return;
    }

    await register({
      variables: {
        name: formState.name,
        email: formState.email,
        password: formState.password,
      },
    });
  };

  return (
    <AuthCard title="Registro">
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          maxLength={20}
          placeholder="Nombre"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          required
          className="
              w-full rounded-2xl border border-gray-300
              bg-white/70 backdrop-blur p-3 text-black
              focus:outline-none focus:border-purple-500
            "
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          pattern="^[\w.+-]+@\w+\.\w+$"
          value={formState.email}
          onChange={(e) =>
            setFormState({ ...formState, email: e.target.value })
          }
          required
          className="
              w-full rounded-2xl border border-gray-300
              bg-white/70 backdrop-blur p-3 text-black
              focus:outline-none focus:border-purple-500
            "
        />
        <input
          type="password"
          minLength={4}
          placeholder="Contraseña"
          value={formState.password}
          onChange={(e) =>
            setFormState({ ...formState, password: e.target.value })
          }
          required
          className="
              w-full rounded-2xl border border-gray-300
              bg-white/70 backdrop-blur p-3 text-black
              focus:outline-none focus:border-purple-500
            "
        />
        <input
          type="password"
          minLength={4}
          placeholder="Confirmar contraseña"
          value={formState.confirmPassword}
          onChange={(e) =>
            setFormState({ ...formState, confirmPassword: e.target.value })
          }
          required
          className="
              w-full rounded-2xl border border-gray-300
              bg-white/70 backdrop-blur p-3 text-black
              focus:outline-none focus:border-purple-500
            "
        />
        <button
          type="submit"
          disabled={loading}
          className="
            py-3 w-full rounded-full font-semibold text-white
            bg-gradient-to-r from-[#FF9A9E] to-[#FFD3A5]
            hover:from-[#FFD3A5] hover:to-[#FF9A9E]
            hover:shadow-md transition
          "
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
      <Toast toasts={toasts} clearToast={clearToast} />
      <p className="mt-6 text-sm text-center">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-[#ae6fff] hover:underline">
          Inicia sesión
        </a>
      </p>
    </AuthCard>
  );
}
