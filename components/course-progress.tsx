import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  value: number;
  variant: "default" | "success";
  size?: "default" | "sm";
}

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

export default function CourseProgress({
  value,
  variant,
  size,
}: CourseProgressProps) {
  return (
    <div className="">
      <Progress className="h-2" value={value} variant={variant} />
      <p
        className={cn(
          "mt-2 font-medium text-sky-700",
          colorByVariant[variant || "default"],
          sizeByVariant[size || "default"],
        )}
      >
        {Math.round(value)}% complete
      </p>
    </div>
  );
}
