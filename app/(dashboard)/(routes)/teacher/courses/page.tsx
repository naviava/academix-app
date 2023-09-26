import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CoursesPageProps {}

export default function CoursesPage({}: CoursesPageProps) {
  return (
    <div className="p-6">
      <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link>
    </div>
  );
}
