"use client";
import Navbar from "@/components/nav-bar/nav-bar";
import ProtectedRoute from "@/components/protected-route/protected-route";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/page-section/admin/admin-sidebar/app-sidebar";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <SidebarProvider>
        <div className="flex h-screen w-full flex-col">
          {/* Navbar  */}
          <div className="sticky top-0 z-50 ">
            <Navbar />
          </div>

          {/* Main content area with sidebar*/}
          <div className="flex flex-1 overflow-hidden">
            <AppSidebar style={{ top: "64px", height: "calc(100vh - 64px)" }} />
            <div className="flex-1 overflow-auto bg-gray-50">
              <div className="p-6">{children}</div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
