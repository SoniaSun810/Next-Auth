import { auth } from "@/auth";

export const currentUser = async () => {
  const session = await auth();
  console.log("lib-auth", { session });
  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();
  return session?.user?.role;
};
