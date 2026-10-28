"use client";

import { useState } from "react";
import { EditProfile } from "@/actions/edit-profile-action";
import { profileSchema } from "@/actions/schemas";
import { type Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/browserClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const EditProfileForm = ({
  initialValues,
  userId,
}: {
  initialValues: Pick<
    Tables<"Users">,
    "username" | "bio" | "github_url" | "avatar"
  >;
  userId: string;
}) => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialValues.avatar ?? "");
  const [avatarError, setAvatarError] = useState("");

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialValues.username,
      bio: initialValues.bio || undefined,
      github_url: initialValues.github_url || undefined,
    },
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: EditProfile,
  });

  const handleAvatarChange = (file: File | undefined) => {
    setAvatarError("");

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setAvatarError("Choose a JPEG, PNG, or WebP image.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(400 / image.width, 400 / image.height, 1);

      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);

      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(imageUrl);
        setAvatarError("Could not process this image.");
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(imageUrl);

          if (!blob) {
            setAvatarError("Could not compress this image.");
            return;
          }

          if (blob.size > MAX_FILE_SIZE) {
            setAvatarError("The processed image must be 2 MB or smaller.");
            return;
          }

          const compressedFile = new File([blob], "avatar.webp", {
            type: "image/webp",
          });

          setAvatar(compressedFile);
          setPreview(URL.createObjectURL(compressedFile));
        },
        "image/webp",
        0.8,
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      setAvatarError("Could not read this image.");
    };

    image.src = imageUrl;
  };

  const onSubmit = async (values: {
    username: string;
    bio?: string;
    github_url?: string;
  }) => {
    setAvatarError("");

    try {
      let avatarUrl = initialValues.avatar;

      if (avatar) {
        const filePath = `${userId}/avatar-${Date.now()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatar, {
            upsert: true,
            contentType: "image/webp",
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = `${publicUrlData.publicUrl}?updated=${Date.now()}`;
      }

      mutate({
        profileData: {
          ...values,
          avatar: avatarUrl,
        },
        userId,
      });
    } catch (error) {
      setAvatarError(
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading the avatar.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit((values) => {
        void onSubmit(values);
      })}
      className="mx-auto flex w-full max-w-2xl flex-col rounded-xl border p-6 "
    >
      {preview && (
        <img
          src={preview}
          alt="Avatar preview"
          className="mb-3 mt-2 h-24 w-24 rounded-full object-cover"
        />
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="input"
        onChange={(event) => handleAvatarChange(event.target.files?.[0])}
      />

      <p className="mt-1 text-sm text-muted">
        Accepted formats: JPEG, PNG, and WebP. Images are automatically resized
        to a maximum of 400*400 pixels and converted to WebP.
      </p>

      {avatarError && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {avatarError}
        </p>
      )}

      {error && !error.message.includes("NEXT_REDIRECT") && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {error.message}
        </p>
      )}

      <label className="mt-4">Bio</label>

      <textarea {...register("bio")} className="input" rows={5} />

      <label className="mt-4">GitHub URL</label>

      <input
        {...register("github_url")}
        className="input"
        placeholder="https://github.com/username"
      />

      {errors.github_url && (
        <p className="text-red-500">{errors.github_url.message}</p>
      )}

      <button type="submit" className="button mt-4" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditProfileForm;
