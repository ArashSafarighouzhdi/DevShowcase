import { z } from "zod";

export const logInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUPSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(5, "Username must be at least 5 characters"),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  technologies: z.string().optional(),
  github_url: z.string().url("Please enter a valid GitHub URL").optional(),
  live_url: z.string().url("Please enter a valid Live Demo URL").optional(),
  image: z.instanceof(FormData).optional(),
});

export const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().optional(),
  github_url: z.string().url("Please enter a valid GitHub URL").optional(),
  avatar: z.string().nullable().optional(),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long"),
});
