# Work Site Progress Tracker

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Work order management system to track site progress for each job
- Each work order contains: customer name, date of work, due date, worker name, status, and progress notes
- Dashboard view listing all work orders with status indicators
- Create new work order form
- Detail/edit view for each work order to update progress and status
- Status options: Pending, In Progress, Completed
- Filter/sort by status, worker, or due date

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Define WorkOrder data type with fields (id, customerName, dateOfWork, dueDate, workerName, status, notes, createdAt). Implement CRUD operations: createWorkOrder, getWorkOrders, getWorkOrder, updateWorkOrder, deleteWorkOrder. Support filtering by status and worker.
2. Frontend: Dashboard page showing all work orders in a table/card list with status badges. Create Work Order form page. Work Order detail/edit page with status update and progress notes. Navigation between views.
