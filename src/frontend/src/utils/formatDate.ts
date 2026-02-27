/**
 * Format a nanosecond timestamp (Motoko Time) to a human-readable date string
 */
export function formatDate(nanosOrMs: number): string {
  // Motoko timestamps are nanoseconds; JS Date uses ms
  const ms = nanosOrMs > 1e13 ? nanosOrMs / 1e6 : nanosOrMs;
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date string (YYYY-MM-DD) to a human-readable string
 */
export function formatDateStr(dateStr: string): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Check if a due date is overdue (past today)
 */
export function isOverdue(dueDate: string): boolean {
  if (!dueDate) return false;
  const [year, month, day] = dueDate.split("-").map(Number);
  const due = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}
