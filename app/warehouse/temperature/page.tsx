"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TemperatureChart } from "@/components/ui/temperature-chart"
import { DataTable } from "@/components/ui/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Thermometer,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

const temperatureZones = [
  {
    id: "WH-A-Z1",
    warehouse: "Warehouse A",
    zone: "Zone 1",
    floor: "Floor 1",
    currentTemp: 22.5,
    currentHumidity: 45,
    targetTempMin: 15,
    targetTempMax: 25,
    targetHumidityMin: 30,
    targetHumidityMax: 60,
    status: "normal",
    sensorCount: 4,
    lastUpdate: "2023-06-01 14:30",
    materials: ["Paracetamol API", "Aspirin API"],
  },
  {
    id: "WH-A-Z2",
    warehouse: "Warehouse A",
    zone: "Zone 2",
    floor: "Floor 1",
    currentTemp: 23.8,
    currentHumidity: 42,
    targetTempMin: 15,
    targetTempMax: 25,
    targetHumidityMin: 30,
    targetHumidityMax: 60,
    status: "normal",
    sensorCount: 4,
    lastUpdate: "2023-06-01 14:30",
    materials: ["Ibuprofen API"],
  },
  {
    id: "WH-B-Z1",
    warehouse: "Warehouse B",
    zone: "Zone 1",
    floor: "Floor 1",
    currentTemp: 5.2,
    currentHumidity: 55,
    targetTempMin: 2,
    targetTempMax: 8,
    targetHumidityMin: 45,
    targetHumidityMax: 65,
    status: "normal",
    sensorCount: 6,
    lastUpdate: "2023-06-01 14:30",
    materials: ["Amoxicillin API"],
  },
  {
    id: "WH-B-Z2",
    warehouse: "Warehouse B",
    zone: "Zone 2",
    floor: "Floor 1",
    currentTemp: 9.1,
    currentHumidity: 58,
    targetTempMin: 2,
    targetTempMax: 8,
    targetHumidityMin: 45,
    targetHumidityMax: 65,
    status: "warning",
    sensorCount: 6,
    lastUpdate: "2023-06-01 14:30",
    materials: ["Insulin API"],
  },
]

const temperatureColumns = [
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
  {
    accessorKey: "zone",
    header: "Zone",
  },
  {
    accessorKey: "currentTemp",
    header: "Current Temp",
    cell: ({ row }) => {
      const temp = row.getValue("currentTemp")
      const min = row.original.targetTempMin
      const max = row.original.targetTempMax
      const isOutOfRange = temp < min || temp > max
      return <span className={isOutOfRange ? "text-destructive font-medium" : "text-foreground"}>{temp}°C</span>
    },
  },
  {
    accessorKey: "targetTempMin",
    header: "Target Range",
    cell: ({ row }) => (
      <span>
        {row.original.targetTempMin}°C - {row.original.targetTempMax}°C
      </span>
    ),
  },
  {
    accessorKey: "currentHumidity",
    header: "Humidity",
    cell: ({ row }) => {
      const humidity = row.getValue("currentHumidity")
      const min = row.original.targetHumidityMin
      const max = row.original.targetHumidityMax
      const isOutOfRange = humidity < min || humidity > max
      return <span className={isOutOfRange ? "text-destructive font-medium" : "text-foreground"}>{humidity}%</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      const variant = status === "normal" ? "default" : status === "warning" ? "destructive" : "destructive"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "sensorCount",
    header: "Sensors",
  },
  {
    accessorKey: "lastUpdate",
    header: "Last Update",
  },
]

const temperatureAlerts = [
  {
    id: "ALERT-001",
    timestamp: "2023-06-01 14:25",
    zone: "WH-B-Z2",
    type: "Temperature Deviation",
    severity: "High",
    currentValue: "9.1°C",
    expectedRange: "2-8°C",
    duration: "5 minutes",
    status: "active",
    action: "Investigate cooling system",
  },
  {
    id: "ALERT-002",
    timestamp: "2023-06-01 12:15",
    zone: "WH-A-Z3",
    type: "Humidity High",
    severity: "Medium",
    currentValue: "68%",
    expectedRange: "30-60%",
    duration: "15 minutes",
    status: "resolved",
    action: "Dehumidifier activated",
  },
  {
    id: "ALERT-003",
    timestamp: "2023-06-01 09:30",
    zone: "WH-C-Z1",
    type: "Sensor Malfunction",
    severity: "High",
    currentValue: "N/A",
    expectedRange: "15-25°C",
    duration: "2 hours",
    status: "active",
    action: "Replace sensor",
  },
]

const alertColumns = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
  },
  {
    accessorKey: "zone",
    header: "Zone",
  },
  {
    accessorKey: "type",
    header: "Alert Type",
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => {
      const severity = row.getValue("severity")
      const variant = severity === "High" ? "destructive" : severity === "Medium" ? "default" : "secondary"
      return <Badge variant={variant}>{severity}</Badge>
    },
  },
  {
    accessorKey: "currentValue",
    header: "Current Value",
  },
  {
    accessorKey: "expectedRange",
    header: "Expected Range",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      const variant = status === "active" ? "destructive" : "default"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "action",
    header: "Action Required",
  },
]

