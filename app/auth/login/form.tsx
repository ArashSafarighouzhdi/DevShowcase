"use client";

import { LogIn } from "@/actions/login-action";
import { logInSchema } from "@/actions/schemas";
import { createClient } from "@/lib/supabase/browserClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof logInSchema>>({
    resolver: zodResolver(logInSchema),
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: LogIn,
  });

  const onSubmit = (data: z.infer<typeof logInSchema>) => {
    mutate(data);
  };

  const handleOAuthSignIn = async (
    provider: "github" | "google" | "linkedin_oidc",
  ) => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("OAuth login error:", error.message);
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-2 sm:px-6 sm:py-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-2 sm:px-8 sm:py-3 md:px-10">
          <div className="w-full max-w-sm">
            <a href="/" className="mb-1 inline-flex items-center gap-1">
              <img
                src="/dev-showcase-icon.png"
                alt="DevShowcase logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-sm font-bold text-slate-900">
                DevShowcase
              </span>
            </a>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Log in to your account to continue
            </p>

            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() => handleOAuthSignIn("github")}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <FaGithub size={19} />
                Continue with GitHub
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn("google")}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <FcGoogle size={19} />
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn("linkedin_oidc")}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <FaLinkedinIn size={18} className="text-[#0A66C2]" />
                Continue with LinkedIn
              </button>
            </div>

            <div className="my-1 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-500">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  {...register("email")}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  {...register("password")}
                />

                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <a
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {error && !error.message.includes("NEXT_REDIRECT") && (
                <p role="alert" className="text-sm text-red-500">
                  {error.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Logging in..." : "Log in"}
              </button>
            </form>

            <p className="mt-1 text-center text-sm text-slate-500">
              Don&apos;t have an account?
              <a
                href="/auth/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </section>

        <aside className="relative hidden overflow-hidden bg-linear-to-br from-blue-500 to-indigo-700 px-10 py-1 text-white md:flex md:items-center md:px-12">
          <div className="absolute -right-16 top-20 h-80 w-80 rounded-full bg-white/6" />
          <div className="absolute -bottom-20 -left-16 h-80 w-80 rounded-full bg-indigo-950/10" />

          <div className="relative z-10">
            <h2 className="max-w-sm text-3xl font-bold leading-tight">
              Join a community of builders
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100">
              Share your projects, get feedback, and grow as a developer.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default LoginForm;
