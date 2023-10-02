"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Chapter, Course } from "@prisma/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ChaptersList from "./chapters-list";

import { cn } from "@/lib/utils";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Description is required" }),
});

export default function ChaptersForm({
  initialData,
  courseId,
}: ChaptersFormProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = useCallback(() => setIsCreating((prev) => !prev), []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { isSubmitting, isValid } = useMemo(
    () => form.formState,
    [form.formState],
  );

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        await axios.post(`/api/courses/${courseId}/chapters`, values);
        toast.success("Chapter updated");
        toggleCreating();
        router.refresh();
      } catch (err) {
        toast.error("Something went wrong");
      }
    },
    [courseId, router, toggleCreating],
  );

  const onReorder = useCallback(
    async (updateData: { id: string; position: number }[]) => {
      try {
        setIsUpdating(true);
        await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
          list: updateData,
        });
        toast.success("Chapters reordered");
        router.refresh();
      } catch {
        toast.error("Something went wrong");
      } finally {
        setIsUpdating(false);
      }
    },
    [courseId, router],
  );

  const onEdit = useCallback(
    (id: string) => router.push(`/teacher/courses/${courseId}/chapters/${id}`),
    [router, courseId],
  );

  return (
    <div className=" relative mt-6 rounded-md border bg-slate-100 p-4">
      {isUpdating && (
        <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-md bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course Chapters
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a course chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. Introduction for this course"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "mt-2 text-sm",
            !initialData.chapters.length && "italic text-slate-500",
          )}
        >
          {!initialData.chapters.length && "No chapters"}
          <ChaptersList
            items={initialData.chapters || []}
            onReorder={onReorder}
            onEdit={onEdit}
          />
        </div>
      )}
      {!isCreating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to re-order the chapters
        </p>
      )}
    </div>
  );
}
