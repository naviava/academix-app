import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import { columns } from "./_components/column";
import { DataTable } from "./_components/data-table";

import { db } from "@/lib/db";
export default async function CoursesPage() {
  const { userId } = auth();
  if (!userId) redirect("/");

  const courses = await db.course.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      {/* <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link> */}
      <DataTable columns={columns} data={courses} />
    </div>
  );
}
