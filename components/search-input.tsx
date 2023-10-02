"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Search } from "lucide-react";
import qs from "query-string";

import { useDebounce } from "@/hooks/use-debounce";

import { Input } from "@/components/ui/input";

interface SearchInputProps {}

export default function SearchInput({}: SearchInputProps) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryId = useMemo(
    () => searchParams.get("categoryId"),
    [searchParams],
  );

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true },
    );

    router.push(url);
  }, [currentCategoryId, debouncedValue, pathname, router]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
      <Input
        value={value}
        onChange={(evt) => setValue(evt.target.value)}
        placeholder="Search for a course"
        className="w-full rounded-full bg-slate-100 pl-9 focus-visible:ring-slate-200 md:w-[300px]"
      />
    </div>
  );
}
