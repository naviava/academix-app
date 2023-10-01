import { NextResponse } from "next/server";

import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
);

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

    // Handle video upload to MUX.
    if (!!values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      });

      // Delete existing video, if video URL is changed.
      if (!!existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
          where: { id: existingMuxData.id },
        });
      }

      // First time video upload.
      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (err) {
    console.log("[CHAPTER_ID_PATCH_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
