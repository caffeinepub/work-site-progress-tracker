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
  return useMutation({
    mutationFn: async () => {},
  });
}

export type { WorkOrder };
