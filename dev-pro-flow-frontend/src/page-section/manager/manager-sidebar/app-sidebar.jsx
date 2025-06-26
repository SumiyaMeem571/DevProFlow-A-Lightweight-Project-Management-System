"use client";
import React from "react";
import { FolderKanban, ListTodo } from "lucide-react";
import { NavMain } from "@/page-section/manager/manager-sidebar/nav-main";
import { NavUser } from "@/page-section/manager/manager-sidebar/nav-user";
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
      title: "Project Management",
      url: "/manager/projects",
      icon: FolderKanban,
      isActive: true,
      items: [
        {
          title: "Add New Project",
          url: "/manager/projects/add-project",
        },
        {
          title: "Show All Projects",
          url: "/manager/projects",
        },
      ],
    },
    {
      title: "Task Management",
      url: "/manager/tasks",
      icon: ListTodo,
      isActive: true,
      items: [
        {
          title: "Add New Task",
          url: "/manager/tasks/add-task",
        },
        {
          title: "Show All Tasks",
          url: "/manager/tasks",
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
