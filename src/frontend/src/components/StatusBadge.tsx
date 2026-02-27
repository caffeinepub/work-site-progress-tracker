import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";

type Status = "Pending" | "In Progress" | "Completed" | string;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<
  string,
  { label: string; className: string; Icon: React.ElementType }
> = {
  Pending: {
    label: "Pending",
    className: "status-pending",
    Icon: Clock,
  },
  "In Progress": {
    label: "In Progress",
    className: "status-inprogress",
    Icon: Loader2,
  },
  Completed: {
    label: "Completed",
    className: "status-completed",
    Icon: CheckCircle2,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "status-pending",
    Icon: Clock,
  };
  const { label, Icon } = config;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide",
        config.className,
        className,
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"] as const;
