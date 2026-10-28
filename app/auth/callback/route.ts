import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  const redirectPath =
    next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (code) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;

      const { data: profile, error: profileError } = await supabase
        .from("Users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile lookup failed:", profileError);
        return NextResponse.redirect(
          new URL("/auth/login?error=profile", origin),
        );
      }

      if (!profile) {
        const metadata = user.user_metadata ?? {};
        const fullName =
          metadata.full_name ??
          metadata.name ??
          user.email?.split("@")[0] ??
          "user";

        const baseUsername = String(fullName)
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9_-]/g, "")
          .slice(0, 30);

        const username = baseUsername.length >= 3 ? baseUsername : "user";

        const { error: insertError } = await supabase.from("Users").insert({
          id: user.id,
          username,
          avatar:
            typeof metadata.avatar_url === "string"
              ? metadata.avatar_url
              : typeof metadata.picture === "string"
                ? metadata.picture
                : null,
        });

        if (insertError) {
          console.error("OAuth profile creation failed:", insertError);
          return NextResponse.redirect(
            new URL("/auth/login?error=profile", origin),
          );
        }
      }

      return NextResponse.redirect(new URL(redirectPath, origin));
    }
  }

  return NextResponse.redirect(new URL("/auth/login?error=oauth", origin));
}
