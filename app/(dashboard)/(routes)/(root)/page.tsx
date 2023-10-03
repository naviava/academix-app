import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";

import CourseList from "@/components/course-list";
import InfoCard from "./_components/info-card";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const { completedCourses, coursesInProgress } =
    await getDashboardCourses(userId);

  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={Clock}
          label="In progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CourseList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
