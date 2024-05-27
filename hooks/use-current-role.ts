import {useSession} from "next-auth/react";

export const useCurrentRole = () => {
  const session = useSession();
  // console.log("use-current-role", {session});

  return session.data?.user?.role;
};