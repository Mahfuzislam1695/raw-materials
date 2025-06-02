"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Warehouse, MapPin, Package, Thermometer, AlertTriangle, Eye, Edit, Settings } from "lucide-react"

const warehouseOverview = [
  {
    id: "WH-A",
    name: "Warehouse A - General Storage",
    type: "Both",
    building: "Building 1",
    floors: 3,
    zones: 12,
    totalRacks: 240,
    capacity: "5000 kg",
    occupied: "3200 kg",
    occupancyRate: 64,
    temperature: "15-25°C",
    humidity: "30-60%",
    status: "active",
    materials: 45,
    batches: 128,
  },
  {
    id: "WH-B",
    name: "Warehouse B - Cold Storage",
    type: "Stock",
    building: "Building 2",
    floors: 2,
    zones: 8,
    totalRacks: 160,
    capacity: "2000 kg",
    occupied: "1800 kg",
    occupancyRate: 90,
    temperature: "2-8°C",
    humidity: "45-65%",
    status: "active",
    materials: 12,
    batches: 34,
  },
  {
    id: "WH-C",
    name: "Warehouse C - Quarantine",
    type: "Quarantine",
    building: "Building 1",
    floors: 1,
    zones: 4,
    totalRacks: 80,
    capacity: "1000 kg",
    occupied: "250 kg",
    occupancyRate: 25,
    temperature: "15-25°C",
    humidity: "30-60%",
    status: "active",
    materials: 8,
    batches: 15,
  },
]

