"use client";
import React from "react";
import { UserCog, FolderKanban } from "lucide-react";
import { NavMain } from "@/page-section/admin/admin-sidebar/nav-main";
import { NavUser } from "@/page-section/admin/admin-sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "User Management",
      url: "/admin/dashboard",
      icon: UserCog,
      isActive: true,
      items: [
        {
          title: "Add New User",
          url: "/admin/add-user",
        },
        {
          title: "Show All Users",
          url: "/admin/dashboard",
        },
      ],
    },
    {
      title: "Project Management",
      url: "#",
      icon: FolderKanban,
      items: [
        {
          title: "Add New Project",
          url: "/admin/projects/add-project",
        },
        {
          title: "Show All Projects",
          url: "/admin/projects",
        },
      ],
    },
  ],
};

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
