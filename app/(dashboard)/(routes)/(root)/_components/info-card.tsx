import { LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
}

export default function InfoCard({
  numberOfItems,
  variant,
  label,
  icon: Icon,
}: InfoCardProps) {
  return (
    <div className="flex items-center gap-x-2 rounded-md border p-3">
      <IconBadge icon={Icon} variant={variant} />
      <div>
        <p className="font-medim">{label}</p>
        <p className="text-sm text-gray-500">
          {numberOfItems} {numberOfItems === 1 ? "course" : "courses"}
        </p>
      </div>
    </div>
  );
}