const sensorData = [
  {
    id: "SENSOR-001",
    location: "WH-A-Z1-R1",
    type: "Temperature/Humidity",
    model: "TempSense Pro 3000",
    status: "active",
    lastCalibration: "2023-05-01",
    nextCalibration: "2023-08-01",
    batteryLevel: 85,
    signalStrength: 95,
  },
  {
    id: "SENSOR-002",
    location: "WH-A-Z1-R2",
    type: "Temperature/Humidity",
    model: "TempSense Pro 3000",
    status: "active",
    lastCalibration: "2023-05-01",
    nextCalibration: "2023-08-01",
    batteryLevel: 78,
    signalStrength: 92,
  },
  {
    id: "SENSOR-003",
    location: "WH-B-Z1-R1",
    type: "Temperature/Humidity",
    model: "ColdChain Monitor X1",
    status: "active",
    lastCalibration: "2023-04-15",
    nextCalibration: "2023-07-15",
    batteryLevel: 92,
    signalStrength: 88,
  },
  {
    id: "SENSOR-004",
    location: "WH-C-Z1-R1",
    type: "Temperature/Humidity",
    model: "TempSense Pro 3000",
    status: "maintenance",
    lastCalibration: "2023-03-01",
    nextCalibration: "2023-06-01",
    batteryLevel: 15,
    signalStrength: 0,
  },
]

