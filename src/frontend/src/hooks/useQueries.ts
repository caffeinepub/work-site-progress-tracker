import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WorkOrder } from "../backend.d";
import { useActor } from "./useActor";

// ─── Query Keys ──────────────────────────────────────────────
export const WORK_ORDERS_KEY = ["workOrders"];

// ─── Queries ─────────────────────────────────────────────────
export function useWorkOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<WorkOrder[]>({
    queryKey: WORK_ORDERS_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWorkOrdersByStatus(status: string) {
  const { actor, isFetching } = useActor();
  return useQuery<WorkOrder[]>({
    queryKey: [...WORK_ORDERS_KEY, "status", status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkOrdersByStatus(status);
    },
    enabled: !!actor && !isFetching && !!status,
  });
}

// ─── Mutations ────────────────────────────────────────────────
export function useCreateWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerName,
      dateOfWork,
      dueDate,
      workerName,
    }: {
      customerName: string;
      dateOfWork: string;
      dueDate: string;
      workerName: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createWorkOrder(
        customerName,
        dateOfWork,
        dueDate,
        workerName,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORK_ORDERS_KEY });
    },
  });
}

export function useUpdateWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
      customerName,
      dateOfWork,
      dueDate,
      workerName,
    }: {
      id: bigint;
      status: string;
      notes: string;
      customerName: string;
      dateOfWork: string;
      dueDate: string;
      workerName: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateWorkOrder(
        id,
        status,
        notes,
        customerName,
        dateOfWork,
        dueDate,
        workerName,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORK_ORDERS_KEY });
    },
  });
}

export function useDeleteWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteWorkOrder(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORK_ORDERS_KEY });
    },
  });
}

export function useSeeding() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const existing = await actor.getWorkOrders();
      if (existing.length > 0) return;

      const seeds = [
        {
          customerName: "Hartfield Construction Co.",
          dateOfWork: "2026-02-20",
          dueDate: "2026-03-15",
          workerName: "Marcus Rivera",
        },
        {
          customerName: "Lakewood Development Group",
          dateOfWork: "2026-02-24",
          dueDate: "2026-03-10",
          workerName: "Sarah Chen",
        },
        {
          customerName: "Summit Ridge Builders",
          dateOfWork: "2026-02-18",
          dueDate: "2026-02-28",
          workerName: "Jake Morrison",
        },
        {
          customerName: "Pinecrest Renovation LLC",
          dateOfWork: "2026-03-01",
          dueDate: "2026-03-30",
          workerName: "Marcus Rivera",
        },
        {
          customerName: "Broadstone Commercial Realty",
          dateOfWork: "2026-02-10",
          dueDate: "2026-02-25",
          workerName: "Lisa Tran",
        },
      ];

      const ids = await Promise.all(
        seeds.map((s) =>
          actor.createWorkOrder(
            s.customerName,
            s.dateOfWork,
            s.dueDate,
            s.workerName,
          ),
        ),
      );

      // Update some with statuses/notes
      const updates: Array<{
        id: bigint;
        status: string;
        notes: string;
        customerName: string;
        dateOfWork: string;
        dueDate: string;
        workerName: string;
      }> = [
        {
          id: ids[0],
          status: "In Progress",
          notes:
            "Foundation work 60% complete. Concrete pour scheduled for next week.",
          customerName: "Hartfield Construction Co.",
          dateOfWork: "2026-02-20",
          dueDate: "2026-03-15",
          workerName: "Marcus Rivera",
        },
        {
          id: ids[2],
          status: "Completed",
          notes:
            "All framing and drywall work completed ahead of schedule. Final inspection passed.",
          customerName: "Summit Ridge Builders",
          dateOfWork: "2026-02-18",
          dueDate: "2026-02-28",
          workerName: "Jake Morrison",
        },
        {
          id: ids[4],
          status: "Completed",
          notes:
            "Commercial fit-out finished. Client sign-off received on 2/24.",
          customerName: "Broadstone Commercial Realty",
          dateOfWork: "2026-02-10",
          dueDate: "2026-02-25",
          workerName: "Lisa Tran",
        },
      ];

      await Promise.all(
        updates.map((u) =>
          actor.updateWorkOrder(
            u.id,
            u.status,
            u.notes,
            u.customerName,
            u.dateOfWork,
            u.dueDate,
            u.workerName,
          ),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORK_ORDERS_KEY });
    },
  });
}

export type { WorkOrder };
