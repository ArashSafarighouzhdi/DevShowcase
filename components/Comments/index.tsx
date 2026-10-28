import { getProjectComments } from "@/lib/supabase/queries";
import AddComment from "@/components/AddComment";
import CommentItem from "@/components/CommentItem";
import { createClient } from "@/lib/supabase/serverClient";

const Comments = async ({ projectId }: { projectId: string }) => {
  const { data, error } = await getProjectComments(projectId);

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: project, error: projectError } = await supabase
    .from("Projects")
    .select("author")
    .eq("id", projectId)
    .single();

  if (projectError) {
    return <p className="text-red-500">{projectError.message}</p>;
  }

  const comments = data.filter((comment) => comment.parent_id === null);

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold">Comments ({data.length})</h2>

      {comments.length === 0 ? (
        <p className="mt-4 text-muted">No comments yet.</p>
      ) : (
        <div className="mt-2 divide-y">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              comments={data}
              projectId={projectId}
              userId={user?.id ?? null}
              projectAuthor={project.author}
              depth={0}
            />
          ))}
        </div>
      )}

      {user && (
        <div className="mt-4 border-t pt-4">
          <AddComment projectId={projectId} />
        </div>
      )}
    </section>
  );
};

export default Comments;
