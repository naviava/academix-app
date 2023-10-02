import Categories from "./_components/categories";
import { db } from "@/lib/db";

export default async function SearchPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6">
      <Categories items={categories} />
    </div>
  );
}
