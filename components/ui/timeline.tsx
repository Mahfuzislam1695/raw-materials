import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface TimelineProps {
  items: {
    title: string
    description?: string
    icon?: LucideIcon
    date: string
    status?: "completed" | "current" | "upcoming"
  }[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-8">
      {items.map((item, index) => {
        const Icon = item.icon
        const isCompleted = item.status === "completed"
        const isCurrent = item.status === "current"

        return (
          <div key={index} className="relative flex gap-6">
            <div className="relative flex h-6 w-6 flex-none items-center justify-center">
              <div
                className={cn(
                  "h-full w-0.5 absolute left-1/2 -translate-x-1/2",
                  index === 0 ? "top-1/2 h-1/2" : "top-0",
                  index === items.length - 1 ? "h-1/2" : "h-full",
                  isCompleted || isCurrent ? "bg-primary" : "bg-muted-foreground/20",
                )}
              />
              <div
                className={cn(
                  "h-6 w-6 rounded-full border flex items-center justify-center",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary bg-background"
                      : "border-muted-foreground/20 bg-background",
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "h-3 w-3",
                      isCompleted ? "text-primary-foreground" : isCurrent ? "text-primary" : "text-muted-foreground/40",
                    )}
                  />
                )}
              </div>
            </div>
            <div className="flex-auto py-0.5">
              <div
                className={cn(
                  "text-sm font-medium",
                  isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.title}
              </div>
              {item.description && (
                <div
                  className={cn(
                    "mt-0.5 text-xs",
                    isCompleted || isCurrent ? "text-muted-foreground" : "text-muted-foreground/60",
                  )}
                >
                  {item.description}
                </div>
              )}
              <div
                className={cn(
                  "mt-1 text-xs",
                  isCompleted ? "text-primary" : isCurrent ? "text-muted-foreground" : "text-muted-foreground/60",
                )}
              >
                {item.date}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
