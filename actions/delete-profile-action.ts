"use server";

import { createClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";

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

  await supabase.from("Users").delete().eq("id", userId).throwOnError();

  redirect("/");
};
