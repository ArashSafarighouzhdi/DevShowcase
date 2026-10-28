"use client";

import { DeleteProfile } from "@/actions/delete-profile-action";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const DeleteButton = ({ id }: { id: string }) => {
  const { mutate, error } = useMutation({
    mutationFn: DeleteProfile,
    onSuccess: () => toast("Your profile has been deleted"),
  });

  return (
    <>
      <button onClick={() => mutate(id)} className="button-secondary">
        Delete Profile
      </button>
      {error && !error.message.includes("NEXT_REDIRECT") && (
        <p>{error.message}</p>
      )}{" "}
    </>
  );
};

export default DeleteButton;
