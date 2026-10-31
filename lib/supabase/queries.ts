import { createClient } from "./browserClient";
import { type QueryData } from "@supabase/supabase-js";

export const getHomeProjects = async (
  supabase: ReturnType<typeof createClient>,
) => {
  return await supabase
    .from("Projects")
    .select(
      'id, title, description, images, technologies, category, slug, author("id", "username", "avatar")',
    )
    .order("created_at", { ascending: false });
};

export const getSingleProject = async (slug: string) => {
  const supabase = createClient();

  return await supabase
    .from("Projects")
    .select(
      'id, title, description, images, technologies, category, github_url, live_url, author("id", "username")',
    )
    .eq("slug", slug)
    .single();
};

export const searchProjects = async (searchTerm: string) => {
  const supabase = createClient();

  return await supabase
    .from("Projects")
    .select("title, slug")
    .ilike("title", `${searchTerm}%`);
};

export const getUserProfile = async (username: string) => {
  const supabase = createClient();

  return await supabase
    .from("Users")
    .select("id, username, bio, avatar, github_url, is_deleted")
    .eq("username", username)
    .eq("is_deleted", false)
    .single();
};

export const getUserProjects = async (userId: string) => {
  const supabase = createClient();

  return await supabase
    .from("Projects")
    .select(
      'id, title, description, images, technologies, category, slug, author("id", "username", "avatar")',
    )
    .eq("author", userId)
    .order("created_at", { ascending: false });
};

export const getProjectComments = async (projectId: string) => {
  const supabase = createClient();

  return await supabase
    .from("Comments")
    .select(
      'id, content, created_at, author("id", "username"), parent_id, is_deleted, CommentVotes(user_id, vote_type)',
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
};

export type HomeProjectType = QueryData<ReturnType<typeof getHomeProjects>>;

export type SingleProjectType = QueryData<ReturnType<typeof getSingleProject>>;

export type SearchResultType = QueryData<ReturnType<typeof searchProjects>>;

export type UserProfileType = QueryData<ReturnType<typeof getUserProfile>>;

export type UserProjectsType = QueryData<ReturnType<typeof getUserProjects>>;

export type ProjectCommentsType = QueryData<
  ReturnType<typeof getProjectComments>
>;
