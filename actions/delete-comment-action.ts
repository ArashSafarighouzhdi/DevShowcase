"use server";

import { createClient } from "@/lib/supabase/serverClient";
import { revalidatePath } from "next/cache";

export const DeleteComment = async (commentId: string) => {
  const supabase = await createClient();

  const { data: comment, error: commentError } = await supabase
    .from("Comments")
    .select("project_id")
    .eq("id", commentId)
    .single();

  if (commentError) throw commentError;

  const { error } = await supabase
    .from("Comments")
    .update({ is_deleted: true })
    .eq("id", commentId);

  if (error) throw error;

  const { data: project, error: projectError } = await supabase
    .from("Projects")
    .select("slug")
    .eq("id", comment.project_id)
    .single();

  if (projectError) throw projectError;

  revalidatePath(`/${project.slug}`);
};
