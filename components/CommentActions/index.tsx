"use client";

import { useState } from "react";
import { EditComment } from "@/actions/edit-comment-action";
import { DeleteComment } from "@/actions/delete-comment-action";
import { commentSchema } from "@/actions/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

type CommentActionsProps = {
  commentId: string;
  content: string;
};

const CommentActions = ({ commentId, content }: CommentActionsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { content },
  });

  const editMutation = useMutation({
    mutationFn: (values: z.infer<typeof commentSchema>) =>
      EditComment({ commentId, content: values.content }),
    onSuccess: () => {
      toast.success("Comment updated successfully.");
      setIsEditing(false);
      setIsMenuOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => DeleteComment(commentId),
    onSuccess: () => {
      toast.success("Comment deleted successfully.");
      setIsDeleteDialogOpen(false);
      setIsMenuOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        className="cursor-pointer rounded-full px-2 text-lg text-muted hover:bg-gray-100"
        aria-label="Comment options"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ···
      </button>

      {isMenuOpen && (
        <div className="absolute left-0 top-full z-20 mt-1 min-w-28 rounded-lg border bg-white py-1 shadow-lg">
          <button
            type="button"
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-gray-100"
            onClick={() => {
              reset({ content });
              setIsEditing(true);
              setIsMenuOpen(false);
            }}
          >
            Edit
          </button>

          <button
            type="button"
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
            onClick={() => {
              setIsDeleteDialogOpen(true);
              setIsMenuOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleSubmit((values) => editMutation.mutate(values))}
            className="w-full max-w-md space-y-3 rounded-xl bg-white p-5 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Edit comment
            </h3>

            <textarea
              {...register("content")}
              className="input w-full"
              autoFocus
            />

            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="button-secondary cursor-pointer"
                disabled={editMutation.isPending}
                onClick={() => {
                  reset({ content });
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="button cursor-pointer"
                disabled={editMutation.isPending}
              >
                {editMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete comment?
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="button-secondary cursor-pointer"
                disabled={deleteMutation.isPending}
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentActions;
