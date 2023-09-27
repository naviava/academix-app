import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
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
