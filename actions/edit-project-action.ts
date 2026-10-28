"use server";

import z from "zod";
import { projectSchema } from "./schemas";
import { createClient } from "@/lib/supabase/serverClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/supabase/slugify";
import { uploadImage } from "@/lib/supabase/upload-image";

export const EditProject = async ({
  projectdata,
  projectId,
  images,
}: {
  projectdata: z.infer<typeof projectSchema>;
  projectId: string;
  images: string[];
}) => {
  const parsedData = projectSchema.parse(projectdata);

  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("Projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) throw error;

  if (!project) {
    throw new Error("Project doesn't exist!");
  }

  const { data: profile, error: profileError } = await supabase
    .from("Users")
    .select("username")
    .eq("id", project.author)
    .single();

  if (profileError) {
    throw profileError;
  }

  const imageFiles = projectdata.image?.getAll("image");

  const imageUrls = [...images];

  if (imageFiles && imageFiles.length > 0) {
    for (const imageFile of imageFiles) {
      if (!(imageFile instanceof File)) {
        throw new Error("Image is not in a valid format");
      }

      const imageUrl = await uploadImage(imageFile);

      imageUrls.push(imageUrl);
    }
  }

  const { data: updatedProject, error: updateError } = await supabase
    .from("Projects")
    .update({
      title: parsedData.title,
      description: parsedData.description,
      category: parsedData.category,
      technologies: parsedData.technologies
        ? parsedData.technologies.split(",").map((item) => item.trim())
        : null,
      github_url: parsedData.github_url,
      live_url: parsedData.live_url,
      images: imageUrls,
      slug: `${slugify(profile.username)}-${slugify(parsedData.title)}`,
    })
    .eq("id", projectId)
    .select("slug")
    .single();

  if (updateError) {
    if (updateError.code === "23505") {
      throw new Error("You already have a project with this title.");
    }

    throw updateError;
  }

  revalidatePath("/");

  redirect(`/${updatedProject.slug}`);
};
