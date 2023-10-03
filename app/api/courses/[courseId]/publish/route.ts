import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!isTeacher(userId))
      return new NextResponse("Unauthorized", { status: 401 });
    if (!params.courseId)
      return new NextResponse("Course ID is required", { status: 400 });

    const course = await db.course.findUnique({
      where: { id: params.courseId, userId },
      include: {
        chapters: {
          include: { muxData: true },
        },
      },
    });

    if (!course) return new NextResponse("Course not found", { status: 404 });

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished,
    );

    if (
      !hasPublishedChapter ||
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.price ||
      !course.categoryId
    )
      return new NextResponse("Missing required fields", { status: 400 });

    const publishedCourse = await db.course.update({
      where: { id: params.courseId, userId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedCourse);
  } catch (err) {
    console.log("[COURSE_PUBLISH_PATCH_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
