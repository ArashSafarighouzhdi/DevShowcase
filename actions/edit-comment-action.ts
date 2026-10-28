"use server";

import z from "zod";
import { commentSchema } from "./schemas";
import { createClient } from "@/lib/supabase/serverClient";
import { revalidatePath } from "next/cache";

export const EditComment = async ({
  commentId,
  content,
}: {
  commentId: string;
  content: z.infer<typeof commentSchema>["content"];
}) => {
  const parsedData = commentSchema.parse({ content });

  const supabase = await createClient();

  const { data: comment, error: commentError } = await supabase
    .from("Comments")
    .select("project_id")
    .eq("id", commentId)
    .single();

  if (commentError) throw commentError;

  const { error } = await supabase
    .from("Comments")
    .update({ content: parsedData.content })
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
