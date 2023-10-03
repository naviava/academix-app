"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import toast from "react-hot-toast";
import axios from "axios";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

export default function CourseEnrollButton({
  courseId,
  price,
}: CourseEnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      window.location.assign(response.data.url);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  return (
    <Button
      size="sm"
      disabled={isLoading}
      onClick={handleEnroll}
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
}
