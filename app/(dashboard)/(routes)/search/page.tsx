import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import CourseList from "@/components/course-list";
import SearchInput from "@/components/search-input";
import Categories from "./_components/categories";

import { db } from "@/lib/db";
import { getCourses } from "@/actions/get-courses";

interface SearchPageProps {
  searchParams: { title: string; categoryId: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const courses = await getCourses({ userId, ...searchParams });

  return (
    <>
      <div className="block px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="space-y-4 p-6">
        <Categories items={categories} />
        <CourseList items={courses} />
      </div>
    </>
  );
}
