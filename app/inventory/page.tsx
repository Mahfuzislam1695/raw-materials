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
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertTriangle,
  Package,
  Search,
  Download,
  Eye,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  TestTube,
} from "lucide-react"

// Stock Inventory Data
const stockInventory = [
  {
    id: "STK-2023-001",
    material: "Paracetamol API",
    batch: "PCM-2023-01",
    supplier: "PharmaCorp Inc.",
    quantity: "24.5 kg",
    location: "WH-S1, Zone-A, R-15, L-3",
    expiryDate: "2024-07-15",
    status: "available",
    temperature: "15-25°C",
    grn: "GRN-2023-001",
    lastMovement: "2023-06-15",
    binCard: "BC-STK-001",
  },
  {
    id: "STK-2023-002",
    material: "Amoxicillin API",
    batch: "AMX-2023-01",
    supplier: "MediChem Ltd.",
    quantity: "47.8 kg",
    location: "WH-S1, Zone-B, R-08, L-2",
    expiryDate: "2023-12-20",
    status: "near-expiry",
    temperature: "2-8°C",
    grn: "GRN-2023-002",
    lastMovement: "2023-05-28",
    binCard: "BC-STK-002",
  },
]

// Quarantine Inventory Data
const quarantineInventory = [
  {
    id: "QTN-2023-001",
    material: "Ibuprofen API",
    batch: "IBU-2023-01",
    supplier: "BioSynth Labs",
    quantity: "19.7 kg",
    location: "WH-Q1, Zone-A, R-03, L-1",
    expiryDate: "2023-08-30",
    status: "initial-quarantine",
    temperature: "15-25°C",
    grn: "GRN-2023-003",
    quarantineReason: "Initial quarantine after receiving",
    quarantineDate: "2023-03-05",
    expectedRelease: "2023-06-10",
    binCard: "BC-QTN-001",
  },
  {
    id: "QTN-2023-002",
    material: "Aspirin API",
    batch: "ASP-2023-02",
    supplier: "GlobalPharma",
    quantity: "15.2 kg",
    location: "WH-Q1, Zone-B, R-05, L-2",
    expiryDate: "2024-03-15",
    status: "retest-quarantine",
    temperature: "15-25°C",
    grn: "GRN-2023-008",
    quarantineReason: "Moved from stock for retest due to near expiry",
    quarantineDate: "2023-06-01",
    expectedRelease: "2023-06-15",
    binCard: "BC-QTN-002",
  },
]

// Reject Inventory Data
const rejectInventory = [
  {
    id: "REJ-2023-001",
    material: "Aspirin API",
    batch: "ASP-2023-01",
    supplier: "GlobalPharma",
    quantity: "150 kg",
    location: "WH-R1, Zone-A, R-05, L-1",
    expiryDate: "2023-06-15",
    status: "rejected",
    temperature: "15-25°C",
    grn: "GRN-2023-004",
    rejectionReason: "Failed identity test during QC",
    rejectionDate: "2022-12-25",
    disposalStatus: "pending",
    binCard: "BC-REJ-001",
  },
]

// Dispensing Records
const dispensingRecords = [
  {
    id: "DISP-2023-001",
    requisitionId: "REQ-2023-015",
    material: "Paracetamol API",
    batch: "PCM-2023-01",
    requestedQty: "5.0 kg",
    dispensedQty: "5.0 kg",
    returnedQty: "0.5 kg",
    netConsumption: "4.5 kg",
    department: "Production Dept A",
    dispensedBy: "John Smith",
    dispensedDate: "2023-06-10",
    returnDate: "2023-06-12",
    status: "completed",
  },
  {
    id: "DISP-2023-002",
    requisitionId: "REQ-2023-016",
    material: "Amoxicillin API",
    batch: "AMX-2023-01",
    requestedQty: "3.0 kg",
    dispensedQty: "3.0 kg",
    returnedQty: "0.0 kg",
    netConsumption: "3.0 kg",
    department: "Production Dept B",
    dispensedBy: "Sarah Wilson",
    dispensedDate: "2023-06-08",
    returnDate: "-",
    status: "pending-return",
  },
]

