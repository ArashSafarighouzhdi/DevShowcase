"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { ProjectLike as ProjectLikeAction } from "@/actions/project-like-action";

type ProjectLikeProps = {
  projectId: string;
  userId: string | null;
  initialRating: number | null;
  averageRating: number;
  ratingsCount: number;
};

const ProjectLike = ({
  projectId,
  userId,
  initialRating,
  averageRating,
  ratingsCount,
}: ProjectLikeProps) => {
  const [selectedRating, setSelectedRating] = useState(initialRating ?? 0);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (rating: number) => ProjectLikeAction(projectId, rating),
    onSuccess: (_, rating) => {
      setSelectedRating(rating);
      router.refresh();
      toast.success("Your rating has been saved.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1" aria-label="Rate this project">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            disabled={!userId || mutation.isPending}
            onClick={() => mutation.mutate(rating)}
            aria-label={`Rate ${rating} out of 5 stars`}
            aria-pressed={selectedRating === rating}
            title={
              !userId
                ? "Log in to rate this project"
                : `Rate ${rating} out of 5`
            }
            className="transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Star
              size={22}
              strokeWidth={1.8}
              className={
                rating <= selectedRating
                  ? "text-primary"
                  : "text-muted hover:text-primary"
              }
              fill={rating <= selectedRating ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>

      <span className="text-sm font-semibold">
        {averageRating.toFixed(1)}/5
      </span>

      <span className="text-sm text-muted">
        ({ratingsCount} {ratingsCount === 1 ? "rating" : "ratings"})
      </span>
    </div>
  );
};

export default ProjectLike;
