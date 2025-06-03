"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/ui/status-badge"

interface DashboardTablesProps {
  type: "shipments" | "expiry"
  data: any[]
  searchPlaceholder?: string
}

export function DashboardTables({ type, data, searchPlaceholder = "Search..." }: DashboardTablesProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = data.filter((item) => {
    const searchValue = searchTerm.toLowerCase()
    if (type === "shipments") {
      return (
        item.material?.toLowerCase().includes(searchValue) ||
        item.supplier?.toLowerCase().includes(searchValue) ||
        item.id?.toLowerCase().includes(searchValue)
      )
    } else {
      return (
        item.material?.toLowerCase().includes(searchValue) ||
        item.batch?.toLowerCase().includes(searchValue) ||
        item.location?.toLowerCase().includes(searchValue)
      )
    }
  })

  const renderShipmentsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shipment ID</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Material</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Arrival Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.supplier}</TableCell>
            <TableCell>{item.material}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{item.arrivalDate}</TableCell>
            <TableCell>
              <StatusBadge status={item.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderExpiryTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material</TableHead>
          <TableHead>Batch</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Days Left</TableHead>
          <TableHead>Location</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.material}</TableCell>
            <TableCell>{item.batch}</TableCell>
            <TableCell>{item.expiryDate}</TableCell>
            <TableCell>
              <span
                className={
                  item.daysLeft <= 10
                    ? "text-destructive font-medium"
                    : item.daysLeft <= 30
                      ? "text-warning-600 font-medium"
                      : "text-secondary-600"
                }
              >
                {item.daysLeft} days
              </span>
            </TableCell>
            <TableCell>{item.location}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm pl-8"
          />
        </div>
      </div>
      <div className="rounded-md border">{type === "shipments" ? renderShipmentsTable() : renderExpiryTable()}</div>
      {filteredData.length === 0 && <div className="text-center py-4 text-muted-foreground">No results found.</div>}
    </div>
  )
}
