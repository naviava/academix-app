import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!isTeacher(userId))
      return new NextResponse("Unauthorized", { status: 401 });
    if (!params.courseId)
      return new NextResponse("Course ID is required", { status: 400 });
    if (!params.chapterId)
      return new NextResponse("Chapter ID is required", { status: 400 });

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

    const unpublishedChapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: { isPublished: false },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: { courseId: params.courseId, isPublished: true },
    });

    if (!publishedChaptersInCourse.length)
      await db.course.update({
        where: { id: params.courseId },
        data: { isPublished: false },
      });

    return NextResponse.json(unpublishedChapter);
  } catch (err) {
    console.log("[CHAPTER_UNPUBLISH_PATCH_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
