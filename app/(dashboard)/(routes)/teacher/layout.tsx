import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { isTeacher } from "@/lib/teacher";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const { userId } = auth();

  if (!isTeacher(userId)) return redirect("/");

  return <>{children}</>;
}
