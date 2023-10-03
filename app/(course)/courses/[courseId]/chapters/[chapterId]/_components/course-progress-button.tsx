"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

import { useConfettiStore } from "@/hooks/use-confetti-store";

import { Button } from "@/components/ui/button";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
}

export default function CourseProgressButton({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) {
  const router = useRouter();
  const confetti = useConfettiStore();

  const [isLoading, setIsLoading] = useState(false);

  const toggleChapterCompletion = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        { isCompleted: !isCompleted },
      );

      if (!isCompleted && !nextChapterId) confetti.onOpen();

      if (!isCompleted && !!nextChapterId)
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);

      toast.success("Progress updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [chapterId, courseId, isCompleted, confetti, nextChapterId, router]);

  const Icon = useMemo(
    () => (isCompleted ? XCircle : CheckCircle),
    [isCompleted],
  );

  return (
    <Button
      type="button"
      disabled={isLoading}
      onClick={toggleChapterCompletion}
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
    >
      {isCompleted ? "Not completed" : "Mark as complete"}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  );
}
