import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NotificationIndicatorProps {
  count?: number
}

export function NotificationIndicator({ count }: NotificationIndicatorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {count && count > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1 text-xs font-medium text-destructive-foreground">
              {count > 99 ? "99+" : count}
            </span>
          ) : null}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
            Mark all as read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          <NotificationItem
            title="New Shipment Arrived"
            description="Shipment #SH-2023-06-01 has arrived and is ready for receiving."
            time="5 minutes ago"
            unread
          />
          <NotificationItem
            title="QC Test Results Ready"
            description="Test results for Batch #B-2023-05-28 are ready for review."
            time="1 hour ago"
            unread
          />
          <NotificationItem
            title="Inventory Alert"
            description="5 items are approaching expiry within 30 days."
            time="3 hours ago"
            unread
          />
          <NotificationItem
            title="Requisition Approved"
            description="Requisition #REQ-2023-05-31 has been approved."
            time="Yesterday"
          />
          <NotificationItem
            title="Temperature Deviation"
            description="Temperature deviation detected in Cold Storage Zone B."
            time="2 days ago"
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center font-medium">View all notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface NotificationItemProps {
  title: string
  description: string
  time: string
  unread?: boolean
}

function NotificationItem({ title, description, time, unread }: NotificationItemProps) {
  return (
    <DropdownMenuItem className="flex cursor-pointer flex-col items-start p-4 focus:bg-accent">
      <div className="flex w-full items-start justify-between gap-2">
        <div className="space-y-1">
          <p className={cn("text-sm", unread && "font-medium")}>{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {unread && <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{time}</p>
    </DropdownMenuItem>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
