"use server";

import { createClient } from "@/lib/supabase/serverClient";
import { revalidatePath } from "next/cache";

export const CommentVote = async (
  commentId: string,
  voteType: "up" | "down",
) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("You must be logged in to vote.");

  const { data: comment, error: commentError } = await supabase
    .from("Comments")
    .select("project_id")
    .eq("id", commentId)
    .single();

  if (commentError) throw commentError;

  const { data: existingVote, error: voteError } = await supabase
    .from("CommentVotes")
    .select("id, vote_type")
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (voteError) throw voteError;

  if (existingVote?.vote_type === voteType) {
    const { error } = await supabase
      .from("CommentVotes")
      .delete()
      .eq("id", existingVote.id);

    if (error) throw error;
  } else if (existingVote) {
    const { error } = await supabase
      .from("CommentVotes")
      .update({ vote_type: voteType })
      .eq("id", existingVote.id);

    if (error) throw error;
  } else {
    const { error } = await supabase.from("CommentVotes").insert({
      user_id: user.id,
      comment_id: commentId,
      vote_type: voteType,
    });

    if (error) throw error;
  }

  const { data: project, error: projectError } = await supabase
    .from("Projects")
    .select("slug")
    .eq("id", comment.project_id)
    .single();

  if (projectError) throw projectError;

  revalidatePath(`/${project.slug}`);
};
