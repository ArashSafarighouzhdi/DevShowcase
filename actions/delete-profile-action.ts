"use server";

import { createClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/adminClient";

export const DeleteProfile = async (userId: string) => {
  const supabase = await createClient();

  const { data: projects, error: projectsError } = await supabase
    .from("Projects")
    .select("id")
    .eq("author", userId);

  if (projectsError) throw projectsError;

  if (projects && projects.length > 0) {
    throw new Error(
      "You cannot delete your profile while you still have projects.",
    );
  }
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user.id !== userId) {
    throw new Error("You are not authorized to delete this profile.");
  }

  const admin = createAdminClient();

  const { error: profileError } = await admin
    .from("Users")
    .update({
      bio: null,
      avatar: null,
      github_url: null,
      is_deleted: true,
    })
    .eq("id", user.id);

  if (profileError) throw profileError;

  const { error: deleteAuthError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteAuthError) throw deleteAuthError;
  const { error: signOutError } = await supabase.auth.signOut({
    scope: "local",
  });

  if (signOutError) throw signOutError;

  redirect("/");
};
