"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Timeline } from "@/components/ui/timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, FileText, Scale, CheckCircle2, AlertCircle, Plane, Ship } from "lucide-react"

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
          <Button size="sm">
            <Package className="mr-2 h-4 w-4" />
            Manual Entry
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
          <TabsTrigger value="notifications">Shipment Notifications</TabsTrigger>
          <TabsTrigger value="receiving">Receiving Process</TabsTrigger>
          <TabsTrigger value="grn">GRN Management</TabsTrigger>
          <TabsTrigger value="details">Shipment Details</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Shipments</CardTitle>
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
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Material Receiving Process</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="shipmentId">Shipment ID</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SH-2023-05-028">SH-2023-05-028</SelectItem>
                          <SelectItem value="SH-2023-05-025">SH-2023-05-025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="receivedBy">Received By</Label>
                      <Input id="receivedBy" placeholder="Enter your name" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="receivedDate">Received Date</Label>
                      <Input id="receivedDate" type="datetime-local" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="receivedQty">Received Quantity</Label>
                      <Input id="receivedQty" placeholder="Enter quantity" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cleaningNotes">Cleaning Process Notes</Label>
                    <Textarea
                      id="cleaningNotes"
                      placeholder="Document cleaning process and any observations..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weightVerification">Weight Verification</Label>
                    <div className="grid gap-2 md:grid-cols-3">
                      <Input placeholder="Expected weight" />
                      <Input placeholder="Actual weight" />
                      <Input placeholder="Variance" disabled />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button">
                      Save Progress
                    </Button>
                    <Button type="submit">Complete Receiving</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receiving Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline items={receivingTimelineItems} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grn" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Goods Received Notes (GRN)</CardTitle>
              <Button size="sm">Generate New GRN</Button>
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
                <CardTitle>Temperature & Storage Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Storage Temperature</h4>
                      <Badge variant="secondary">2-8°C</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cold storage required. Monitor temperature continuously.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Humidity Control</h4>
                      <Badge variant="secondary">{"<"}60% RH</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Maintain relative humidity below 60% to prevent degradation.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Light Protection</h4>
                      <Badge variant="secondary">Required</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Store in amber containers or dark storage areas.</p>
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
