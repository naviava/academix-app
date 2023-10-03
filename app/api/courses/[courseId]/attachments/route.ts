import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();
    const { url } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!isTeacher(userId))
      return new NextResponse("Unauthorized", { status: 401 });
    if (!url)
      return new NextResponse("Attachment is required", { status: 400 });

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (err) {
    console.log("[COURSE_ATTACHMENT_POST_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
