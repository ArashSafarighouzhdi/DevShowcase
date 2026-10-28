import { getSingleProject } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/serverClient";
import ImageGallery from "@/components/ImageGallery";
import Link from "next/link";
import DeleteButton from "./deleteButton";
import Comments from "@/components/Comments";
import ProjectLike from "@/components/ProjectLike";

const ProjectPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const { data, error } = await getSingleProject(slug);

  if (error) {
    return <p>{error.message}</p>;
  }

  if (!data) {
    return <p>Project not found</p>;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthor = user?.id === data.author?.id;

  const { data: ratings, error: ratingsError } = await supabase
    .from("Likes")
    .select("rating")
    .eq("project_id", data.id)
    .not("rating", "is", null);

  if (ratingsError) {
    console.error("Error fetching project ratings:", ratingsError.message);
  }

  const validRatings = (ratings ?? []).filter(
    (item) => item.rating !== null && item.rating >= 1 && item.rating <= 5,
  );

  const ratingsCount = validRatings.length;

  const averageRating =
    ratingsCount > 0
      ? validRatings.reduce((sum, item) => sum + item.rating!, 0) / ratingsCount
      : 0;

  let initialRating: number | null = null;

  if (user) {
    const { data: existingRating, error: ratingError } = await supabase
      .from("Likes")
      .select("rating")
      .eq("project_id", data.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (ratingError) {
      console.error(
        "Error fetching current user's rating:",
        ratingError.message,
      );
    }

    initialRating = existingRating?.rating ?? null;
  }

  return (
    <main className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-primary/20 bg-surface shadow-sm">
          <div className="h-2 bg-primary" />

          <div className="p-8">
            <h1 className="text-4xl font-bold">{data.title}</h1>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-muted">
                By {data.author?.username ?? "Unknown"}
              </p>

              <div>
                <ProjectLike
                  projectId={data.id}
                  userId={user?.id ?? null}
                  initialRating={initialRating}
                  averageRating={averageRating}
                  ratingsCount={ratingsCount}
                />

                {data.category && (
                  <div className="mt-3">
                    <span className="inline-block rounded-full border border-blue-100 px-3 py-1 text-sm">
                      {data.category}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isAuthor && (
              <div className="mt-4 flex gap-3">
                <Link href={`/${slug}/edit`} className="button-secondary">
                  Edit
                </Link>

                <DeleteButton id={data.id} />
              </div>
            )}

            {data.images && data.images.length > 0 && (
              <ImageGallery images={data.images} title={data.title} />
            )}

            <div className="mt-8">
              <h2 className="text-2xl font-bold">Description</h2>
              <p className="mt-2 whitespace-pre-wrap wrap-break-word text-muted">
                {data.description ?? "No description available."}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold">Technologies</h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {data.technologies?.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full border border-blue-100 px-3 py-1 text-sm"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
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

              {data.live_url && (
                <a
                  href={data.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>

        <Comments projectId={data.id} />
      </div>
    </main>
  );
};

export default ProjectPage;
