"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RoleGate from "@/components/auth/role-gate";
import { FormSucess } from "@/components/form-success";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { admin } from "@/actions/admin";

const AdminPage = () => {
  const onServerActionClick = async () => {
    admin().then((data) => {
      if (data.success) {
        toast.success("admin server action success");
      } else {
        toast.error("admin server action failed");
      }
    });
  };

  const onApiRouteClick = async () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("admin API route success");
      } else {
        toast.error("admin API route failed");
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin Page</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSucess message="You are the ADMIN!" />
        </RoleGate>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only server action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
