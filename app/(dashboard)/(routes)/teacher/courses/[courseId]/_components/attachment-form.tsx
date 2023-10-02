"use client";

import { memo, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { File, Loader2, PlusCircle, X } from "lucide-react";

import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export default function AttachmentForm({
  initialData,
  courseId,
}: AttachmentFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deletionId, setDeletionId] = useState<string | null>(null);

  const toggleEdit = useCallback(() => setIsEditing((prev) => !prev), []);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        await axios.post(`/api/courses/${courseId}/attachments`, values);
        toast.success("Course updated");
        toggleEdit();
        router.refresh();
      } catch (err) {
        toast.error("Something went wrong");
      }
    },
    [courseId, router, toggleEdit],
  );

  const onDelete = useCallback(
    async (id: string) => {
      try {
        setDeletionId(id);
        await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
        toast.success("Attachment deleted");
        router.refresh();
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setDeletionId(null);
      }
    },
    [courseId, router],
  );

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course attachments
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="mt-2 text-sm italic text-slate-500">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
                >
                  <File className="mr-2 h-4 w-4 flex-shrink-0" />
                  <p className="line-clamp-1 text-xs">{attachment.name}</p>
                  {deletionId === attachment.id && (
                    <div>
                      <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletionId !== attachment.id && (
                    <button
                      type="button"
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto transition hover:opacity-75"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) onSubmit({ url });
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Add any useful resources that are required for this course
          </div>
        </div>
      )}
    </div>
  );
}
