"use client";

import { CreateProject } from "@/actions/create-project-action";
import { projectSchema } from "@/actions/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

const CreateForm = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");

  const projectSchemaWithImages = projectSchema.omit({ image: true }).extend({
    image: z.custom<FileList>().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof projectSchemaWithImages>>({
    resolver: zodResolver(projectSchemaWithImages),
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: CreateProject,
  });

  const addImage = (file: File) => {
    const totalSize =
      images.reduce((total, image) => total + image.size, 0) + file.size;

    if (totalSize > 1024 * 1024) {
      setImageError("The total image size cannot exceed 1 MB.");
      return;
    }

    setImageError("");
    setImages((currentImages) => [...currentImages, file]);
  };

  const removeImage = (index: number) => {
    setImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index),
    );

    setImageError("");
  };

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const imageForm = new FormData();

        images.forEach((image) => {
          imageForm.append("image", image);
        });

        mutate({
          title: values.title,
          description: values.description,
          category: values.category,
          technologies: values.technologies,
          github_url: values.github_url,
          live_url: values.live_url,
          image: imageForm,
        });
      })}
      className="mx-auto max-w-2xl p-6"
    >
      <input
        type="text"
        placeholder="Project title"
        className="input w-full"
        {...register("title")}
      />

      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <textarea
        placeholder="Project description"
        className="input w-full"
        {...register("description")}
      />

      {errors.description && (
        <p className="text-red-500">{errors.description.message}</p>
      )}

      <select
        className="input w-full"
        defaultValue=""
        {...register("category")}
      >
        <option value="" disabled>
          Select a category
        </option>
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
        <option value="FullStack">FullStack</option>
        <option value="AI & Machine Learning">AI & Machine Learning</option>
        <option value="Other">Other</option>
      </select>

      {errors.category && (
        <p className="text-red-500">{errors.category.message}</p>
      )}

      <input
        type="text"
        placeholder="Technologies (React, Next.js, TypeScript)"
        className="input w-full"
        {...register("technologies")}
      />

      {errors.technologies && (
        <p className="text-red-500">{errors.technologies.message}</p>
      )}

      <input
        type="url"
        placeholder="GitHub URL"
        className="input w-full"
        {...register("github_url")}
      />

      {errors.github_url && (
        <p className="text-red-500">{errors.github_url.message}</p>
      )}

      <input
        type="url"
        placeholder="Live Demo URL"
        className="input w-full"
        {...register("live_url")}
      />

      {errors.live_url && (
        <p className="text-red-500">{errors.live_url.message}</p>
      )}

      <div className="mt-4">
        <p className="font-semibold">Project images</p>
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
          {images.map((image, index) => (
            <div
              key={`${image.name}-${index}`}
              className="flex items-center justify-between rounded-xl border p-3"
            >
              <span className="text-sm">{image.name}</span>

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
      </div>

      {error && !error.message.includes("NEXT_REDIRECT") && (
        <p className="mt-4 text-red-500">{error.message}</p>
      )}

      <button type="submit" className="button mt-4" disabled={isPending}>
        {isPending ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
};

export default CreateForm;
