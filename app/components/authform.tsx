
"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (active && data.session) {
        router.replace("/dashboard");
      }
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        active &&
        session &&
        (event === "SIGNED_IN" || event === "INITIAL_SESSION")
      ) {
        router.replace("/dashboard");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) {
          setStatus(error.message);
          return;
        }

        if (data.session) {
          router.replace("/dashboard");
          router.refresh();
        } else {
          setStatus(
            "Pendaftaran berhasil. Silakan periksa email untuk konfirmasi akun."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setStatus(error.message);
          return;
        }

        router.replace("/dashboard");
        router.refresh();
      }
    } catch {
      setStatus("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const isRegister = mode === "register";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f6] px-4 py-10 text-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="mb-8">
          <a href="/" className="text-xl font-bold tracking-tight">
            Deallora
          </a>

          <p className="mt-8 text-sm font-medium text-emerald-700">
            {isRegister ? "GET STARTED" : "WELCOME BACK"}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {isRegister ? "Create your account" : "Sign in to your account"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {isRegister
              ? "Create an account to get started with Deallora."
              : "Enter your credentials to access your workspace."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={
                isRegister ? "new-password" : "current-password"
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={
                isRegister ? "At least 6 characters" : "Your password"
              }
              minLength={6}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create account"
                : "Sign in"}
          </button>

          {status && (
            <p
              role="status"
              aria-live="polite"
              className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600"
            >
              {status}
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <a
            href={isRegister ? "/login" : "/register"}
            className="font-semibold text-emerald-700 hover:underline"
          >
            {isRegister ? "Sign in" : "Create account"}
          </a>
        </p>
      </div>
    </main>
  );
}
