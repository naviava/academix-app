import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;
    const { isPublished, ...values } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!courseId)
      return new NextResponse("Course ID is required", { status: 400 });
    if (!chapterId)
      return new NextResponse("Chapter ID is required", { status: 400 });
    if (!values) return new NextResponse("Bad Request", { status: 400 });

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

    const chapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: { ...values },
    });

    // TODO: Handle video upload.

    return NextResponse.json(chapter);
  } catch (err) {
    console.log("[CHAPTER_ID_PATCH_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
