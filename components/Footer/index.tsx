import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-0 border-t border-secondary/20 bg-surface text-text">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-items-center gap-6 px-6 py-1 sm:grid-cols-3 sm:gap-8">
        <div className="w-full max-w-xs">
          <Link
            href="/"
            className="inline-block text-lg font-bold transition-colors hover:text-primary"
          >
            Dev <span className="text-primary">Showcase</span>
          </Link>

          <p className="mt-1 max-w-sm text-sm leading-5 text-muted">
            Discover projects, connect with developers, and share what you
            build.
          </p>
        </div>

        <div className="w-full max-w-xs">
          <h2 className="text-sm font-semibold">Quick Links</h2>

          <nav className="mt-1 flex flex-col items-start text-sm text-muted">
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>

            <Link
              href="/auth/login"
              className="transition-colors hover:text-primary"
            >
              Login
            </Link>

            <Link
              href="/auth/signup"
              className="transition-colors hover:text-primary"
            >
              Sign Up
            </Link>
          </nav>
        </div>

        <div className="w-full max-w-xs">
          <h2 className="text-sm font-semibold">
            Developed by <span className="text-primary">Arash</span>
          </h2>

          <nav className="mt-1 flex flex-col items-start text-sm text-muted">
            <a
              href="https://safariarash.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              Portfolio
            </a>

            <a
              href="https://github.com/ArashSafarighouzhdi"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/safariarash/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              LinkedIn
            </a>
          </nav>
        </div>
      </div>

      <div className="border-t border-secondary/20 px-4 py-2 text-center text-xs text-muted">
        © 2026 DevShowcase - All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
