"use server";

import z from "zod";
import { commentSchema } from "./schemas";
import { createClient } from "@/lib/supabase/serverClient";
import { revalidatePath } from "next/cache";

export const AddComment = async (
  commentData: z.infer<typeof commentSchema>,
  projectId: string,
  parentId?: string,
) => {
  const parsedData = commentSchema.parse(commentData);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in to comment.");

  const { error } = await supabase.from("Comments").insert({
    content: parsedData.content,
    author: user.id,
    project_id: projectId,
    parent_id: parentId ?? null,
  });

  if (error) throw error;

  revalidatePath("/");
  return true;
};
