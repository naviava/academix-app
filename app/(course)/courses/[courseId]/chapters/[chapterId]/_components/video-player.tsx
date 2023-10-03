"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Lock } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

import { useConfettiStore } from "@/hooks/use-confetti-store";

import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

export default function VideoPlayer({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isReady, setIsReady] = useState(false);

  const onVideoEnd = useCallback(async () => {
    try {
      if (completeOnEnd)
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          { isCompleted: true },
        );

      if (!nextChapterId) confetti.onOpen();

      toast.success("Progress updated");
      router.refresh();

      if (!!nextChapterId)
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
    } catch {
      toast.error("Something went wrong");
    }
  }, [chapterId, courseId, completeOnEnd, confetti, nextChapterId, router]);

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onVideoEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
}
