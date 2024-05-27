"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingPage = () => {
  const user = useCurrentUser();

  const onClick = () => {
    logout();
  };

  return (
    <div>
      {JSON.stringify(user)}
      <button onClick={onClick} type="submit" className="bg-purple-300">
        Sign Out
      </button>
    </div>
  );
};

export default SettingPage;