const warehouseColumns = [
  {
    accessorKey: "name",
    header: "Warehouse Name",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type")
      const variant = type === "Quarantine" ? "destructive" : type === "Stock" ? "default" : "secondary"
      return <Badge variant={variant}>{type}</Badge>
    },
  },
  {
    accessorKey: "building",
    header: "Building",
  },
  {
    accessorKey: "zones",
    header: "Zones",
  },
  {
    accessorKey: "totalRacks",
    header: "Total Racks",
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
  },
  {
    accessorKey: "occupancyRate",
    header: "Occupancy",
    cell: ({ row }) => {
      const rate = row.getValue("occupancyRate")
      const getColor = (rate: number) => {
        if (rate >= 90) return "bg-destructive"
        if (rate >= 75) return "bg-warning"
        return "bg-secondary"
      }
      return (
        <div className="flex items-center gap-2">
          <Progress value={rate} className={`w-16 ${getColor(rate)}`} />
          <span className="text-sm">{rate}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "temperature",
    header: "Temperature",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return <Badge variant={status === "active" ? "default" : "destructive"}>{status}</Badge>
    },
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
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

const zoneDetails = [
  {
    id: "WH-A-Z1",
    warehouse: "Warehouse A",
    zone: "Zone 1",
    floor: "Floor 1",
    rows: 5,
    racksPerRow: 4,
    levelsPerRack: 4,
    totalRacks: 20,
    capacity: "500 kg",
    occupied: "320 kg",
    occupancyRate: 64,
    temperature: "22.5°C",
    humidity: "45%",
    materials: ["Paracetamol API", "Aspirin API"],
  },
  {
    id: "WH-A-Z2",
    warehouse: "Warehouse A",
    zone: "Zone 2",
    floor: "Floor 1",
    rows: 5,
    racksPerRow: 4,
    levelsPerRack: 4,
    totalRacks: 20,
    capacity: "500 kg",
    occupied: "450 kg",
    occupancyRate: 90,
    temperature: "23.1°C",
    humidity: "42%",
    materials: ["Ibuprofen API"],
  },
  {
    id: "WH-B-Z1",
    warehouse: "Warehouse B",
    zone: "Zone 1",
    floor: "Floor 1",
    rows: 4,
    racksPerRow: 5,
    levelsPerRack: 3,
    totalRacks: 20,
    capacity: "250 kg",
    occupied: "225 kg",
    occupancyRate: 90,
    temperature: "5.2°C",
    humidity: "55%",
    materials: ["Amoxicillin API"],
  },
]

const zoneColumns = [
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
  {
    accessorKey: "zone",
    header: "Zone",
  },
  {
    accessorKey: "floor",
    header: "Floor",
  },
  {
    accessorKey: "rows",
    header: "Rows",
  },
  {
    accessorKey: "racksPerRow",
    header: "Racks/Row",
  },
  {
    accessorKey: "levelsPerRack",
    header: "Levels/Rack",
  },
  {
    accessorKey: "totalRacks",
    header: "Total Racks",
  },
  {
    accessorKey: "occupancyRate",
    header: "Occupancy",
    cell: ({ row }) => {
      const rate = row.getValue("occupancyRate")
      return (
        <div className="flex items-center gap-2">
          <Progress value={rate} className="w-16" />
          <span className="text-sm">{rate}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "temperature",
    header: "Current Temp",
  },
]

const rackDetails = [
  {
    id: "WH-A-Z1-R1-RK1",
    location: "WH-A → Zone 1 → Row 1 → Rack 1",
    levels: 4,
    levelDetails: [
      { level: "Level 1", material: "Paracetamol API", batch: "PCM-2023-01", quantity: "25 kg", status: "occupied" },
      { level: "Level 2", material: "Paracetamol API", batch: "PCM-2023-02", quantity: "25 kg", status: "occupied" },
      { level: "Level 3", material: "", batch: "", quantity: "", status: "empty" },
      { level: "Level 4", material: "", batch: "", quantity: "", status: "empty" },
    ],
    capacity: "100 kg",
    occupied: "50 kg",
    occupancyRate: 50,
    lastUpdated: "2023-06-01 14:30",
  },
  {
    id: "WH-A-Z1-R1-RK2",
    location: "WH-A → Zone 1 → Row 1 → Rack 2",
    levels: 4,
    levelDetails: [
      { level: "Level 1", material: "Aspirin API", batch: "ASP-2023-01", quantity: "20 kg", status: "occupied" },
      { level: "Level 2", material: "Aspirin API", batch: "ASP-2023-02", quantity: "20 kg", status: "occupied" },
      { level: "Level 3", material: "Aspirin API", batch: "ASP-2023-03", quantity: "20 kg", status: "occupied" },
      { level: "Level 4", material: "", batch: "", quantity: "", status: "empty" },
    ],
    capacity: "100 kg",
    occupied: "60 kg",
    occupancyRate: 60,
    lastUpdated: "2023-06-01 12:15",
  },
]

export default function WarehouseOverviewPage() {
  const [activeTab, setActiveTab] = useState("warehouses")
  const [selectedWarehouse, setSelectedWarehouse] = useState("all")

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Warehouse Overview</h1>
        <div className="flex items-center gap-2">
          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              <SelectItem value="WH-A">Warehouse A</SelectItem>
              <SelectItem value="WH-B">Warehouse B</SelectItem>
              <SelectItem value="WH-C">Warehouse C</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">All operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Racks</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">480</div>
            <p className="text-xs text-muted-foreground">Across all warehouses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65.6%</div>
            <p className="text-xs text-muted-foreground">Optimal utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temperature Alerts</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">All zones normal</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="zones">Zone Details</TabsTrigger>
          <TabsTrigger value="racks">Rack Level View</TabsTrigger>
          <TabsTrigger value="utilization">Utilization Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="warehouses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={warehouseColumns}
                data={warehouseOverview}
                searchColumn="name"
                searchPlaceholder="Search warehouses..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Zone-wise Details</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={zoneColumns}
                data={zoneDetails}
                searchColumn="warehouse"
                searchPlaceholder="Search zones..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="racks" className="mt-6">
          <div className="grid gap-6">
            {rackDetails.map((rack) => (
              <Card key={rack.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rack.location}</CardTitle>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{rack.occupancyRate}% Occupied</Badge>
                      <span className="text-sm text-muted-foreground">Updated: {rack.lastUpdated}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {rack.levelDetails.map((level, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg ${
                          level.status === "occupied" ? "border-secondary bg-secondary/10" : "border-muted bg-muted/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{level.level}</h4>
                          <Badge variant={level.status === "occupied" ? "default" : "outline"}>{level.status}</Badge>
                        </div>
                        {level.status === "occupied" ? (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{level.material}</p>
                            <p className="text-xs text-muted-foreground">Batch: {level.batch}</p>
                            <p className="text-xs text-muted-foreground">Qty: {level.quantity}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Available for storage</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="utilization" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {warehouseOverview.map((warehouse) => (
                    <div key={warehouse.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{warehouse.name}</span>
                        <span className="text-sm">{warehouse.occupancyRate}%</span>
                      </div>
                      <Progress value={warehouse.occupancyRate} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{warehouse.occupied} used</span>
                        <span>{warehouse.capacity} total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Overall Utilization</span>
                      <span className="text-sm font-medium">65.6%</span>
                    </div>
                    <Progress value={65.6} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Cold Storage Utilization</span>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                    <Progress value={90} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Quarantine Utilization</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <Progress value={25} />
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                        <p className="text-sm">Cold storage is at 90% capacity. Consider expansion.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 text-secondary mt-0.5" />
                        <p className="text-sm">Quarantine area has excess capacity for future needs.</p>
                      </div>
                    </div>
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
