"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";

interface DescriptionFormProps {
  initialData: { description: string };
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

function DescriptionForm({ initialData, courseId }: DescriptionFormProps) {
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
        Course description
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "mt-2 text-sm",
            !initialData.description && "italic text-slate-500",
          )}
        >
          {initialData?.description || "No description"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. This course is about..."
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

export default memo(DescriptionForm);
