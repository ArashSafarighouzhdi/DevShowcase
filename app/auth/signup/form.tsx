"use client";
import { createClient } from "@/lib/supabase/browserClient";
import { SignUp } from "@/actions/signup-action";
import { signUPSchema } from "@/actions/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaGithub, FaImages, FaHeart, FaUsers } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUPSchema>>({
    resolver: zodResolver(signUPSchema),
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: SignUp,
  });

  const onSubmit = (data: z.infer<typeof signUPSchema>) => {
    mutate(data);
  };
  const handleOAuthSignUp = async (
    provider: "google" | "github" | "linkedin_oidc",
  ) => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-2 sm:px-6 sm:py-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
        <section className="px-6 py-2 sm:px-8 sm:py-4 md:px-10">
          <div className="w-full">
            <a href="/" className="mb-2 inline-flex items-center gap-2">
              <img
                src="/dev-showcase-icon.png"
                alt="DevShowcase logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-sm font-bold text-text">DevShowcase</span>
            </a>

            <h2 className="text-3xl font-bold text-text">
              Create your account
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-muted">
              Join thousands of developers sharing
              <br className="hidden sm:block" /> their work.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-2">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-text"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Arashdev"
                  autoComplete="username"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-text"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                  className="mb-1 block text-sm font-medium text-text"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {error && !error.message.includes("NEXT_REDIRECT") && (
                <p role="alert" className="text-sm text-red-500">
                  {error.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg border-2 border-primary bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:border-primary-dark hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Creating account..." : "Sign up"}
              </button>
            </form>

            <div className="my-2.5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-muted">Or continue with</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthSignUp("github")}
                aria-label="Continue with GitHub"
                className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-text transition hover:bg-slate-50"
              >
                <FaGithub className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignUp("google")}
                aria-label="Continue with Google"
                className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-text transition hover:bg-slate-50"
              >
                <FcGoogle className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignUp("linkedin_oidc")}
                aria-label="Continue with LinkedIn"
                className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[#0A66C2] transition hover:bg-slate-50"
              >
                <span className="text-lg font-bold" aria-hidden="true">
                  in
                </span>
              </button>
            </div>

            <p className="mt-2 text-center text-sm text-muted">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="font-semibold text-primary hover:underline"
              >
                Log in
              </a>
            </p>
          </div>
        </section>

        <aside className="relative hidden overflow-hidden bg-linear-to-br from-primary via-secondary to-[#581c87] px-8 py-8 text-white md:flex md:flex-col md:justify-center md:px-10">
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-52 -right-20 h-96 w-96 rounded-full bg-purple-400/20" />

          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                <FaImages className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold">Showcase your work</h3>
                <p className="mt-1 text-sm text-white/75">
                  Share your projects with the world
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                <FaHeart className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold">Get feedback</h3>
                <p className="mt-1 text-sm text-white/75">
                  Receive likes and comments
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                <FaUsers className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold">Connect with developers</h3>
                <p className="mt-1 text-sm text-white/75">
                  Follow and discover new talent
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default SignUpForm;
