"use server";

import z from "zod";
import { projectSchema } from "./schemas";
import { createClient } from "@/lib/supabase/serverClient";
import { slugify } from "@/lib/supabase/slugify";
import { redirect } from "next/navigation";
import { uploadImage } from "@/lib/supabase/upload-image";

export const CreateProject = async (
  projectData: z.infer<typeof projectSchema>,
) => {
  const parsedData = projectSchema.parse(projectData);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized access!");
  }

  const { data: profile, error: profileError } = await supabase
    .from("Users")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  const imageFiles = projectData.image?.getAll("image");
  const imageUrls: string[] = [];

  if (imageFiles) {
    for (const imageFile of imageFiles) {
      if (!(imageFile instanceof File)) {
        throw new Error("Image is not in a valid format");
      }

      const imageUrl = await uploadImage(imageFile);
      imageUrls.push(imageUrl);
    }
  }

  const { error } = await supabase.from("Projects").insert({
    title: parsedData.title,
    description: parsedData.description,
    category: parsedData.category,
    technologies: parsedData.technologies
      ? parsedData.technologies.split(",").map((item) => item.trim())
      : null,
    github_url: parsedData.github_url,
    live_url: parsedData.live_url,
    images: imageUrls.length > 0 ? imageUrls : null,
    slug: `${slugify(profile.username)}-${slugify(parsedData.title)}`,
    author: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("You already have a project with this title.");
    }

    throw error;
  }

  redirect("/");
};
