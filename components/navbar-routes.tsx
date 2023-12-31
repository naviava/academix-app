"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogOut } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/search-input";
import { isTeacher } from "@/lib/teacher";

interface NavbarRoutesProps {}

export default function NavbarRoutes({}: NavbarRoutesProps) {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = useMemo(
    () => pathname?.startsWith("/teacher"),
    [pathname],
  );

  const isCoursePage = useMemo(
    () => pathname?.includes("/courses"),
    [pathname],
  );

  const isSearchPage = useMemo(() => pathname === "/search", [pathname]);

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="ml-auto flex gap-x-2">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
}
