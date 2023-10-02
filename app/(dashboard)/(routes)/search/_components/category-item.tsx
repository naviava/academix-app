"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import qs from "query-string";

import { IconType } from "react-icons";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
  label: string;
  icon?: IconType;
  value?: string;
}

export default function CategoryItem({
  label,
  icon: Icon,
  value,
}: CategoryItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTitle = useMemo(() => searchParams.get("title"), [searchParams]);
  const currentCategoryId = useMemo(
    () => searchParams.get("categoryId"),
    [searchParams],
  );

  const isSelected = useMemo(
    () => currentCategoryId === value,
    [currentCategoryId, value],
  );

  const toggleCategory = useCallback(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  }, [currentTitle, isSelected, pathname, router, value]);

  return (
    <button
      type="button"
      onClick={toggleCategory}
      className={cn(
        "flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm transition hover:border-sky-700",
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800",
      )}
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </button>
  );
}
