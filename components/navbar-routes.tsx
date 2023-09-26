"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import { LogOut } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavbarRoutesProps {}

export default function NavbarRoutes({}: NavbarRoutesProps) {
  const pathname = usePathname();

  const isTeacherPage = useMemo(
    () => pathname?.startsWith("/teacher"),
    [pathname],
  );

  const isPlayerPage = useMemo(
    () => pathname?.includes("/chapter"),
    [pathname],
  );

  return (
    <div className="ml-auto flex gap-x-2">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <Button size="sm" variant="ghost">
            <LogOut className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <Button size="sm" variant="ghost">
            Teacher mode
          </Button>
        </Link>
      )}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
