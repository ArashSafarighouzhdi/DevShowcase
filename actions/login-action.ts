"use server";

import { createClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";
import { logInSchema } from "./schemas";
import z from "zod";

export const LogIn = async (userdata: z.infer<typeof logInSchema>) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword(userdata);

  if (error) throw error;

  redirect("/");
};
