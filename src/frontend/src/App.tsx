import { Toaster } from "@/components/ui/sonner";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  return (
    <>
      <Dashboard />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "bg-card border-border text-foreground",
            description: "text-muted-foreground",
          },
        }}
      />
    </>
  );
}
