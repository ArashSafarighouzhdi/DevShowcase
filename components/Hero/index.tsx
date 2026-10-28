const Hero = () => {
  return (
    <section
      className="relative mx-4 mt-4 overflow-hidden rounded-2xl border border-blue-100 bg-background px-6 py-16 text-text sm:px-10 lg:px-12 lg:py-20"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(248,250,252,0.96) 0%, rgba(248,250,252,0.88) 40%, rgba(248,250,252,0.15) 100%), url('/hero-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
        <div>
          <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
            Discover what <span className="text-primary">developers build</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Share your projects, get feedback, and connect with a community of
            developers.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#projects" className="button">
              Explore Projects
            </a>

            <a
              href="/create"
              className="rounded-xl border border-primary/30 bg-white/80 px-5 py-3 font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              Create Project
            </a>
          </div>
        </div>

        <div className="hidden md:block" aria-hidden="true" />
      </div>
    </section>
  );
};

export default Hero;
