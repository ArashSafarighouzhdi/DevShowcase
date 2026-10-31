"use client";

import { DeleteProfile } from "@/actions/delete-profile-action";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DeleteButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const { mutate, error } = useMutation({
    mutationFn: DeleteProfile,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Your profile has been deleted");
      router.replace("/");
      router.refresh();
    },
  });

  return (
    <>
      <button onClick={() => mutate(id)} className="button-secondary">
        Delete Profile
      </button>
      {error && !error.message.includes("NEXT_REDIRECT") && (
        <p>{error.message}</p>
      )}
    </>
  );
};

export default DeleteButton;
