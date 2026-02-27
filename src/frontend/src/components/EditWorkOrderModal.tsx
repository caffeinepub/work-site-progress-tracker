import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteWorkOrder, useUpdateWorkOrder } from "@/hooks/useQueries";
import type { WorkOrder } from "@/hooks/useQueries";
import { formatDate } from "@/utils/formatDate";
import { ClipboardList, Loader2, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { STATUS_OPTIONS } from "./StatusBadge";

interface EditWorkOrderModalProps {
  workOrder: WorkOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  customerName: string;
  workerName: string;
  dateOfWork: string;
  dueDate: string;
  status: string;
  notes: string;
}

function toFormState(wo: WorkOrder): FormState {
  return {
    customerName: wo.customerName,
    workerName: wo.workerName,
    dateOfWork: wo.dateOfWork,
    dueDate: wo.dueDate,
    status: wo.status,
    notes: wo.notes,
  };
}

export function EditWorkOrderModal({
  workOrder,
  open,
  onOpenChange,
}: EditWorkOrderModalProps) {
  const [form, setForm] = useState<FormState>({
    customerName: "",
    workerName: "",
    dateOfWork: "",
    dueDate: "",
    status: "Pending",
    notes: "",
  });

  const updateMutation = useUpdateWorkOrder();
  const deleteMutation = useDeleteWorkOrder();

  useEffect(() => {
    if (workOrder) {
      setForm(toFormState(workOrder));
    }
  }, [workOrder]);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!workOrder) return;
    if (
      !form.customerName.trim() ||
      !form.workerName.trim() ||
      !form.dateOfWork ||
      !form.dueDate
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await updateMutation.mutateAsync({
        id: workOrder.id,
        status: form.status,
        notes: form.notes,
        customerName: form.customerName.trim(),
        dateOfWork: form.dateOfWork,
        dueDate: form.dueDate,
        workerName: form.workerName.trim(),
      });
      toast.success("Work order updated successfully.");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update work order. Please try again.");
    }
  }

  async function handleDelete() {
    if (!workOrder) return;
    try {
      await deleteMutation.mutateAsync(workOrder.id);
      toast.success("Work order deleted.");
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete work order.");
    }
  }

  const isBusy = updateMutation.isPending || deleteMutation.isPending;

  if (!workOrder) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !isBusy && onOpenChange(v)}>
      <DialogContent className="sm:max-w-lg bg-card border-border shadow-2xl">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/50 border border-border">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl text-foreground">
                Work Order #{String(workOrder.id)}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Created {formatDate(Number(workOrder.createdAt))}
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label
                htmlFor="edit-customerName"
                className="text-muted-foreground text-xs uppercase tracking-wider font-semibold"
              >
                Customer Name
              </Label>
              <Input
                id="edit-customerName"
                value={form.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                disabled={isBusy}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label
                htmlFor="edit-workerName"
                className="text-muted-foreground text-xs uppercase tracking-wider font-semibold"
              >
                Items Ordered
              </Label>
              <Input
                id="edit-workerName"
                value={form.workerName}
                onChange={(e) => handleChange("workerName", e.target.value)}
                disabled={isBusy}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit-dateOfWork"
                className="text-muted-foreground text-xs uppercase tracking-wider font-semibold"
              >
                Date of Work
              </Label>
              <Input
                id="edit-dateOfWork"
                type="date"
                value={form.dateOfWork}
                onChange={(e) => handleChange("dateOfWork", e.target.value)}
                disabled={isBusy}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit-dueDate"
                className="text-muted-foreground text-xs uppercase tracking-wider font-semibold"
              >
                Due Date
              </Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                disabled={isBusy}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) => handleChange("status", v)}
                disabled={isBusy}
              >
                <SelectTrigger className="bg-input border-border text-foreground w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="text-foreground">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label
                htmlFor="edit-notes"
                className="text-muted-foreground text-xs uppercase tracking-wider font-semibold"
              >
                Progress Notes
              </Label>
              <Textarea
                id="edit-notes"
                placeholder="Add notes about work progress, issues, or updates…"
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                disabled={isBusy}
                rows={3}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground/50 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2 flex-col sm:flex-row">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isBusy}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 sm:mr-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground font-display">
                    Delete this work order?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This action cannot be undone. The work order for{" "}
                    <strong className="text-foreground">
                      {workOrder.customerName}
                    </strong>{" "}
                    will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Delete Order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isBusy}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isBusy}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
