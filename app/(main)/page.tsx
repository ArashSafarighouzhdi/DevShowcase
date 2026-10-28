import Projects from "@/components/Projects";
import { createClient } from "@/lib/supabase/serverClient";
import { getHomeProjects } from "@/lib/supabase/queries";
import Hero from "@/components/Hero";

export const revalidate = 600;

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await getHomeProjects(supabase);

  if (error) {
    return (
      <main>
        <Hero />
        <p className="px-6 py-4 text-red-500">{error.message}</p>
      </main>
    );
  }

  const { data: ratings, error: ratingsError } = await supabase
    .from("Likes")
    .select("project_id, rating")
    .not("rating", "is", null);

  if (ratingsError) {
    console.error("Error fetching project ratings:", ratingsError.message);
  }

  const projectsWithRatings = (data ?? []).map((project) => {
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
    <>
      <main>
        <Hero />
        <Projects projects={projectsWithRatings} />
      </main>
    </>
  );
}
