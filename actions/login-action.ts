"use server";

import { createClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";
import { logInSchema } from "./schemas";
import z from "zod";

export const LogIn = async (userdata: z.infer<typeof logInSchema>) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(userdata);

  if (error) {
    return {
      success: false as const,
      message:
        error.code === "invalid_credentials"
          ? "Invalid email or password."
          : "Something went wrong. Please try again.",
    };
  }

  return { success: true as const };
};
