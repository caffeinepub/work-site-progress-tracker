import { Button } from "@/components/ui/button";
import type { WorkOrder } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { formatDateStr, isOverdue } from "@/utils/formatDate";
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  HardHat,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { StatusBadge } from "./StatusBadge";

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  index: number;
  onEdit: (wo: WorkOrder) => void;
}

export function WorkOrderCard({
  workOrder,
  index,
  onEdit,
}: WorkOrderCardProps) {
  const overdue =
    isOverdue(workOrder.dueDate) && workOrder.status !== "Completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className="group"
    >
      <button
        type="button"
        className={cn(
          "relative bg-card border rounded-lg p-5 cursor-pointer transition-all duration-200 w-full text-left",
          "hover:shadow-card-hover hover:-translate-y-0.5",
          "shadow-card",
          overdue
            ? "border-destructive/40"
            : "border-border hover:border-border/60",
        )}
        onClick={() => onEdit(workOrder)}
        aria-label={`Edit work order for ${workOrder.customerName}`}
      >
        {/* Left accent strip based on status */}
        <div
          className={cn(
            "absolute left-0 top-3 bottom-3 w-1 rounded-full",
            workOrder.status === "Completed" && "bg-[oklch(0.68_0.17_145)]",
            workOrder.status === "In Progress" && "bg-[oklch(0.65_0.18_240)]",
            workOrder.status === "Pending" && "bg-[oklch(0.75_0.16_60)]",
            !["Completed", "In Progress", "Pending"].includes(
              workOrder.status,
            ) && "bg-muted",
          )}
        />

        <div className="pl-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground text-base leading-tight truncate">
                {workOrder.customerName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Order #{String(workOrder.id)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={workOrder.status} />
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-md bg-accent/50 flex items-center justify-center shrink-0">
                <HardHat className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground leading-none mb-0.5">
                  Worker
                </p>
                <p className="text-foreground font-medium truncate text-sm leading-tight">
                  {workOrder.workerName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-md bg-accent/50 flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground leading-none mb-0.5">
                  Date of Work
                </p>
                <p className="text-foreground font-medium text-sm leading-tight">
                  {formatDateStr(workOrder.dateOfWork)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div
                className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                  overdue ? "bg-destructive/15" : "bg-accent/50",
                )}
              >
                <AlertCircle
                  className={cn(
                    "w-3.5 h-3.5",
                    overdue ? "text-destructive" : "text-muted-foreground",
                  )}
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground leading-none mb-0.5">
                  Due Date
                </p>
                <p
                  className={cn(
                    "font-medium text-sm leading-tight",
                    overdue ? "text-destructive" : "text-foreground",
                  )}
                >
                  {formatDateStr(workOrder.dueDate)}
                  {overdue && (
                    <span className="ml-1.5 text-xs font-normal text-destructive/80">
                      (overdue)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Notes preview */}
          {workOrder.notes && (
            <p className="mt-3 text-xs text-muted-foreground line-clamp-2 border-t border-border/50 pt-3 leading-relaxed">
              {workOrder.notes}
            </p>
          )}
        </div>
      </button>
    </motion.div>
  );
}
