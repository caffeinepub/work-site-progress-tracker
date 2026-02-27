import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WorkOrder {
    id: bigint;
    customerName: string;
    status: string;
    createdAt: bigint;
    dueDate: string;
    notes: string;
    dateOfWork: string;
    workerName: string;
}
export interface backendInterface {
    createWorkOrder(customerName: string, dateOfWork: string, dueDate: string, workerName: string): Promise<bigint>;
    deleteWorkOrder(id: bigint): Promise<void>;
    getWorkOrder(id: bigint): Promise<WorkOrder>;
    getWorkOrders(): Promise<Array<WorkOrder>>;
    getWorkOrdersByStatus(status: string): Promise<Array<WorkOrder>>;
    getWorkOrdersByWorker(workerName: string): Promise<Array<WorkOrder>>;
    updateWorkOrder(id: bigint, status: string, notes: string, customerName: string, dateOfWork: string, dueDate: string, workerName: string): Promise<void>;
}
