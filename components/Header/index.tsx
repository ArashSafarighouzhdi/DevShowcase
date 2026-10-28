import Link from "next/link";
import AccountLink from "./accountLinke";
import Search from "../Search/index";
import { createClient } from "@/lib/supabase/serverClient";

const Header = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileHref = "";

  if (user) {
    const { data: profile } = await supabase
      .from("Users")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.username) {
      profileHref = `/profile/${profile.username}`;
    }
  }

  return (
    <header className="border-b border-secondary/20 bg-surface px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3 sm:contents">
          <Link href="/" className="flex shrink-0 flex-col items-center gap-1">
            <img
              src="/dev-showcase-icon.png"
              alt="Dev Showcase"
              className="h-10 w-10 object-contain"
            />

            <span className="text-lg font-bold leading-tight text-text sm:text-xl">
              Dev <span className="text-primary">Showcase</span>
            </span>
          </Link>

          <nav className="flex items-center gap-3 text-sm sm:hidden">
            <Link
              href="/"
              className="font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>

            {user && profileHref && (
              <Link
                href={profileHref}
                className="font-medium transition-colors hover:text-primary"
              >
                Profile
              </Link>
            )}

            <AccountLink />
          </nav>
        </div>

        <div className="w-full min-w-0 sm:mx-6 sm:w-auto sm:max-w-md sm:flex-1">
          <Search />
        </div>

        <nav className="hidden shrink-0 items-center gap-5 sm:flex">
          <Link
            href="/"
            className="font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>

          {user && profileHref && (
            <Link
              href={profileHref}
              className="font-medium transition-colors hover:text-primary"
            >
              Profile
            </Link>
          )}

          <AccountLink />
        </nav>
      </div>
    </header>
  );
};

export default Header;
