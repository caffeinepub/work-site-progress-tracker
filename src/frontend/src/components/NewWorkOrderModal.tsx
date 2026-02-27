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
import { useCreateWorkOrder } from "@/hooks/useQueries";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NewWorkOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  customerName: string;
  phoneNumber: string;
  workerName: string;
  dateOfWork: string;
  dueDate: string;
}

const empty: FormState = {
  customerName: "",
  phoneNumber: "",
  workerName: "",
  dateOfWork: "",
  dueDate: "",
};

export function NewWorkOrderModal({
  open,
  onOpenChange,
}: NewWorkOrderModalProps) {
  const [form, setForm] = useState<FormState>(empty);
  const createMutation = useCreateWorkOrder();

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.customerName.trim() ||
      !form.phoneNumber.trim() ||
      !form.workerName.trim() ||
      !form.dateOfWork ||
      !form.dueDate
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await createMutation.mutateAsync({
        customerName: `${form.customerName.trim()} | ${form.phoneNumber.trim()}`,
        dateOfWork: form.dateOfWork,
        dueDate: form.dueDate,
        workerName: form.workerName.trim(),
      });
      toast.success("Work order created successfully.");
      setForm(empty);
      onOpenChange(false);
    } catch {
      toast.error("Failed to create work order. Please try again.");
    }
  }

  function handleClose() {
    if (!createMutation.isPending) {
      setForm(empty);
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="font-display text-xl text-foreground">
              New Work Order
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="customerName"
                className="text-muted-foreground text-xs uppercase tracking-wider font-semibold"
              >
                Name
              </Label>
              <Input
                id="utitca"
                placeholder="e.g. John Smith"
                value={form.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                disabled={createMutation.isPending}
                className="bg-input border-border focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/50"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="text-muted-foreground text-xs uppercase tracking-wider font-semibold"
              >
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                placeholder="e.g. 555-123-4567"
                value={form.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                disabled={createMutation.isPending}
                className="bg-input border-border focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/50"
                autoComplete="tel"
                type="tel"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="workerName"
              className="text-muted-foreground text-xs uppercase tracking-wider font-semibold"
            >
              Items Ordered
            </Label>
            <Input
              id="workerName"
              placeholder="e.g. Lumber, concrete, fixtures"
              value={form.workerName}
              onChange={(e) => handleChange("workerName", e.target.value)}
              disabled={createMutation.isPending}
              className="bg-input border-border focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/50"
              autoComplete="name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="dateOfWork"
                className="text-muted-foreground text-xs uppercase tracking-wider font-semibold"
              >
                Date of Work
              </Label>
              <Input
                id="dateOfWork"
                type="date"
                value={form.dateOfWork}
                onChange={(e) => handleChange("dateOfWork", e.target.value)}
                disabled={createMutation.isPending}
                className="bg-input border-border focus:ring-primary/30 text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="dueDate"
                className="text-muted-foreground text-xs uppercase tracking-wider font-semibold"
              >
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                disabled={createMutation.isPending}
                className="bg-input border-border focus:ring-primary/30 text-foreground"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={createMutation.isPending}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Order
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
