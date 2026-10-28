"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteProject, getProjectDeleteInfo } from "@/actions/delete-action";

const DeleteButton = ({ id }: { id: string }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState<number | null>(null);
  const [ratingsCount, setRatingsCount] = useState<number | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: DeleteProject,

    onSuccess: () => {
      toast.success("Your project has been deleted");
      router.push("/");
      router.refresh();
    },

    onError: (error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });

  const openConfirmation = async () => {
    setIsOpen(true);
    setIsLoadingInfo(true);

    try {
      const info = await getProjectDeleteInfo(id);
      setCommentsCount(info.commentsCount);
      setRatingsCount(info.ratingsCount);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load project information.",
      );
      setIsOpen(false);
    } finally {
      setIsLoadingInfo(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openConfirmation}
        className="button-secondary"
      >
        Delete Project
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isPending) {
              setIsOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            className="w-full max-w-md rounded-2xl border bg-background p-6 text-text shadow-xl"
          >
            <h2 id="delete-project-title" className="text-xl font-bold">
              Delete Project?
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              Are you sure you want to permanently delete this project?
            </p>

            {isLoadingInfo ? (
              <p className="mt-4 text-sm text-muted">
                Loading project information...
              </p>
            ) : (
              <>
                <div className="mt-4 rounded-xl bg-primary/5 p-4 text-sm">
                  <p>
                    <strong>{commentsCount ?? 0}</strong>{" "}
                    {(commentsCount ?? 0) === 1 ? "comment" : "comments"}
                  </p>

                  <p className="mt-2">
                    <strong>{ratingsCount ?? 0}</strong>{" "}
                    {(ratingsCount ?? 0) === 1 ? "rating" : "ratings"}
                  </p>
                </div>

                <p className="mt-4 text-sm text-red-600">
                  The project and all associated data will be permanently
                  deleted. This action cannot be undone.
                </p>
              </>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/5 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => mutate(id)}
                disabled={
                  isLoadingInfo ||
                  isPending ||
                  commentsCount === null ||
                  ratingsCount === null
                }
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
