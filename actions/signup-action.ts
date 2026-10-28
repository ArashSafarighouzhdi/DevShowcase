"use server";

import { createClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";
import { signUPSchema } from "./schemas";
import z from "zod";

export const SignUp = async (userdata: z.infer<typeof signUPSchema>) => {
  const parsedData = signUPSchema.parse(userdata);

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsedData.email,
    password: parsedData.password,
  });

  if (error) throw error;

  if (data.user) {
    const { error: userError } = await supabase.from("Users").insert({
      id: data.user.id,
      username: parsedData.username,
    });

    if (userError) throw userError;
  }

  redirect("/");
};
