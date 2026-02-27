import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkOrders } from "@/hooks/useQueries";
import type { WorkOrder } from "@/hooks/useQueries";
import {
  ClipboardList,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { EditWorkOrderModal } from "./EditWorkOrderModal";
import { NewWorkOrderModal } from "./NewWorkOrderModal";
import { STATUS_OPTIONS } from "./StatusBadge";
import { WorkOrderCard } from "./WorkOrderCard";

const STATUS_FILTER_OPTIONS = ["All", ...STATUS_OPTIONS] as const;

export function Dashboard() {
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WorkOrder | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [workerFilter, setWorkerFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: workOrders, isLoading } = useWorkOrders();

  function handleEdit(wo: WorkOrder) {
    setEditTarget(wo);
    setEditOpen(true);
  }

  // Unique worker names for filter dropdown
  const workerNames = useMemo(() => {
    if (!workOrders) return [];
    return Array.from(new Set(workOrders.map((wo) => wo.workerName))).sort();
  }, [workOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (!workOrders) return [];
    return workOrders.filter((wo) => {
      const matchesStatus =
        statusFilter === "All" || wo.status === statusFilter;
      const matchesWorker = !workerFilter || wo.workerName === workerFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        wo.customerName.toLowerCase().includes(q) ||
        wo.workerName.toLowerCase().includes(q);
      return matchesStatus && matchesWorker && matchesSearch;
    });
  }, [workOrders, statusFilter, workerFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const orders = workOrders ?? [];
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "Pending").length,
      inProgress: orders.filter((o) => o.status === "In Progress").length,
      completed: orders.filter((o) => o.status === "Completed").length,
    };
  }, [workOrders]);

  const hasFilters = statusFilter !== "All" || workerFilter || searchQuery;

  function clearFilters() {
    setStatusFilter("All");
    setWorkerFilter("");
    setSearchQuery("");
  }

  return (
    <div className="min-h-screen bg-background grid-texture">
      {/* Header */}
      <header
        className="relative overflow-hidden border-b border-border"
        style={{
          backgroundImage: `url('/assets/generated/header-industrial-bg.dim_1400x200.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/uploads/Screenshot_20260228_011607_WhatsAppBusiness-1.jpg"
                  alt="ARS Associates Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground tracking-tight leading-none">
                  ARS Work Details
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 tracking-wide uppercase font-medium">
                  Work Order Tracker
                </p>
              </div>
            </div>
            <Button
              onClick={() => setNewOrderOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Work Order</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-5 grid grid-cols-4 gap-3"
          >
            {[
              {
                label: "Total Orders",
                value: stats.total,
                color: "text-foreground",
              },
              {
                label: "Pending",
                value: stats.pending,
                color: "text-[oklch(0.75_0.16_60)]",
              },
              {
                label: "In Progress",
                value: stats.inProgress,
                color: "text-[oklch(0.65_0.18_240)]",
              },
              {
                label: "Completed",
                value: stats.completed,
                color: "text-[oklch(0.68_0.17_145)]",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2.5 text-center"
              >
                <p
                  className={`font-display text-xl font-bold leading-none ${stat.color}`}
                >
                  {isLoading ? "—" : stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  {stat.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1 sm:hidden">
                  {stat.label.split(" ")[0]}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mb-6 flex flex-col sm:flex-row gap-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by customer or worker…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-card border-border text-foreground w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {STATUS_FILTER_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s} className="text-foreground">
                    {s === "All" ? "All Statuses" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Worker filter */}
          {workerNames.length > 0 && (
            <Select
              value={workerFilter || "__all"}
              onValueChange={(v) => setWorkerFilter(v === "__all" ? "" : v)}
            >
              <SelectTrigger className="bg-card border-border text-foreground w-44">
                <SelectValue placeholder="All Workers" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="__all" className="text-foreground">
                  All Workers
                </SelectItem>
                {workerNames.map((name) => (
                  <SelectItem
                    key={name}
                    value={name}
                    className="text-foreground"
                  >
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Clear filters */}
          <AnimatePresence>
            {hasFilters && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground h-10 px-3"
                >
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  Clear
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-3">
            {(["a", "b", "c"] as const).map((sk) => (
              <div
                key={sk}
                className="bg-card border border-border rounded-lg p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48 bg-accent/50" />
                    <Skeleton className="h-3 w-20 bg-accent/30" />
                  </div>
                  <Skeleton className="h-6 w-24 bg-accent/50" />
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["x", "y", "z"] as const).map((cell) => (
                    <Skeleton
                      key={cell}
                      className="h-8 bg-accent/30 rounded-md"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Work orders list */}
        {!isLoading &&
          (filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/30 border border-border flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                {hasFilters ? "No matching orders" : "No work orders yet"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                {hasFilters
                  ? "Try adjusting your filters or search query."
                  : "Create your first work order to get started."}
              </p>
              {hasFilters ? (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="mt-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  Clear filters
                </Button>
              ) : (
                <Button
                  onClick={() => setNewOrderOpen(true)}
                  className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Work Order
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {filteredOrders.length} order
                  {filteredOrders.length !== 1 ? "s" : ""}
                  {hasFilters && " matched"}
                </p>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredOrders.map((wo, i) => (
                    <WorkOrderCard
                      key={String(wo.id)}
                      workOrder={wo}
                      index={i}
                      onEdit={handleEdit}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/80 hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Modals */}
      <NewWorkOrderModal open={newOrderOpen} onOpenChange={setNewOrderOpen} />
      <EditWorkOrderModal
        workOrder={editTarget}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
