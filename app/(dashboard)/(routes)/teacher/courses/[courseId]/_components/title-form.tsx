"use client";

import { memo, useCallback, useMemo, useState } from "react";

import * as z from "zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface TitleFormProps {
  initialData: { title: string };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

function TitleForm({ initialData, courseId }: TitleFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = useCallback(() => setIsEditing((prev) => !prev), []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = useMemo(
    () => form.formState,
    [form.formState],
  );

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        await axios.patch(`/api/courses/${courseId}`, values);
        toast.success("Course updated");
        toggleEdit();
        router.refresh();
      } catch (err) {
        toast.error("Something went wrong");
      }
    },
    [courseId, router, toggleEdit],
  );

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course title
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="mt-2 text-sm">{initialData?.title}</p>}
      {isEditing && (
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
                      placeholder="e.g. Web development bootcamp"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

export default memo(TitleForm);
