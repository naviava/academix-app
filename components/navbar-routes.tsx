"use client";

import { UserButton } from "@clerk/nextjs";

interface NavbarRoutesProps {}

export default function NavbarRoutes({}: NavbarRoutesProps) {
  return (
    <div className="ml-auto flex gap-x-2">
      <UserButton />
    </div>
  );
}
