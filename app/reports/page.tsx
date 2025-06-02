"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart } from "lucide-react"

const grnHistory = [
  {
    id: "GRN-2023-001",
    date: "2023-06-01",
    supplier: "PharmaCorp Inc.",
    material: "Paracetamol API",
    batch: "PCM-2023-01",
    orderedQty: "500 kg",
    receivedQty: "498.5 kg",
    variance: "-1.5 kg",
    status: "completed",
    receivedBy: "John Smith",
  },
  {
    id: "GRN-2023-002",
    date: "2023-05-28",
    supplier: "MediChem Ltd.",
    material: "Amoxicillin API",
    batch: "AMX-2023-01",
    orderedQty: "250 kg",
    receivedQty: "248.5 kg",
    variance: "-1.5 kg",
    status: "completed",
    receivedBy: "Sarah Johnson",
  },
  {
    id: "GRN-2023-003",
    date: "2023-05-25",
    supplier: "BioSynth Labs",
    material: "Ibuprofen API",
    batch: "IBU-2023-01",
    orderedQty: "300 kg",
    receivedQty: "300 kg",
    variance: "0 kg",
    status: "completed",
    receivedBy: "Michael Brown",
  },
]

const grnColumns = [
  {
    accessorKey: "id",
    header: "GRN Number",
  },
  {
    accessorKey: "date",
    header: "Date",
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
    accessorKey: "batch",
    header: "Batch",
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
      const isZero = variance === "0 kg"
      return (
        <span
          className={
            isZero
              ? "text-secondary font-medium"
              : isNegative
                ? "text-destructive font-medium"
                : "text-warning font-medium"
          }
        >
          {variance}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
]

const qaQcLogs = [
  {
    id: "QC-LOG-001",
    date: "2023-06-01",
    material: "Paracetamol API",
    batch: "PCM-2023-01",
    testType: "Identity, Assay, Impurities",
    result: "Pass",
    decision: "approved",
    analyst: "Dr. Sarah Wilson",
    decisionBy: "QC Manager",
    remarks: "All parameters within specification",
  },
  {
    id: "QC-LOG-002",
    date: "2023-05-28",
    material: "Amoxicillin API",
    batch: "AMX-2023-01",
    testType: "Microbiological, Assay",
    result: "Pass",
    decision: "approved",
    analyst: "Dr. Michael Brown",
    decisionBy: "QC Manager",
    remarks: "Complies with pharmacopeial standards",
  },
  {
    id: "QC-LOG-003",
    date: "2023-05-25",
    material: "Ibuprofen API",
    batch: "IBU-2023-02",
    testType: "Identity, Assay",
    result: "Fail",
    decision: "rejected",
    analyst: "Dr. Lisa Johnson",
    decisionBy: "QC Manager",
    remarks: "Identity test failed - does not comply",
  },
]

const qaQcColumns = [
  {
    accessorKey: "id",
    header: "Log ID",
  },
  {
    accessorKey: "date",
    header: "Date",
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
    accessorKey: "testType",
    header: "Test Type",
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: ({ row }) => {
      const result = row.getValue("result")
      return <Badge variant={result === "Pass" ? "default" : "destructive"}>{result}</Badge>
    },
  },
  {
    accessorKey: "decision",
    header: "Decision",
    cell: ({ row }) => <StatusBadge status={row.getValue("decision")} />,
  },
  {
    accessorKey: "analyst",
    header: "Analyst",
  },
]

const expiryReport = [
  {
    material: "Paracetamol API",
    batch: "PCM-2023-01",
    quantity: "450 kg",
    expiryDate: "2024-07-15",
    daysLeft: 365,
    location: "Warehouse A, Zone 2",
    category: "Good",
  },
  {
    material: "Amoxicillin API",
    batch: "AMX-2023-01",
    quantity: "180 kg",
    expiryDate: "2023-12-20",
    daysLeft: 120,
    location: "Warehouse B, Zone 1",
    category: "Monitor",
  },
  {
    material: "Ibuprofen API",
    batch: "IBU-2023-01",
    quantity: "300 kg",
    expiryDate: "2023-08-30",
    daysLeft: 45,
    location: "Warehouse A, Zone 3",
    category: "Warning",
  },
  {
    material: "Aspirin API",
    batch: "ASP-2023-01",
    quantity: "0 kg",
    expiryDate: "2023-06-15",
    daysLeft: -15,
    location: "Warehouse C, Zone 1",
    category: "Expired",
  },
]

const expiryColumns = [
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
    accessorKey: "expiryDate",
    header: "Expiry Date",
  },
  {
    accessorKey: "daysLeft",
    header: "Days Left",
    cell: ({ row }) => {
      const daysLeft = row.getValue("daysLeft")
      let className = "text-secondary-600"

      if (daysLeft < 0) {
        className = "text-destructive font-medium"
      } else if (daysLeft <= 30) {
        className = "text-destructive font-medium"
      } else if (daysLeft <= 90) {
        className = "text-warning-600 font-medium"
      }

      return (
        <span className={className}>
          {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} days ago` : `${daysLeft} days`}
        </span>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category")
      const variant =
        category === "Expired"
          ? "destructive"
          : category === "Warning"
            ? "destructive"
            : category === "Monitor"
              ? "default"
              : "secondary"
      return <Badge variant={variant}>{category}</Badge>
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
]

const materialMovement = [
  {
    id: "MOV-001",
    date: "2023-06-01",
    type: "Inward",
    material: "Paracetamol API",
    batch: "PCM-2023-01",
    quantity: "500 kg",
    from: "PharmaCorp Inc.",
    to: "Warehouse A, Zone 2",
    reference: "GRN-2023-001",
    status: "completed",
  },
  {
    id: "MOV-002",
    date: "2023-06-01",
    type: "Internal",
    material: "Ibuprofen API",
    batch: "IBU-2023-01",
    quantity: "5 kg",
    from: "Warehouse A, Zone 3",
    to: "R&D Department",
    reference: "DISP-001",
    status: "completed",
  },
  {
    id: "MOV-003",
    date: "2023-05-28",
    type: "Outward",
    material: "Aspirin API",
    batch: "ASP-2023-01",
    quantity: "150 kg",
    from: "Warehouse C, Zone 1",
    to: "Vendor Return",
    reference: "RET-VEN-001",
    status: "completed",
  },
]

const movementColumns = [
  {
    accessorKey: "id",
    header: "Movement ID",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type")
      const variant = type === "Inward" ? "default" : type === "Outward" ? "destructive" : "secondary"
      return <Badge variant={variant}>{type}</Badge>
    },
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
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "from",
    header: "From",
  },
  {
    accessorKey: "to",
    header: "To",
  },
  {
    accessorKey: "reference",
    header: "Reference",
  },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("grn")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total GRNs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">QC Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Material Movements</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiry Alerts</CardTitle>
            <PieChart className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Items expiring soon</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  <SelectItem value="pharmacorp">PharmaCorp Inc.</SelectItem>
                  <SelectItem value="medichem">MediChem Ltd.</SelectItem>
                  <SelectItem value="biosynth">BioSynth Labs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All materials" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Materials</SelectItem>
                  <SelectItem value="paracetamol">Paracetamol API</SelectItem>
                  <SelectItem value="amoxicillin">Amoxicillin API</SelectItem>
                  <SelectItem value="ibuprofen">Ibuprofen API</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button>Apply Filters</Button>
            <Button variant="outline">Reset</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="grn">GRN History</TabsTrigger>
          <TabsTrigger value="requisition">Requisition History</TabsTrigger>
          <TabsTrigger value="qa-qc">QA/QC Logs</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Reports</TabsTrigger>
          <TabsTrigger value="movement">Material Movement</TabsTrigger>
        </TabsList>

        <TabsContent value="grn" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>GRN History Report</CardTitle>
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export GRN Report
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={grnColumns}
                data={grnHistory}
                searchColumn="material"
                searchPlaceholder="Search GRN records..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requisition" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Requisition History Report</CardTitle>
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Requisition Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Requisition History</h3>
                <p className="text-muted-foreground">Detailed requisition history will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qa-qc" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>QA/QC Decision Logs</CardTitle>
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export QC Report
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={qaQcColumns}
                data={qaQcLogs}
                searchColumn="material"
                searchPlaceholder="Search QC logs..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiry" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expiry-Based Inventory Report</CardTitle>
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Expiry Report
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={expiryColumns}
                data={expiryReport}
                searchColumn="material"
                searchPlaceholder="Search expiry records..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movement" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Material Movement Report</CardTitle>
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Movement Report
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={movementColumns}
                data={materialMovement}
                searchColumn="material"
                searchPlaceholder="Search movement records..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}
