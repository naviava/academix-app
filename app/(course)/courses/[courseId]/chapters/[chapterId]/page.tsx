import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import Banner from "@/components/banner";
import VideoPlayer from "./_components/video-player";

import { getChapter } from "@/actions/get-chapter";

interface ChapterIdPageProps {
  params: { courseId: string; chapterId: string };
}

export default async function ChapterIdPage({ params }: ChapterIdPageProps) {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const {
    chapter,
    course,
    muxData,
    attachments,
    userProgress,
    nextChapter,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) return redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You have already completed this chapter."
        />
      )}
      {isLocked && (
        <Banner label="You need to purchase the course, to watch this chapter." />
      )}
      <div className="mx-auto flex max-w-4xl flex-col pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapter.id}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
      </div>
    </div>
  );
}
