import EditPageForm from "./form";
import { getSingleProject } from "@/lib/supabase/queries";

const EditPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const { data, error } = await getSingleProject(slug);

  if (error) {
    return <p>{error.message}</p>;
  }

  if (!data) {
    return <p>Project not found</p>;
  }

  return (
    <main className="px-6 py-12">
      <h1 className="heading">Edit Project</h1>
      <EditPageForm initialValues={data} projectId={data.id} />{" "}
    </main>
  );
};

export default EditPage;
