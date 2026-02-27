import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";

actor {
  type WorkOrder = {
    id : Nat;
    customerName : Text;
    dateOfWork : Text;
    dueDate : Text;
    workerName : Text;
    status : Text;
    notes : Text;
    createdAt : Int;
  };

  module WorkOrder {
    public func compareByCreatedAtDesc(left : WorkOrder, right : WorkOrder) : Order.Order {
      Int.compare(right.createdAt, left.createdAt);
    };
  };

  var nextId = 0;
  let workOrders = Map.empty<Nat, WorkOrder>();

  func getNextId() : Nat {
    let id = nextId;
    nextId += 1;
    id;
  };

  public shared ({ caller }) func createWorkOrder(customerName : Text, dateOfWork : Text, dueDate : Text, workerName : Text) : async Nat {
    let workOrder : WorkOrder = {
      id = getNextId();
      customerName;
      dateOfWork;
      dueDate;
      workerName;
      status = "Pending";
      notes = "";
      createdAt = Time.now();
    };
    workOrders.add(workOrder.id, workOrder);
    workOrder.id;
  };

  public query ({ caller }) func getWorkOrders() : async [WorkOrder] {
    workOrders.values().toArray().sort(WorkOrder.compareByCreatedAtDesc);
  };

  public query ({ caller }) func getWorkOrder(id : Nat) : async WorkOrder {
    switch (workOrders.get(id)) {
      case (null) { Runtime.trap("WorkOrder not found") };
      case (?workOrder) { workOrder };
    };
  };

  public shared ({ caller }) func updateWorkOrder(id : Nat, status : Text, notes : Text, customerName : Text, dateOfWork : Text, dueDate : Text, workerName : Text) : async () {
    switch (workOrders.get(id)) {
      case (null) { Runtime.trap("WorkOrder not found") };
      case (?existing) {
        let updated : WorkOrder = {
          id;
          status;
          notes;
          customerName;
          dateOfWork;
          dueDate;
          workerName;
          createdAt = existing.createdAt;
        };
        workOrders.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteWorkOrder(id : Nat) : async () {
    if (not workOrders.containsKey(id)) {
      Runtime.trap("WorkOrder not found");
    };
    workOrders.remove(id);
  };

  public query ({ caller }) func getWorkOrdersByStatus(status : Text) : async [WorkOrder] {
    workOrders.values().toArray().filter(func(wo) { wo.status == status });
  };

  public query ({ caller }) func getWorkOrdersByWorker(workerName : Text) : async [WorkOrder] {
    workOrders.values().toArray().filter(func(wo) { wo.workerName == workerName });
  };
};
