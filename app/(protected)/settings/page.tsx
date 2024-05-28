"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";
import SettingForm from "@/components/auth/setting-form";



const SettingPage = () => {
  const user = useCurrentUser();

  return (
    <SettingForm />
  );
};

export default SettingPage;
