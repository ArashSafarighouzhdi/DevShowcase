import { getUserProfile } from "@/lib/supabase/queries";
import EditProfileForm from "./form";
import DeleteButton from "./deleteButton";

const EditProfilePage = async ({
  params,
}: {
  params: Promise<{ user: string }>;
}) => {
  const { user } = await params;

  const { data, error } = await getUserProfile(user);

  if (error) {
    return <p>{error.message}</p>;
  }

  if (!data) {
    return <p>Profile not found</p>;
  }

  return (
    <main className="px-6 py-12">
      <h1 className="heading">Edit Profile</h1>

      <EditProfileForm initialValues={data} userId={data.id} />

      <div className="mx-auto mt-6 max-w-2xl">
        <DeleteButton id={data.id} />
      </div>
    </main>
  );
};

export default EditProfilePage;
