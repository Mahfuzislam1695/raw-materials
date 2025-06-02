"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Package, Search, Filter, Download, Eye, Edit, RotateCcw } from "lucide-react"

const inventoryData = [
  {
    id: "INV-2023-001",
    material: "Paracetamol API",
    batch: "PCM-2023-01",
    supplier: "PharmaCorp Inc.",
    quantity: "450 kg",
    availableQty: "450 kg",
    location: "Warehouse A, Zone 2, Rack 15",
    expiryDate: "2024-07-15",
    status: "approved",
    temperature: "15-25°C",
    grn: "GRN-2023-001",
    receivedDate: "2023-01-15",
  },
  {
    id: "INV-2023-002",
    material: "Amoxicillin API",
    batch: "AMX-2023-01",
    supplier: "MediChem Ltd.",
    quantity: "200 kg",
    availableQty: "180 kg",
    location: "Warehouse B, Zone 1, Rack 8",
    expiryDate: "2023-12-20",
    status: "approved",
    temperature: "2-8°C",
    grn: "GRN-2023-002",
    receivedDate: "2023-02-10",
  },
  {
    id: "INV-2023-003",
    material: "Ibuprofen API",
    batch: "IBU-2023-01",
    supplier: "BioSynth Labs",
    quantity: "300 kg",
    availableQty: "300 kg",
    location: "Warehouse A, Zone 3, Rack 22",
    expiryDate: "2023-08-30",
    status: "quarantine",
    temperature: "15-25°C",
    grn: "GRN-2023-003",
    receivedDate: "2023-03-05",
  },
  {
    id: "INV-2023-004",
    material: "Aspirin API",
    batch: "ASP-2023-01",
    supplier: "GlobalPharma",
    quantity: "150 kg",
    availableQty: "0 kg",
    location: "Warehouse C, Zone 1, Rack 5",
    expiryDate: "2023-06-15",
    status: "expired",
    temperature: "15-25°C",
    grn: "GRN-2023-004",
    receivedDate: "2022-12-20",
  },
]

const inventoryColumns = [
  {
    accessorKey: "material",
    header: "Material",
  },
  {
    accessorKey: "batch",
    header: "Batch",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "availableQty",
    header: "Available Qty",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => {
      const expiryDate = new Date(row.getValue("expiryDate"))
      const today = new Date()
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24))

      let className = "text-foreground"
      if (daysUntilExpiry < 0) {
        className = "text-destructive font-medium"
      } else if (daysUntilExpiry <= 30) {
        className = "text-warning-600 font-medium"
      }

      return <span className={className}>{row.getValue("expiryDate")}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "temperature",
    header: "Storage Temp",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
        {row.getValue("status") === "expired" && (
          <Button variant="ghost" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
  },
]

const retestData = [
  {
    id: "RT-2023-001",
    material: "Paracetamol API",
    batch: "PCM-2022-12",
    originalExpiry: "2023-06-15",
    retestDate: "2023-05-15",
    newExpiry: "2023-12-15",
    status: "pending",
    requestedBy: "QC Department",
  },
  {
    id: "RT-2023-002",
    material: "Amoxicillin API",
    batch: "AMX-2022-11",
    originalExpiry: "2023-05-20",
    retestDate: "2023-04-20",
    newExpiry: "2023-11-20",
    status: "approved",
    requestedBy: "QA Department",
  },
]

const retestColumns = [
  {
    accessorKey: "id",
    header: "Retest ID",
  },
  {
    accessorKey: "material",
    header: "Material",
  },
  {
    accessorKey: "batch",
    header: "Batch",
  },
  {
    accessorKey: "originalExpiry",
    header: "Original Expiry",
  },
  {
    accessorKey: "retestDate",
    header: "Retest Date",
  },
  {
    accessorKey: "newExpiry",
    header: "New Expiry",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "requestedBy",
    header: "Requested By",
  },
]

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("listing")

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Package className="mr-2 h-4 w-4" />
            Add Inventory
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">+12 new items this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Within next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Quarantine</CardTitle>
            <Package className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Awaiting QC approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Retest Required</CardTitle>
            <RotateCcw className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Pending retest approval</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="listing">Inventory Listing</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Management</TabsTrigger>
          <TabsTrigger value="retest">Retest Management</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
        </TabsList>

        <TabsContent value="listing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search inventory..." className="pl-8" />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="quarantine">Quarantine</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={inventoryColumns}
                data={inventoryData}
                searchColumn="material"
                searchPlaceholder="Search by material..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiry" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Expired (4)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-destructive/20 rounded-lg">
                    <h4 className="font-medium">Aspirin API</h4>
                    <p className="text-sm text-muted-foreground">Batch: ASP-2023-01</p>
                    <p className="text-sm text-destructive">Expired: 2023-06-15</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-warning/20">
              <CardHeader>
                <CardTitle className="text-warning-600">Expiring Soon (12)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-warning/20 rounded-lg">
                    <h4 className="font-medium">Ibuprofen API</h4>
                    <p className="text-sm text-muted-foreground">Batch: IBU-2023-01</p>
                    <p className="text-sm text-warning-600">Expires: 2023-08-30 (45 days)</p>
                  </div>
                  <div className="p-3 border border-warning/20 rounded-lg">
                    <h4 className="font-medium">Amoxicillin API</h4>
                    <p className="text-sm text-muted-foreground">Batch: AMX-2023-01</p>
                    <p className="text-sm text-warning-600">Expires: 2023-12-20 (120 days)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="text-secondary">Good Condition (1,268)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-secondary/20 rounded-lg">
                    <h4 className="font-medium">Paracetamol API</h4>
                    <p className="text-sm text-muted-foreground">Batch: PCM-2023-01</p>
                    <p className="text-sm text-secondary">Expires: 2024-07-15 (365+ days)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retest" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Retest Management</CardTitle>
              <Button size="sm">Request Retest</Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={retestColumns}
                data={retestData}
                searchColumn="material"
                searchPlaceholder="Search retest requests..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Adjustments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No adjustments recorded</h3>
                <p className="text-muted-foreground">Inventory adjustments will appear here when recorded.</p>
                <Button className="mt-4">Record Adjustment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}
