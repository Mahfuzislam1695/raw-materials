"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/ui/data-table"
import { TemperatureChart } from "@/components/ui/temperature-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Warehouse, Thermometer, MapPin, Package, Settings, Plus } from "lucide-react"

const warehouseData = [
  {
    id: "WH-A",
    name: "Warehouse A",
    type: "Both",
    building: "Building 1",
    floors: 3,
    zones: 12,
    capacity: "5000 kg",
    occupied: "3200 kg",
    occupancyRate: 64,
    temperature: "15-25°C",
    status: "active",
  },
  {
    id: "WH-B",
    name: "Warehouse B (Cold Storage)",
    type: "Stock",
    building: "Building 2",
    floors: 2,
    zones: 8,
    capacity: "2000 kg",
    occupied: "1800 kg",
    occupancyRate: 90,
    temperature: "2-8°C",
    status: "active",
  },
  {
    id: "WH-C",
    name: "Warehouse C (Quarantine)",
    type: "Quarantine",
    building: "Building 1",
    floors: 1,
    zones: 4,
    capacity: "1000 kg",
    occupied: "250 kg",
    occupancyRate: 25,
    temperature: "15-25°C",
    status: "active",
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
    accessorKey: "capacity",
    header: "Capacity",
  },
  {
    accessorKey: "occupied",
    header: "Occupied",
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
    header: "Temperature",
  },
]

const zoneData = [
  {
    id: "WH-A-Z1",
    warehouse: "Warehouse A",
    zone: "Zone 1",
    floor: "Floor 1",
    rows: 5,
    levels: 4,
    rakes: 20,
    capacity: "500 kg",
    occupied: "320 kg",
    occupancyRate: 64,
    materials: ["Paracetamol API", "Aspirin API"],
  },
  {
    id: "WH-A-Z2",
    warehouse: "Warehouse A",
    zone: "Zone 2",
    floor: "Floor 1",
    rows: 5,
    levels: 4,
    rakes: 20,
    capacity: "500 kg",
    occupied: "450 kg",
    occupancyRate: 90,
    materials: ["Ibuprofen API"],
  },
  {
    id: "WH-B-Z1",
    warehouse: "Warehouse B",
    zone: "Zone 1",
    floor: "Floor 1",
    rows: 4,
    levels: 3,
    rakes: 12,
    capacity: "250 kg",
    occupied: "225 kg",
    occupancyRate: 90,
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
    accessorKey: "levels",
    header: "Levels",
  },
  {
    accessorKey: "rakes",
    header: "Rakes",
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
      return (
        <div className="flex items-center gap-2">
          <Progress value={rate} className="w-16" />
          <span className="text-sm">{rate}%</span>
        </div>
      )
    },
  },
]

export default function WarehousePage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Warehouse Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
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
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,000 kg</div>
            <p className="text-xs text-muted-foreground">Across all warehouses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Occupancy</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,250 kg</div>
            <p className="text-xs text-muted-foreground">65.6% utilized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temperature Zones</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">All within range</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup Wizard</TabsTrigger>
          <TabsTrigger value="temperature">Temperature Mapping</TabsTrigger>
          <TabsTrigger value="allocation">Allocation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={warehouseColumns}
                  data={warehouseData}
                  searchColumn="name"
                  searchPlaceholder="Search warehouses..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zone Details</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={zoneColumns}
                  data={zoneData}
                  searchColumn="warehouse"
                  searchPlaceholder="Search zones..."
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="setup" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Setup Wizard</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="warehouseName">Warehouse Name</Label>
                    <Input id="warehouseName" placeholder="Enter warehouse name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warehouseType">Warehouse Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quarantine">Quarantine Only</SelectItem>
                        <SelectItem value="stock">Stock Only</SelectItem>
                        <SelectItem value="both">Both Quarantine & Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="building">Building</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select building" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="building1">Building 1</SelectItem>
                        <SelectItem value="building2">Building 2</SelectItem>
                        <SelectItem value="building3">Building 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="floors">Number of Floors</Label>
                    <Input id="floors" type="number" placeholder="Enter number of floors" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zones">Zones per Floor</Label>
                    <Input id="zones" type="number" placeholder="Enter zones per floor" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rows">Rows per Zone</Label>
                    <Input id="rows" type="number" placeholder="Enter rows per zone" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="levels">Levels per Row</Label>
                    <Input id="levels" type="number" placeholder="Enter levels per row" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rakes">Rakes per Level</Label>
                    <Input id="rakes" type="number" placeholder="Enter rakes per level" />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tempMin">Minimum Temperature (°C)</Label>
                    <Input id="tempMin" type="number" placeholder="Enter minimum temperature" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tempMax">Maximum Temperature (°C)</Label>
                    <Input id="tempMax" type="number" placeholder="Enter maximum temperature" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity Range (%)</Label>
                    <Input id="humidity" placeholder="e.g., 30-60%" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Total Capacity (kg)</Label>
                    <Input id="capacity" type="number" placeholder="Enter total capacity" />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button">
                    Save as Draft
                  </Button>
                  <Button type="submit">Create Warehouse</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temperature" className="mt-6">
          <div className="grid gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <TemperatureChart
                title="Warehouse A - Room Temperature"
                minTemp={15}
                maxTemp={25}
                criticalLow={10}
                criticalHigh={30}
              />
              <TemperatureChart
                title="Warehouse B - Cold Storage"
                minTemp={2}
                maxTemp={8}
                criticalLow={0}
                criticalHigh={10}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Temperature Monitoring Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">WH-A Zone 1</h4>
                      <Badge variant="secondary">22.5°C</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Room Temperature Storage</p>
                    <div className="mt-2">
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Within normal range</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">WH-B Zone 1</h4>
                      <Badge variant="secondary">5.2°C</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Cold Storage</p>
                    <div className="mt-2">
                      <Progress value={65} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Within normal range</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">WH-C Zone 1</h4>
                      <Badge variant="secondary">20.1°C</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Quarantine Storage</p>
                    <div className="mt-2">
                      <Progress value={50} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Within normal range</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Zone-based Allocation Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Cold Storage Materials</h4>
                    <p className="text-sm text-muted-foreground mb-2">Materials requiring 2-8°C storage temperature</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-assign to: Warehouse B</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Room Temperature APIs</h4>
                    <p className="text-sm text-muted-foreground mb-2">Standard APIs requiring 15-25°C storage</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-assign to: Warehouse A</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Quarantine Materials</h4>
                    <p className="text-sm text-muted-foreground mb-2">Materials pending QC approval</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-assign to: Warehouse C</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product-based Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Paracetamol API</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Primary Location:</span>
                        <span>WH-A, Zone 1</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Overflow Location:</span>
                        <span>WH-A, Zone 2</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Current Stock:</span>
                        <span>450 kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Amoxicillin API</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Primary Location:</span>
                        <span>WH-B, Zone 1</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Temperature Requirement:</span>
                        <span>2-8°C</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Current Stock:</span>
                        <span>180 kg</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Configure New Rule</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}
