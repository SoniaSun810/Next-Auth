// "use server"
"use client";

import {useSession} from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();
//   console.log("use-current-user", {session});

  return session.data?.user;
};