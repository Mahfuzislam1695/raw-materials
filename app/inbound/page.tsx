"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Timeline } from "@/components/ui/timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Truck,
  Package,
  FileText,
  Scale,
  CheckCircle2,
  AlertCircle,
  Plane,
  Ship,
  ClipboardCheck,
  Calendar,
} from "lucide-react"
import Link from "next/link"

const incomingShipments = [
  {
    id: "SH-2023-06-001",
    supplier: "PharmaCorp Inc.",
    material: "Paracetamol API",
    quantity: "500 kg",
    mode: "Air",
    eta: "2023-06-02 14:30",
    status: "in-transit",
    trackingNumber: "AC123456789",
    invoiceNumber: "INV-2023-001",
    packingListRef: "PL-2023-001",
    estimatedArrival: "7 days",
  },
  {
    id: "SH-2023-05-028",
    supplier: "MediChem Ltd.",
    material: "Amoxicillin API",
    quantity: "250 kg",
    mode: "Ship",
    eta: "2023-06-01 09:00",
    status: "arrived",
    trackingNumber: "SC987654321",
    invoiceNumber: "INV-2023-002",
    packingListRef: "PL-2023-002",
    estimatedArrival: "15 days",
  },
  {
    id: "SH-2023-05-025",
    supplier: "BioSynth Labs",
    material: "Ibuprofen API",
    quantity: "300 kg",
    mode: "Air",
    eta: "2023-05-26 16:45",
    status: "received",
    trackingNumber: "AC555666777",
    invoiceNumber: "INV-2023-003",
    packingListRef: "PL-2023-003",
    estimatedArrival: "7 days",
  },
]

const shipmentsColumns = [
  {
    accessorKey: "id",
    header: "Shipment ID",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "material",
    header: "Material",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "mode",
    header: "Mode",
    cell: ({ row }) => {
      const mode = row.getValue("mode")
      const Icon = mode === "Air" ? Plane : Ship
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {mode}
        </div>
      )
    },
  },
  {
    accessorKey: "estimatedArrival",
    header: "Est. Arrival",
    cell: ({ row }) => {
      const mode = row.original.mode
      const days = mode === "Air" ? "7 days" : "15 days"
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{days}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "eta",
    header: "ETA",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "trackingNumber",
    header: "Tracking",
  },
]

const grnData = [
  {
    id: "GRN-2023-06-001",
    shipmentId: "SH-2023-05-028",
    supplier: "MediChem Ltd.",
    material: "Amoxicillin API",
    orderedQty: "250 kg",
    receivedQty: "248.5 kg",
    variance: "-1.5 kg",
    status: "completed",
    receivedDate: "2023-06-01",
    receivedBy: "John Smith",
    cleaningStatus: "completed",
    weightVerified: true,
  },
  {
    id: "GRN-2023-05-025",
    shipmentId: "SH-2023-05-025",
    supplier: "BioSynth Labs",
    material: "Ibuprofen API",
    orderedQty: "300 kg",
    receivedQty: "300 kg",
    variance: "0 kg",
    status: "pending",
    receivedDate: "2023-05-26",
    receivedBy: "Sarah Johnson",
    cleaningStatus: "in-progress",
    weightVerified: false,
  },
]

