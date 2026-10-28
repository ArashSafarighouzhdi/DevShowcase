"use server";

import { createClient } from "@/lib/supabase/serverClient";

export const getProjectDeleteInfo = async (projectId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in.");
  }

  const { data: project, error: projectError } = await supabase
    .from("Projects")
    .select("id, author")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    throw new Error("Project not found.");
  }

  if (project.author !== user.id) {
    throw new Error("You are not allowed to delete this project.");
  }

  const [commentsResult, ratingsResult] = await Promise.all([
    supabase
      .from("Comments")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId),

    supabase
      .from("Likes")
      .select("project_id", { count: "exact", head: true })
      .eq("project_id", projectId)
      .not("rating", "is", null),
  ]);

  if (commentsResult.error || ratingsResult.error) {
    throw new Error("Could not load project information.");
  }

  return {
    commentsCount: commentsResult.count ?? 0,
    ratingsCount: ratingsResult.count ?? 0,
  };
};

export const DeleteProject = async (projectId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in.");
  }

  const { error } = await supabase
    .from("Projects")
    .delete()
    .eq("id", projectId)
    .eq("author", user.id);

  if (error) {
    throw new Error("Failed to delete project.");
  }

  return { success: true };
};
