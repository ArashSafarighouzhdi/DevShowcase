"use client";

import { EditProject } from "@/actions/edit-project-action";
import { projectSchema } from "@/actions/schemas";
import { type Tables } from "@/lib/supabase/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

const EditPageForm = ({
  initialValues,
  projectId,
}: {
  initialValues: Pick<
    Tables<"Projects">,
    | "title"
    | "description"
    | "category"
    | "technologies"
    | "github_url"
    | "live_url"
    | "images"
  >;
  projectId: string;
}) => {
  const [images, setImages] = useState<string[]>(initialValues.images ?? []);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");

  const projectSchemaWithImages = projectSchema.omit({ image: true }).extend({
    image: z
      .unknown()
      .transform((value) => value as FileList)
      .optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchemaWithImages),
    defaultValues: {
      title: initialValues.title,
      description: initialValues.description || undefined,
      category: initialValues.category ?? "",
      technologies: initialValues.technologies?.join(", ") || undefined,
      github_url: initialValues.github_url || undefined,
      live_url: initialValues.live_url || undefined,
    },
  });

  const { mutate, error } = useMutation({
    mutationFn: EditProject,
  });

  const addImage = (file: File) => {
    const totalSize =
      newImages.reduce((total, image) => total + image.size, 0) + file.size;

    if (totalSize > 1024 * 1024) {
      setImageError("The total new image size cannot exceed 1 MB.");
      return;
    }

    setImageError("");

    setNewImages((currentImages) => [...currentImages, file]);
  };

  const removeImage = (index: number) => {
    setImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const removeNewImage = (index: number) => {
    setNewImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index),
    );

    setImageError("");
  };

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const imageForm = new FormData();

        newImages.forEach((image) => {
          imageForm.append("image", image);
        });

        mutate({
          projectdata: {
            title: values.title,
            description: values.description,
            category: values.category,
            technologies: values.technologies,
            github_url: values.github_url,
            live_url: values.live_url,
            image: imageForm,
          },
          projectId,
          images,
        });
      })}
      className="mx-auto flex w-full max-w-2xl flex-col rounded-xl border p-6"
    >
      <label htmlFor="title">Project title</label>
      <input className="input" {...register("title")} />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      <label htmlFor="description">Project description</label>
      <textarea className="input" {...register("description")} />
      {errors.description && (
        <p className="text-red-500">{errors.description.message}</p>
      )}
      <label htmlFor="category">Project Category</label>
      <select className="input" {...register("category")}>
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
        <option value="FullStack">FullStack</option>
        <option value="AI & Machine Learning">AI & Machine Learning</option>
        <option value="Other">Other</option>
      </select>
      {errors.category && (
        <p className="text-red-500">{errors.category.message}</p>
      )}
      <label htmlFor="technologies">Technologies</label>
      <input className="input" {...register("technologies")} />
      {errors.technologies && (
        <p className="text-red-500">{errors.technologies.message}</p>
      )}
      <label htmlFor="github_url">GitHub URL</label>
      <input className="input" {...register("github_url")} />
      {errors.github_url && (
        <p className="text-red-500">{errors.github_url.message}</p>
      )}
      <label htmlFor="live_url">Live Demo URL</label>
      <input className="input" {...register("live_url")} />
      {errors.live_url && (
        <p className="text-red-500">{errors.live_url.message}</p>
      )}
      <div className="mt-4">
        <p className="font-semibold">Current images</p>

        <div className="mt-3 space-y-3">
          {images.map((image, index) => (
            <div
              key={image}
              className="flex items-center justify-between rounded-xl border p-3"
            >
              <img
                src={image}
                alt={initialValues.title}
                className="h-20 w-20 rounded-lg object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <p className="mt-6 font-semibold">Add new images</p>

        <p className="text-sm text-muted">Maximum total size: 1 MB</p>

        <label className="mt-3 inline-block cursor-pointer rounded-xl border-2 border-dashed px-5 py-3">
          + Add image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                addImage(file);
              }

              event.target.value = "";
            }}
          />
        </label>

        {imageError && <p className="mt-2 text-red-500">{imageError}</p>}

        <div className="mt-4 space-y-2">
          {newImages.map((image, index) => (
            <div
              key={`${image.name}-${index}`}
              className="flex items-center justify-between rounded-xl border p-3"
            >
              <span className="text-sm">{image.name}</span>

              <button
                type="button"
                onClick={() => removeNewImage(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <button className="button mt-4">Save Changes</button>
      {error && !error.message.includes("NEXT_REDIRECT") && (
        <p>{error.message}</p>
      )}{" "}
    </form>
  );
};

export default EditPageForm;
