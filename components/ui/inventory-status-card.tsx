import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "./status-badge"

interface InventoryStatusCardProps {
  title: string
  total: number
  items: {
    status: string
    count: number
    percentage: number
  }[]
}

export function InventoryStatusCard({ title, total, items }: InventoryStatusCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{total.toLocaleString()}</div>
        <div className="mt-4 space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <StatusBadge status={item.status as any} className="mr-2" />
                <span className="text-sm">{item.status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{item.count.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          {items.map((item, index) => {
            // Define colors for different statuses
            const getColor = (status: string) => {
              switch (status.toLowerCase()) {
                case "approved":
                  return "bg-secondary"
                case "quarantine":
                  return "bg-amber-500"
                case "rejected":
                  return "bg-destructive"
                case "expired":
                  return "bg-destructive"
                case "retest":
                  return "bg-purple-500"
                case "pending":
                  return "bg-warning"
                default:
                  return "bg-primary"
              }
            }

            return (
              <div
                key={index}
                className={`h-full ${getColor(item.status)}`}
                style={{
                  width: `${item.percentage}%`,
                  marginLeft: index > 0 ? "0" : "0",
                  float: "left",
                }}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
