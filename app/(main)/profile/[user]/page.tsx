import { getUserProfile, getUserProjects } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/serverClient";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ user: string }>;
}) => {
  const { user } = await params;

  const { data, error } = await getUserProfile(user);

  if (error && !error.message.includes("NEXT_REDIRECT")) {
    return <p className="px-6 py-8 text-red-500">{error.message}</p>;
  }

  if (!data) {
    return <p className="px-6 py-8 text-muted">Profile not found.</p>;
  }

  const { data: projects, error: projectsError } = await getUserProjects(
    data.id,
  );

  if (projectsError && !projectsError.message.includes("NEXT_REDIRECT")) {
    return <p className="px-6 py-8 text-red-500">{projectsError.message}</p>;
  }

  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isOwner = currentUser?.id === data.id;

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-2xl border border-primary/20 bg-surface shadow-sm">
          <div className="h-2 bg-primary" />

          <div className="px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col items-center text-center">
              {data.avatar ? (
                <img
                  src={data.avatar}
                  alt={`${data.username}'s profile`}
                  className="h-28 w-28 rounded-full border-4 border-surface object-cover shadow-md ring-2 ring-primary/20"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary ring-2 ring-primary/20">
                  {data.username.charAt(0).toUpperCase()}
                </div>
              )}

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-text sm:text-4xl">
                {data.username}
              </h1>

              <p className="mt-2 text-sm font-medium text-primary">
                Developer Profile
              </p>

              {data.bio ? (
                <p className="mx-auto max-w-full whitespace-pre-wrap wrap-break-word text-sm leading-6 text-muted-foreground">
                  {data.bio}
                </p>
              ) : (
                <p className="mt-5 text-sm text-muted">No bio added yet.</p>
              )}

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                {data.github_url && (
                  <a
                    href={data.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-secondary"
                  >
                    GitHub
                  </a>
                )}

                {isOwner && (
                  <Link
                    href={`/profile/${data.username}/edit`}
                    className="button"
                  >
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-text sm:text-3xl">
                Projects by {data.username}
              </h2>
              <p className="mt-2 text-sm text-muted">
                Explore this developer's work and projects.
              </p>
            </div>

            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
              {projects?.length ?? 0}{" "}
              {(projects?.length ?? 0) === 1 ? "project" : "projects"}
            </span>
          </div>

          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description ?? ""}
                  author={project.author?.username ?? "Unknown"}
                  avatar={project.author?.avatar ?? null}
                  slug={project.slug}
                  averageRating={0}
                  ratingsCount={0}
                  category={project.category}
                  images={project.images}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-primary/30 px-6 py-12 text-center">
              <h3 className="text-lg font-semibold text-text">
                No projects yet
              </h3>
              <p className="mt-2 text-sm text-muted">
                {isOwner
                  ? "Share your first project with the developer community."
                  : "This developer hasn't published any projects yet."}
              </p>

              {isOwner && (
                <Link href="/create" className="button mt-5 inline-flex">
                  Create Project
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
