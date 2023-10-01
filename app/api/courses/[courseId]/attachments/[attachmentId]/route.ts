import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!params.courseId)
      return new NextResponse("Course ID is required", { status: 400 });
    if (!params.attachmentId)
      return new NextResponse("Attachment ID is required", { status: 400 });

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

    const attachment = await db.attachment.delete({
      where: { courseId: params.courseId, id: params.attachmentId },
    });

    return NextResponse.json(attachment);
  } catch (err) {
    console.log("[COURSE_ATTACHMENT_DELETE_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
