import Link from "next/link";
import { createClient } from "@/lib/supabase/serverClient";
import { Logout } from "@/actions/logout-action";

const AccountLink = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <form action={Logout}>
        <button type="submit">Logout</button>
      </form>
    );
  }

  return (
    <>
      <Link href="/auth/login">Login</Link>
      <Link href="/auth/signup">Sign Up</Link>
    </>
  );
};

export default AccountLink;
