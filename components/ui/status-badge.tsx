import { cn } from "@/lib/utils"

type StatusType = "pending" | "approved" | "rejected" | "quarantine" | "expired" | "retest" | "active" | "completed"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusClasses = {
    pending: "bg-warning-100 text-warning-800",
    approved: "bg-secondary-100 text-secondary-800",
    rejected: "bg-destructive-100 text-destructive-800",
    quarantine: "bg-amber-100 text-amber-800",
    expired: "bg-destructive-100 text-destructive-800",
    retest: "bg-purple-100 text-purple-800",
    active: "bg-primary-100 text-primary-800",
    completed: "bg-gray-100 text-gray-800",
  }

  const statusLabels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    quarantine: "Quarantine",
    expired: "Expired",
    retest: "Retest",
    active: "Active",
    completed: "Completed",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusClasses[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  )
}
