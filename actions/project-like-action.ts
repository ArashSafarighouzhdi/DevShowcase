"use server";

import { createClient } from "@/lib/supabase/serverClient";
import { revalidatePath } from "next/cache";

export const ProjectLike = async (projectId: string, rating: number) => {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("You must be logged in to rate a project.");

  const { data: project, error: projectError } = await supabase
    .from("Projects")
    .select("slug")
    .eq("id", projectId)
    .single();

  if (projectError) throw projectError;

  const { error: ratingError } = await supabase.from("Likes").upsert(
    {
      user_id: user.id,
      project_id: projectId,
      rating,
    },
    {
      onConflict: "user_id,project_id",
    },
  );

  if (ratingError) throw ratingError;

  revalidatePath(`/${project.slug}`);
};
