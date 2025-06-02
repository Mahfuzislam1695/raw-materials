import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { StatusBadge } from "@/components/ui/status-badge"
import { DataTable } from "@/components/ui/data-table"
import { Timeline } from "@/components/ui/timeline"
import { InventoryStatusCard } from "@/components/ui/inventory-status-card"
import { TemperatureChart } from "@/components/ui/temperature-chart"
import { AlertCircle, ArrowUpRight, CheckCircle2, Clock, Package, ShieldCheck, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample data for the dashboard
const recentShipments = [
  {
    id: "SH-2023-06-01",
    supplier: "PharmaCorp Inc.",
    material: "Paracetamol API",
    quantity: "500 kg",
    arrivalDate: "2023-06-01",
    status: "pending",
  },
  {
    id: "SH-2023-05-28",
    supplier: "MediChem Ltd.",
    material: "Amoxicillin API",
    quantity: "250 kg",
    arrivalDate: "2023-05-28",
    status: "approved",
  },
  {
    id: "SH-2023-05-25",
    supplier: "BioSynth Labs",
    material: "Ibuprofen API",
    quantity: "300 kg",
    arrivalDate: "2023-05-25",
    status: "quarantine",
  },
  {
    id: "SH-2023-05-20",
    supplier: "GlobalPharma",
    material: "Aspirin API",
    quantity: "400 kg",
    arrivalDate: "2023-05-20",
    status: "rejected",
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
    accessorKey: "arrivalDate",
    header: "Arrival Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
]

const expiryAlerts = [
  {
    id: "B-2023-01-15",
    material: "Paracetamol API",
    batch: "PCM-2023-01",
    expiryDate: "2023-07-01",
    daysLeft: 30,
    location: "Warehouse A, Zone 2",
  },
  {
    id: "B-2023-01-20",
    material: "Amoxicillin API",
    batch: "AMX-2023-01",
    expiryDate: "2023-06-15",
    daysLeft: 14,
    location: "Warehouse B, Zone 1",
  },
  {
    id: "B-2023-02-05",
    material: "Ibuprofen API",
    batch: "IBU-2023-01",
    expiryDate: "2023-06-10",
    daysLeft: 9,
    location: "Warehouse A, Zone 3",
  },
  {
    id: "B-2023-02-10",
    material: "Aspirin API",
    batch: "ASP-2023-01",
    expiryDate: "2023-06-05",
    daysLeft: 4,
    location: "Warehouse C, Zone 1",
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
    accessorKey: "expiryDate",
    header: "Expiry Date",
  },
  {
    accessorKey: "daysLeft",
    header: "Days Left",
    cell: ({ row }) => {
      const daysLeft = row.getValue("daysLeft")
      let className = "text-secondary-600"

      if (daysLeft <= 10) {
        className = "text-destructive font-medium"
      } else if (daysLeft <= 30) {
        className = "text-warning-600 font-medium"
      }

      return <span className={className}>{daysLeft} days</span>
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
]

const timelineItems = [
  {
    title: "Shipment Arrived",
    description: "Shipment SH-2023-06-01 has arrived at the facility",
    icon: Truck,
    date: "Today, 09:15 AM",
    status: "completed",
  },
  {
    title: "GRN Generated",
    description: "GRN-2023-06-01-001 created for Paracetamol API",
    icon: CheckCircle2,
    date: "Today, 10:30 AM",
    status: "completed",
  },
  {
    title: "QC Sampling",
    description: "Samples collected for quality testing",
    icon: ShieldCheck,
    date: "Today, 11:45 AM",
    status: "current",
  },
  {
    title: "QC Testing",
    description: "Quality testing in progress",
    icon: Clock,
    date: "Pending",
    status: "upcoming",
  },
  {
    title: "Inventory Update",
    description: "Material will be added to inventory after QC approval",
    icon: Package,
    date: "Pending",
    status: "upcoming",
  },
]

const inventoryStatusData = {
  title: "Inventory Status",
  total: 1284,
  items: [
    { status: "approved", count: 856, percentage: 66.7 },
    { status: "quarantine", count: 234, percentage: 18.2 },
    { status: "pending", count: 142, percentage: 11.1 },
    { status: "rejected", count: 52, percentage: 4.0 },
  ],
}

export default function Home() {
  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm">New Requisition</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">+4.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending QC</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">-2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Within next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Requisitions</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={shipmentsColumns}
              data={recentShipments}
              searchColumn="material"
              searchPlaceholder="Search materials..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline items={timelineItems} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <InventoryStatusCard {...inventoryStatusData} />

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Expiry Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={expiryColumns}
              data={expiryAlerts}
              searchColumn="material"
              searchPlaceholder="Search materials..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <TemperatureChart
          title="Cold Storage Temperature Monitoring"
          minTemp={2}
          maxTemp={8}
          criticalLow={0}
          criticalHigh={10}
        />
      </div>
    </MainLayout>
  )
}