const grnColumns = [
  {
    accessorKey: "id",
    header: "GRN Number",
  },
  {
    accessorKey: "shipmentId",
    header: "Shipment ID",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "material",
    header: "Material",
  },
  {
    accessorKey: "orderedQty",
    header: "Ordered Qty",
  },
  {
    accessorKey: "receivedQty",
    header: "Received Qty",
  },
  {
    accessorKey: "variance",
    header: "Variance",
    cell: ({ row }) => {
      const variance = row.getValue("variance")
      const isNegative = variance.includes("-")
      return (
        <span className={isNegative ? "text-destructive font-medium" : "text-secondary font-medium"}>{variance}</span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "receivedDate",
    header: "Received Date",
  },
]

const receivingTimelineItems = [
  {
    title: "Shipment Notification Received",
    description: "Advance shipment notice from supplier",
    icon: AlertCircle,
    date: "2023-06-01 08:00",
    status: "completed",
  },
  {
    title: "Shipment Arrived",
    description: "Physical arrival at receiving dock",
    icon: Truck,
    date: "2023-06-01 09:15",
    status: "completed",
  },
  {
    title: "Documentation Verified",
    description: "Invoice and packing list checked",
    icon: FileText,
    date: "2023-06-01 09:30",
    status: "completed",
  },
  {
    title: "Quality Parameters Verified",
    description: "23-point quality checklist completed",
    icon: ClipboardCheck,
    date: "2023-06-01 09:45",
    status: "completed",
  },
  {
    title: "Material Cleaning",
    description: "External packaging cleaning in progress",
    icon: Package,
    date: "2023-06-01 10:00",
    status: "current",
  },
  {
    title: "Weight Verification",
    description: "Pending weight verification",
    icon: Scale,
    date: "Pending",
    status: "upcoming",
  },
  {
    title: "GRN Generation",
    description: "Generate goods received note",
    icon: CheckCircle2,
    date: "Pending",
    status: "upcoming",
  },
]

export default function InboundPage() {
  const [activeTab, setActiveTab] = useState("notifications")

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Inbound Shipment Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm" asChild>
            <Link href="/receiving">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Start Receiving Process
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Expected this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Arrived Today</CardTitle>
            <Package className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">GRNs Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weight Variances</CardTitle>
            <Scale className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Requiring investigation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="notifications">Incoming Shipments</TabsTrigger>
          <TabsTrigger value="receiving">Receiving Timeline</TabsTrigger>
          <TabsTrigger value="grn">GRN Management</TabsTrigger>
          <TabsTrigger value="details">Shipment Details</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Shipments</CardTitle>
              <p className="text-sm text-muted-foreground">
                Air shipments typically arrive within 7 days, ship shipments within 15 days
              </p>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={shipmentsColumns}
                data={incomingShipments}
                searchColumn="material"
                searchPlaceholder="Search shipments..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receiving" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Receiving Process Timeline</CardTitle>
              <p className="text-sm text-muted-foreground">
                Updated receiving process with quality parameters verification
              </p>
            </CardHeader>
            <CardContent>
              <Timeline items={receivingTimelineItems} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grn" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Goods Received Notes (GRN)</CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  const grnNumber = `GRN-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
                  alert(`New GRN Generated!\nGRN Number: ${grnNumber}\nStatus: Ready for processing`)
                }}
              >
                Generate New GRN
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={grnColumns}
                data={grnData}
                searchColumn="material"
                searchPlaceholder="Search GRNs..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium">Invoice Number</Label>
                      <p className="text-sm text-muted-foreground">INV-2023-002</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Packing List</Label>
                      <p className="text-sm text-muted-foreground">PL-2023-002</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Certificate of Analysis</Label>
                      <p className="text-sm text-muted-foreground">COA-2023-002</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Material Safety Data Sheet</Label>
                      <p className="text-sm text-muted-foreground">MSDS-AMX-2023</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Special Handling Instructions</Label>
                    <p className="text-sm text-muted-foreground">
                      Store in cool, dry place. Temperature: 15-25°C. Protect from light and moisture.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View Invoice
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View COA
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View MSDS
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Arrival Time Estimates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Plane className="h-4 w-4" />
                        Air Shipments
                      </h4>
                      <Badge variant="secondary">7 Days</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Air freight typically arrives at the factory within 7 days of dispatch.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Ship className="h-4 w-4" />
                        Ship Shipments
                      </h4>
                      <Badge variant="secondary">15 Days</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sea freight typically takes 15 days to arrive at the factory and be received.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Planning Notes</h4>
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Air shipments: Plan receiving within 7 days</li>
                      <li>• Ship shipments: Plan receiving within 15 days</li>
                      <li>• Factor in customs clearance time</li>
                      <li>• Coordinate with warehouse capacity</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}
