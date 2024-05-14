import React, { ReactNode } from "react";

const LayoutAuth = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-sky-200 to-blue-400">
      <div>{children}</div>
    </div>
  );
};

export default LayoutAuth;
