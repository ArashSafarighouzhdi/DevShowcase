import ProjectCard from "@/components/ProjectCard";
import { createClient } from "@/lib/supabase/serverClient";
import { getHomeProjects } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const selectedCategory = decodeURIComponent(category);

  const supabase = await createClient();
  const { data, error } = await getHomeProjects(supabase);

  if (error) {
    return <p className="px-6 py-4 text-red-500">{error.message}</p>;
  }

  const filteredProjects = (data ?? []).filter(
    (project) => project.category === selectedCategory,
  );

  if (filteredProjects.length === 0) {
    notFound();
  }

  const { data: ratings, error: ratingsError } = await supabase
    .from("Likes")
    .select("project_id, rating")
    .not("rating", "is", null);

  if (ratingsError) {
    console.error("Error fetching project ratings:", ratingsError.message);
  }

  const projectsWithRatings = filteredProjects.map((project) => {
    const projectRatings = (ratings ?? []).filter(
      (item) =>
        item.project_id === project.id &&
        item.rating !== null &&
        item.rating >= 1 &&
        item.rating <= 5,
    );

    const ratingsCount = projectRatings.length;

    const averageRating =
      ratingsCount > 0
        ? projectRatings.reduce((sum, item) => sum + item.rating!, 0) /
          ratingsCount
        : 0;

    return {
      ...project,
      averageRating,
      ratingsCount,
    };
  });

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <section className="rounded-xl border border-primary/20 p-8 text-center">
          <h1 className="text-3xl font-bold">{selectedCategory}</h1>

          <p className="mt-2 text-muted">
            Projects in the {selectedCategory} category
          </p>
        </section>

        <section className="mt-12">
          <div className="grid gap-6 md:grid-cols-2">
            {projectsWithRatings.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description ?? ""}
                category={project.category}
                author={project.author?.username ?? "Unknown"}
                slug={project.slug}
                averageRating={project.averageRating}
                ratingsCount={project.ratingsCount}
                images={project.images}
                avatar={project.author?.avatar ?? null}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