const sensorColumns = [
  {
    accessorKey: "id",
    header: "Sensor ID",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      const variant = status === "active" ? "default" : "destructive"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "batteryLevel",
    header: "Battery",
    cell: ({ row }) => {
      const level = row.getValue("batteryLevel")
      return (
        <div className="flex items-center gap-2">
          <Progress value={level} className="w-16" />
          <span className="text-sm">{level}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "nextCalibration",
    header: "Next Calibration",
  },
]

export default function WarehouseTemperaturePage() {
  const [activeTab, setActiveTab] = useState("monitoring")
  const [selectedZone, setSelectedZone] = useState("all")

  const activeAlerts = temperatureAlerts.filter((alert) => alert.status === "active")
  const normalZones = temperatureZones.filter((zone) => zone.status === "normal")
  const warningZones = temperatureZones.filter((zone) => zone.status === "warning")

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Temperature Mapping & Monitoring</h1>
        <div className="flex items-center gap-2">
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {temperatureZones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  {zone.warehouse} - {zone.zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Sensor
          </Button>
        </div>
      </div>

      {activeAlerts.length > 0 && (
        <Alert className="mt-6 border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{activeAlerts.length} active temperature alert(s)</strong> require immediate attention. Check the
            Alerts tab for details.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{temperatureZones.length}</div>
            <p className="text-xs text-muted-foreground">Monitored zones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Normal Zones</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{normalZones.length}</div>
            <p className="text-xs text-muted-foreground">Within target range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Warning Zones</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningZones.length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Thermometer className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Need immediate action</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
          <TabsTrigger value="mapping">Temperature Mapping</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
          <TabsTrigger value="sensors">Sensor Management</TabsTrigger>
          <TabsTrigger value="reports">Historical Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="mt-6">
          <div className="grid gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <TemperatureChart
                title="Warehouse A - Room Temperature Zones"
                minTemp={15}
                maxTemp={25}
                criticalLow={10}
                criticalHigh={30}
              />
              <TemperatureChart
                title="Warehouse B - Cold Storage Zones"
                minTemp={2}
                maxTemp={8}
                criticalLow={0}
                criticalHigh={10}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Zone Temperature Status</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={temperatureColumns}
                  data={temperatureZones}
                  searchColumn="warehouse"
                  searchPlaceholder="Search zones..."
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mapping" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Zone Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="zoneSelect">Select Zone</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select zone to configure" />
                        </SelectTrigger>
                        <SelectContent>
                          {temperatureZones.map((zone) => (
                            <SelectItem key={zone.id} value={zone.id}>
                              {zone.warehouse} - {zone.zone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="materialType">Material Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="room-temp">Room Temperature APIs</SelectItem>
                          <SelectItem value="cold-storage">Cold Storage APIs</SelectItem>
                          <SelectItem value="controlled">Controlled Temperature</SelectItem>
                          <SelectItem value="frozen">Frozen Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tempMin">Minimum Temperature (°C)</Label>
                      <Input id="tempMin" type="number" placeholder="e.g., 2" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tempMax">Maximum Temperature (°C)</Label>
                      <Input id="tempMax" type="number" placeholder="e.g., 8" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="humidityMin">Minimum Humidity (%)</Label>
                      <Input id="humidityMin" type="number" placeholder="e.g., 45" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="humidityMax">Maximum Humidity (%)</Label>
                      <Input id="humidityMax" type="number" placeholder="e.g., 65" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button">
                      Reset
                    </Button>
                    <Button type="submit">Update Zone Configuration</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              {temperatureZones.map((zone) => (
                <Card key={zone.id} className={zone.status === "warning" ? "border-destructive/50" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{zone.warehouse}</CardTitle>
                      <Badge variant={zone.status === "normal" ? "default" : "destructive"}>{zone.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {zone.zone} - {zone.floor}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Temperature</span>
                          <div className="flex items-center gap-2">
                            {zone.currentTemp < zone.targetTempMin || zone.currentTemp > zone.targetTempMax ? (
                              <TrendingDown className="h-4 w-4 text-destructive" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-secondary" />
                            )}
                            <span className="font-medium">{zone.currentTemp}°C</span>
                          </div>
                        </div>
                        <Progress
                          value={
                            ((zone.currentTemp - zone.targetTempMin) / (zone.targetTempMax - zone.targetTempMin)) * 100
                          }
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{zone.targetTempMin}°C</span>
                          <span>{zone.targetTempMax}°C</span>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Humidity</span>
                          <span className="font-medium">{zone.currentHumidity}%</span>
                        </div>
                        <Progress
                          value={
                            ((zone.currentHumidity - zone.targetHumidityMin) /
                              (zone.targetHumidityMax - zone.targetHumidityMin)) *
                            100
                          }
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{zone.targetHumidityMin}%</span>
                          <span>{zone.targetHumidityMax}%</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs">
                          <span>Sensors: {zone.sensorCount}</span>
                          <span>Updated: {zone.lastUpdate.split(" ")[1]}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Temperature & Humidity Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={alertColumns}
                data={temperatureAlerts}
                searchColumn="zone"
                searchPlaceholder="Search alerts..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sensors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Management</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Sensor
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={sensorColumns}
                data={sensorData}
                searchColumn="location"
                searchPlaceholder="Search sensors..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Compliance Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="reportFrom">From Date</Label>
                      <Input id="reportFrom" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reportTo">To Date</Label>
                      <Input id="reportTo" type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportZone">Zone</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Zones</SelectItem>
                        {temperatureZones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.warehouse} - {zone.zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">Generate Report</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Overall Compliance</span>
                      <span className="text-sm font-medium">98.5%</span>
                    </div>
                    <Progress value={98.5} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Temperature Compliance</span>
                      <span className="text-sm font-medium">99.2%</span>
                    </div>
                    <Progress value={99.2} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Humidity Compliance</span>
                      <span className="text-sm font-medium">97.8%</span>
                    </div>
                    <Progress value={97.8} />
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Recent Deviations</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>WH-B-Z2 Temperature</span>
                        <span className="text-destructive">2 hours</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>WH-A-Z3 Humidity</span>
                        <span className="text-warning">15 minutes</span>
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
