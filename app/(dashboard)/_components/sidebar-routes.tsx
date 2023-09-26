"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { BarChart, Compass, Layout, List } from "lucide-react";

import SidebarItem from "./sidebar-item";

interface SidebarRoutesProps {}

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export default function SidebarRoutes({}: SidebarRoutesProps) {
  const pathname = usePathname();

  const isTeacherPage = useMemo(
    () => pathname?.startsWith("/teacher"),
    [pathname],
  );

  const routes = useMemo(
    () => (isTeacherPage ? teacherRoutes : guestRoutes),
    [isTeacherPage],
  );

  return (
    <div className="flex w-full flex-col">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
}
