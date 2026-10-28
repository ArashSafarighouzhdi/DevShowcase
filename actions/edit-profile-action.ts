"use server";

import z from "zod";
import { profileSchema } from "./schemas";
import { createClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";

export const EditProfile = async ({
  profileData,
  userId,
}: {
  profileData: z.infer<typeof profileSchema>;
  userId: string;
}) => {
  const parsedData = profileSchema.parse(profileData);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    throw new Error("Unauthorized access!");
  }

  const { data: updatedProfile, error } = await supabase
    .from("Users")
    .update({
      username: parsedData.username,
      bio: parsedData.bio,
      github_url: parsedData.github_url,
      avatar: parsedData.avatar,
    })
    .eq("id", userId)
    .select("username")
    .single();

  if (error) throw error;

  redirect(`/profile/${updatedProfile.username}`);
};
