import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  try {
    const { userId } = auth();
    const { isCompleted } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!params.courseId)
      return new NextResponse("Course ID is required", { status: 400 });
    if (!params.chapterId)
      return new NextResponse("Chapter ID is required", { status: 400 });

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: { userId, chapterId: params.chapterId },
      },
      update: { isCompleted },
      create: { userId, chapterId: params.chapterId, isCompleted },
    });

    return NextResponse.json(userProgress);
  } catch (err) {
    console.log("[CHAPTER_ID_PROGRESS_PUT_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
