import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!params.courseId)
      return new NextResponse("Course ID is required", { status: 400 });

    const course = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!course) return new NextResponse("Course not found", { status: 404 });

    const unpublishedCourse = await db.course.update({
      where: { id: params.courseId, userId },
      data: { isPublished: false },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (err) {
    console.log("[COURSE_UNPUBLISH_PATCH_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