const stockColumns = [
  {
    accessorKey: "material",
    header: "Material",
  },
  {
    accessorKey: "batch",
    header: "Batch",
  },
  {
    accessorKey: "quantity",
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
      } else if (daysUntilExpiry <= 90) {
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
    accessorKey: "binCard",
    header: "Bin Card",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">
        <FileText className="h-4 w-4 mr-1" />
        {row.getValue("binCard")}
      </Button>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          title="View Details"
          onClick={() => {
            setSelectedItem(row.original)
            // Open details modal
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          title="Dispense"
          onClick={() => {
            setSelectedItem(row.original)
            setShowDispenseDialog(true)
          }}
        >
          <Truck className="h-4 w-4" />
        </Button>
        {row.getValue("status") === "near-expiry" && (
          <Button
            variant="ghost"
            size="sm"
            title="Move to Quarantine for Retest"
            onClick={() => {
              setSelectedItem(row.original)
              setShowMoveDialog(true)
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
  },
]

const quarantineColumns = [
  {
    accessorKey: "material",
    header: "Material",
  },
  {
    accessorKey: "batch",
    header: "Batch",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "quarantineReason",
    header: "Quarantine Reason",
  },
  {
    accessorKey: "expectedRelease",
    header: "Expected Release",
  },
  {
    accessorKey: "binCard",
    header: "Bin Card",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">
        <FileText className="h-4 w-4 mr-1" />
        {row.getValue("binCard")}
      </Button>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" title="View Details" onClick={() => setSelectedItem(row.original)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          title="Send QC Sample"
          onClick={() => {
            // Navigate to QC page with pre-filled data
            window.location.href = `/quality?source=quarantine&material=${row.original.material}&batch=${row.original.batch}`
          }}
        >
          <TestTube className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          title="Release to Stock"
          onClick={() => {
            setSelectedItem(row.original)
            setShowReleaseDialog(true)
          }}
        >
          <CheckCircle2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          title="Reject"
          onClick={() => {
            setSelectedItem(row.original)
            setShowRejectDialog(true)
          }}
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

const rejectColumns = [
  {
    accessorKey: "material",
    header: "Material",
  },
  {
    accessorKey: "batch",
    header: "Batch",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "rejectionReason",
    header: "Rejection Reason",
  },
  {
    accessorKey: "rejectionDate",
    header: "Rejection Date",
  },
  {
    accessorKey: "disposalStatus",
    header: "Disposal Status",
    cell: ({ row }) => {
      const status = row.getValue("disposalStatus")
      return (
        <Badge variant={status === "pending" ? "destructive" : "default"}>
          {status === "pending" ? "Pending" : "Disposed"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "binCard",
    header: "Bin Card",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">
        <FileText className="h-4 w-4 mr-1" />
        {row.getValue("binCard")}
      </Button>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" title="View Details">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" title="Return to Vendor">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" title="Destroy">
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

const dispensingColumns = [
  {
    accessorKey: "requisitionId",
    header: "Requisition ID",
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
    accessorKey: "requestedQty",
    header: "Requested",
  },
  {
    accessorKey: "dispensedQty",
    header: "Dispensed",
  },
  {
    accessorKey: "returnedQty",
    header: "Returned",
  },
  {
    accessorKey: "netConsumption",
    header: "Net Consumption",
    cell: ({ row }) => <span className="font-medium text-blue-600">{row.getValue("netConsumption")}</span>,
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" title="View Details">
          <Eye className="h-4 w-4" />
        </Button>
        {row.getValue("status") === "pending-return" && (
          <Button variant="ghost" size="sm" title="Process Return">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
  },
]

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("stock")
  const [showDispenseDialog, setShowDispenseDialog] = useState(false)
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [showReleaseDialog, setShowReleaseDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showReturnDialog, setShowReturnDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [dispensingForm, setDispensingForm] = useState({
    requisitionId: "",
    department: "",
    material: "",
    quantity: "",
    notes: "",
  })

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Bin Card Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock Items</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stockInventory.length}</div>
            <p className="text-xs text-muted-foreground">Available for dispensing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quarantine Items</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{quarantineInventory.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting QC clearance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected Items</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{rejectInventory.length}</div>
            <p className="text-xs text-muted-foreground">Pending disposal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Near Expiry</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-600">
              {stockInventory.filter((item) => item.status === "near-expiry").length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="stock">Stock Inventory</TabsTrigger>
          <TabsTrigger value="quarantine">Quarantine</TabsTrigger>
          <TabsTrigger value="reject">Rejected</TabsTrigger>
          <TabsTrigger value="dispensing">Dispensing Records</TabsTrigger>
          <TabsTrigger value="movements">Inventory Movements</TabsTrigger>
        </TabsList>

        {/* Stock Inventory Tab */}
        <TabsContent value="stock" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Stock Inventory
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search stock inventory..." className="pl-8" />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="near-expiry">Near Expiry</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={showDispenseDialog} onOpenChange={setShowDispenseDialog}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Dispense Material</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {selectedItem && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium">{selectedItem.material}</h4>
                          <p className="text-sm text-muted-foreground">Batch: {selectedItem.batch}</p>
                          <p className="text-sm text-muted-foreground">Available: {selectedItem.quantity}</p>
                          <p className="text-sm text-muted-foreground">Location: {selectedItem.location}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Requisition ID</Label>
                          <Input
                            placeholder="REQ-2023-XXX"
                            value={dispensingForm.requisitionId}
                            onChange={(e) => setDispensingForm({ ...dispensingForm, requisitionId: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Department</Label>
                          <Select
                            value={dispensingForm.department}
                            onValueChange={(value) => setDispensingForm({ ...dispensingForm, department: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="prod-a">Production Dept A</SelectItem>
                              <SelectItem value="prod-b">Production Dept B</SelectItem>
                              <SelectItem value="qc">QC Department</SelectItem>
                              <SelectItem value="rd">R&D Department</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Quantity to Dispense</Label>
                          <Input
                            placeholder="e.g., 5.0 kg"
                            value={dispensingForm.quantity}
                            onChange={(e) => setDispensingForm({ ...dispensingForm, quantity: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dispensed By</Label>
                          <Input placeholder="Enter operator name" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Dispensing Notes</Label>
                        <Textarea
                          placeholder="Enter any special instructions or notes..."
                          value={dispensingForm.notes}
                          onChange={(e) => setDispensingForm({ ...dispensingForm, notes: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDispenseDialog(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            // Process dispensing
                            console.log("Dispensing:", dispensingForm, selectedItem)
                            setShowDispenseDialog(false)
                            setDispensingForm({
                              requisitionId: "",
                              department: "",
                              material: "",
                              quantity: "",
                              notes: "",
                            })
                          }}
                        >
                          Dispense Material
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={stockColumns}
                data={stockInventory}
                searchColumn="material"
                searchPlaceholder="Search by material..."
              />
            </CardContent>
            {/* Expiry Management Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Expiry Management</h3>
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
                      <Button variant="outline" size="sm" className="w-full">
                        View All Expired Items
                      </Button>
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
                      <Button variant="outline" size="sm" className="w-full">
                        View All Expiring Items
                      </Button>
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
                      <Button variant="outline" size="sm" className="w-full">
                        View All Good Condition Items
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Quarantine Tab */}
        <TabsContent value="quarantine" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Quarantine Inventory
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search quarantine inventory..." className="pl-8" />
                </div>
                <Select>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reasons</SelectItem>
                    <SelectItem value="initial">Initial Quarantine</SelectItem>
                    <SelectItem value="retest">Retest Quarantine</SelectItem>
                    <SelectItem value="investigation">Investigation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={quarantineColumns}
                data={quarantineInventory}
                searchColumn="material"
                searchPlaceholder="Search by material..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reject Tab */}
        <TabsContent value="reject" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                Rejected Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={rejectColumns}
                data={rejectInventory}
                searchColumn="material"
                searchPlaceholder="Search by material..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dispensing Records Tab */}
        <TabsContent value="dispensing" className="mt-6">
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Dispensed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">156.8 kg</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Returned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">23.2 kg</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Net Consumption</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">133.6 kg</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Dispensing Records & Accounting
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete tracking of material dispensing, returns, and consumption
                </p>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={dispensingColumns}
                  data={dispensingRecords}
                  searchColumn="material"
                  searchPlaceholder="Search dispensing records..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dispensing Summary by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg font-medium text-sm">
                    <div>Department</div>
                    <div>Total Dispensed</div>
                    <div>Total Returned</div>
                    <div>Net Consumption</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                    <div>Production Dept A</div>
                    <div className="font-medium">45.0 kg</div>
                    <div className="font-medium text-green-600">5.5 kg</div>
                    <div className="font-medium text-purple-600">39.5 kg</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                    <div>Production Dept B</div>
                    <div className="font-medium">38.2 kg</div>
                    <div className="font-medium text-green-600">3.2 kg</div>
                    <div className="font-medium text-purple-600">35.0 kg</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                    <div>QC Department</div>
                    <div className="font-medium">12.5 kg</div>
                    <div className="font-medium text-green-600">2.1 kg</div>
                    <div className="font-medium text-purple-600">10.4 kg</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Movements Tab */}
        <TabsContent value="movements" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Inventory Movements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <ArrowRight className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Quarantine → Stock</p>
                        <p className="text-sm text-muted-foreground">Paracetamol API - PCM-2023-01</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">25.0 kg</p>
                      <p className="text-sm text-muted-foreground">2023-06-15</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Truck className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Stock → Dispensed</p>
                        <p className="text-sm text-muted-foreground">Amoxicillin API - AMX-2023-01</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">3.0 kg</p>
                      <p className="text-sm text-muted-foreground">2023-06-08</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <RotateCcw className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium">Stock → Quarantine</p>
                        <p className="text-sm text-muted-foreground">Aspirin API - ASP-2023-02</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">15.2 kg</p>
                      <p className="text-sm text-muted-foreground">2023-06-01</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Dialog open={showReleaseDialog} onOpenChange={setShowReleaseDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Release to Stock</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {selectedItem && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium">{selectedItem.material}</h4>
                      <p className="text-sm text-muted-foreground">Batch: {selectedItem.batch}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {selectedItem.quantity}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>QC Certificate Reference</Label>
                    <Input placeholder="Enter QC certificate number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock Location</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stock location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wh-s1-a">WH-S1, Zone-A</SelectItem>
                        <SelectItem value="wh-s1-b">WH-S1, Zone-B</SelectItem>
                        <SelectItem value="wh-s2-a">WH-S2, Zone-A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Release Notes</Label>
                    <Textarea placeholder="Enter release notes..." />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowReleaseDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowReleaseDialog(false)}>Release to Stock</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Material</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {selectedItem && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-medium">{selectedItem.material}</h4>
                      <p className="text-sm text-muted-foreground">Batch: {selectedItem.batch}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {selectedItem.quantity}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Rejection Reason</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rejection reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="failed-identity">Failed Identity Test</SelectItem>
                        <SelectItem value="failed-assay">Failed Assay Test</SelectItem>
                        <SelectItem value="failed-purity">Failed Purity Test</SelectItem>
                        <SelectItem value="contamination">Contamination Detected</SelectItem>
                        <SelectItem value="expired">Expired Material</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Reject Location</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reject location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wh-r1-a">WH-R1, Zone-A</SelectItem>
                        <SelectItem value="wh-r1-b">WH-R1, Zone-B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Detailed Rejection Notes</Label>
                    <Textarea placeholder="Enter detailed rejection reason and next steps..." />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => setShowRejectDialog(false)}>
                      Reject Material
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}
