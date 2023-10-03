import { NextResponse } from "next/server";

import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
);

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!isTeacher(userId))
      return new NextResponse("Unauthorized", { status: 401 });
    if (!courseId)
      return new NextResponse("Course ID is required", { status: 400 });
    if (!values) return new NextResponse("Bad Request", { status: 400 });

    const course = await db.course.update({
      where: { id: courseId, userId },
      data: { ...values },
    });

    return NextResponse.json(course);
  } catch (err) {
    console.log("[COURSE_PATCH_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
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

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId)
        await Video.Assets.del(chapter.muxData.assetId);
    }

    const deletedCourse = await db.course.delete({
      where: { id: params.courseId },
    });

    return NextResponse.json(deletedCourse);
  } catch (err) {
    console.log("[COURSE_ID_DELETE_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
