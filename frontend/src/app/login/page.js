// frontend/src/app/login/page.js
"use client";

import { useState, useContext, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/graphql/userMutations";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import useToast from "@/hooks/useToast";
import AuthCard from "@/components/AuthCard";

export default function LoginPage() {
  const { user, login } = useContext(AuthContext);
  const router = useRouter();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const { toasts, showToast, clearToast } = useToast();

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      login(data.login);
      window.location.href = "/discover";
    },
    onError: (err) => {
      const msg =
        err?.graphQLErrors?.[0]?.message || "Correo o contraseña incorrectos";
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
    const emailRegex = /^[\w.+-]+@\w+\.\w+$/;

    if (!emailRegex.test(formState.email)) errors.push("E-mail no válido");
    if (formState.password.length < 4)
      errors.push("La contraseña debe tener al menos 4 caracteres");

    if (errors.length) {
      errors.forEach((m) => showToast(m));
      return;
    }

    await loginUser({
      variables: {
        email: formState.email,
        password: formState.password,
      },
    });
  };

  return (
    <>
      <AuthCard title="Iniciar Sesión">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            pattern="^[\w.+-]+@\w+\.\w+$"
            placeholder="Correo electrónico"
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
            minLength={6}
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
            {loading ? "Entrando..." : "Iniciar Sesión"}
          </button>
        </form>
        <p className="mt-6 text-sm text-center">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-[#ae6fff] hover:underline">
            Regístrate
          </a>
        </p>
      </AuthCard>
      <Toast toasts={toasts} clearToast={clearToast} />
    </>
  );
}
