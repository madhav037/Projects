// src/app/dashboard/page.tsx

import Header from "./header";

import { SidebarDemo } from "../components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="main_body w-full flex flex-col bg-[#DBD3D3] ">
      <div className=" shadow-lg">
        <Header />
      </div>
      <div className="flex h-[100vh]">
        <div className="flex flex-col items-center justify-center h-screen ">
          <SidebarDemo />
        </div>
        <div className="flex-1 overflow-y-auto drop-shadow-md bg-[#DBD3D3]">
          {children}
        </div>
      </div>
    </div>
  );
};
export default DashboardLayout;
