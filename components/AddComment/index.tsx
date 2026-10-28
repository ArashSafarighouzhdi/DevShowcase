"use client";

import { AddComment as AddCommentAction } from "@/actions/add-comment-action";
import { commentSchema } from "@/actions/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

type AddCommentProps = {
  projectId: string;
  parentId?: string;
};

const AddComment = ({ projectId, parentId }: AddCommentProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentSchema),
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof commentSchema>) =>
      AddCommentAction(values, projectId, parentId),
    onSuccess: () => {
      toast.success(
        parentId ? "Reply added successfully." : "Comment added successfully.",
      );
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => mutate(values))}
      className="mt-4 space-y-3"
    >
      <textarea
        {...register("content")}
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        className="input w-full"
      />

      {errors.content && (
        <p className="text-red-500">{errors.content.message}</p>
      )}

      {error && !error.message.includes("NEXT_REDIRECT") && (
        <p>{error.message}</p>
      )}
      <button type="submit" className="button" disabled={isPending}>
        {isPending ? "Posting..." : parentId ? "Reply" : "Add Comment"}
      </button>
    </form>
  );
};

export default AddComment;
