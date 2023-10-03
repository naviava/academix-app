import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!isTeacher(userId))
      return new NextResponse("Unauthorized", { status: 401 });
    if (!title) return new NextResponse("Title is required", { status: 400 });

    const course = await db.course.create({
      data: { userId, title },
    });

    return NextResponse.json(course);
  } catch (err) {
    console.log("[COURSES_POST_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
