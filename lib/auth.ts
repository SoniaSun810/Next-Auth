import { auth } from "@/auth";

export const currentUser = async () => {
  const session = await auth();
  console.log("lib-auth", {session});
  return session?.user;
};
