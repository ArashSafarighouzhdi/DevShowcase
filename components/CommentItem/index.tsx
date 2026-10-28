"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import AddComment from "@/components/AddComment";
import CommentActions from "@/components/CommentActions";
import { CommentVote } from "@/actions/comment-vote-action";
import type { ProjectCommentsType } from "@/lib/supabase/queries";

type CommentItemProps = {
  comment: ProjectCommentsType[number];
  comments: ProjectCommentsType;
  projectId: string;
  userId: string | null;
  projectAuthor: string;
  depth?: number;
};

const CommentItem = ({
  comment,
  comments,
  projectId,
  userId,
  projectAuthor,
  depth = 0,
}: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const router = useRouter();

  const replies = comments.filter((reply) => reply.parent_id === comment.id);
  const indent = Math.min(depth, 2);

  const votes = comment.CommentVotes ?? [];
  const upvotes = votes.filter((vote) => vote.vote_type === "up").length;
  const downvotes = votes.filter((vote) => vote.vote_type === "down").length;

  const currentVote = votes.find((vote) => vote.user_id === userId)?.vote_type;

  const voteMutation = useMutation({
    mutationFn: (voteType: "up" | "down") => CommentVote(comment.id, voteType),
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <article className="relative py-3">
      <p className="font-semibold">{comment.author?.username ?? "Unknown"}</p>

      {comment.is_deleted ? (
        <p className="mt-1 text-sm italic text-muted">Comment deleted</p>
      ) : (
        <p className="mt-1 whitespace-pre-wrap text-sm">{comment.content}</p>
      )}

      <p className="mt-1 text-xs text-muted">
        {new Date(comment.created_at).toISOString().slice(0, 10)}
      </p>

      {!comment.is_deleted && (
        <>
          <div className="mt-2 flex h-6 items-center gap-4 text-sm">
            {userId && (
              <>
                <button
                  type="button"
                  className={`inline-flex h-6 items-center gap-1.5 transition-colors ${
                    currentVote === "up"
                      ? "text-primary"
                      : "text-muted hover:text-primary"
                  }`}
                  disabled={voteMutation.isPending}
                  onClick={() => voteMutation.mutate("up")}
                  aria-label="Upvote comment"
                  aria-pressed={currentVote === "up"}
                >
                  <ThumbsUp
                    size={18}
                    strokeWidth={1.8}
                    fill={currentVote === "up" ? "currentColor" : "none"}
                  />
                  <span className="min-w-3 text-center">{upvotes}</span>
                </button>

                <button
                  type="button"
                  className={`inline-flex h-6 items-center gap-1.5 transition-colors ${
                    currentVote === "down"
                      ? "text-primary"
                      : "text-muted hover:text-primary"
                  }`}
                  disabled={voteMutation.isPending}
                  onClick={() => voteMutation.mutate("down")}
                  aria-label="Downvote comment"
                  aria-pressed={currentVote === "down"}
                >
                  <ThumbsDown
                    size={18}
                    strokeWidth={1.8}
                    fill={currentVote === "down" ? "currentColor" : "none"}
                  />
                  <span className="min-w-3 text-center">{downvotes}</span>
                </button>

                <button
                  type="button"
                  className="inline-flex h-6 items-center font-semibold text-primary transition-opacity hover:opacity-75"
                  onClick={() => setIsReplying(!isReplying)}
                >
                  {isReplying ? "Cancel" : "Reply"}
                </button>
              </>
            )}

            {userId &&
              (userId === comment.author?.id || userId === projectAuthor) && (
                <CommentActions
                  commentId={comment.id}
                  content={comment.content}
                />
              )}
          </div>

          {isReplying && userId && (
            <div className="mt-3">
              <AddComment projectId={projectId} parentId={comment.id} />
            </div>
          )}
        </>
      )}

      {showReplies && replies.length > 0 && (
        <div
          className="relative mt-2 border-l-2 border-gray-200 pl-4"
          style={{ marginLeft: `${indent * 12}px` }}
        >
          {replies.map((reply) => (
            <div key={reply.id} className="relative">
              <span className="absolute -left-4 top-6 w-4 border-t-2 border-gray-200" />

              <CommentItem
                comment={reply}
                comments={comments}
                projectId={projectId}
                userId={userId}
                projectAuthor={projectAuthor}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default CommentItem;
