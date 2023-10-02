"use client";

import { memo, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export default function SidebarItem({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = useMemo(
    () =>
      (pathname === "/" && href === "/") ||
      pathname === href ||
      pathname?.startsWith(`${href}/`),
    [pathname, href],
  );

  const handleClick = useCallback(() => router.push(href), [router, href]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex items-center gap-x-2 pl-6 text-sm font-[500] text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",
        isActive &&
          "bg-sky-200/20 text-sky-700 hover:bg-sky-200/20 hover:text-sky-700",
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-sky-700")}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto h-full border-2 border-sky-700 opacity-0 transition-all",
          isActive && "opacity-100",
        )}
      />
    </button>
  );
}
