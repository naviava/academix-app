import { redirect } from "next/navigation";
import { db } from "@/lib/db";

interface CourseIdPageProps {
  params: { courseId: string };
}

export default async function CourseIdPage({ params }: CourseIdPageProps) {
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) return redirect("/");

  return redirect(
    `/courses/${params.courseId}/chapters/${course.chapters[0].id}`,
  );
}
