"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browserClient";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "If an account exists for this email, you will receive a password reset link.",
    );
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 p-4">
      {" "}
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        {" "}
        <a href="/" className="mb-8 inline-flex items-center gap-2">
          <img
            src="/dev-showcase-icon.png"
            alt="DevShowcase logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-sm font-bold text-slate-900">DevShowcase</span>
        </a>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Forgot password?
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {message && (
            <p role="status" className="text-sm text-green-700">
              {message}
            </p>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Remember your password?{" "}
          <a
            href="/auth/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Log in
          </a>
        </p>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
