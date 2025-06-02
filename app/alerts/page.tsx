"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import {
  AlertTriangle,
  Clock,
  Thermometer,
  Package,
  Shield,
  Bell,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  MapPin,
  Activity,
  Zap,
  Eye,
  Archive,
  RefreshCw,
} from "lucide-react"

// Mock data for alerts
const alertsData = [
  {
    id: "ALT-001",
    type: "Temperature",
    severity: "Critical",
    title: "Temperature Deviation in Zone A-1",
    description: "Temperature exceeded 25°C threshold in cold storage zone",
    location: "Warehouse 1 - Zone A-1",
    timestamp: "2024-01-15 14:30:00",
    status: "Active",
    assignedTo: "John Smith",
    category: "Environmental",
    priority: "High",
    source: "Sensor TMP-001",
    value: "27.5°C",
    threshold: "25°C",
    duration: "15 minutes",
  },
  {
    id: "ALT-002",
    type: "Inventory",
    severity: "High",
    title: "Low Stock Alert - Paracetamol API",
    description: "Stock level below minimum threshold",
    location: "Warehouse 2 - Zone B-3",
    timestamp: "2024-01-15 13:45:00",
    status: "Acknowledged",
    assignedTo: "Sarah Johnson",
    category: "Inventory",
    priority: "Medium",
    source: "Inventory System",
    value: "50 kg",
    threshold: "100 kg",
    duration: "2 hours",
  },
  {
    id: "ALT-003",
    type: "Quality",
    severity: "Medium",
    title: "Batch QC Pending",
    description: "Quality control testing overdue for batch B2024-001",
    location: "QC Laboratory",
    timestamp: "2024-01-15 12:00:00",
    status: "Resolved",
    assignedTo: "Mike Wilson",
    category: "Quality Control",
    priority: "Medium",
    source: "QC System",
    value: "Overdue 6 hours",
    threshold: "24 hours",
    duration: "6 hours",
  },
  {
    id: "ALT-004",
    type: "Security",
    severity: "Critical",
    title: "Unauthorized Access Attempt",
    description: "Failed login attempts detected from unknown IP",
    location: "System Access",
    timestamp: "2024-01-15 11:15:00",
    status: "Active",
    assignedTo: "Security Team",
    category: "Security",
    priority: "Critical",
    source: "Security System",
    value: "5 attempts",
    threshold: "3 attempts",
    duration: "30 minutes",
  },
  {
    id: "ALT-005",
    type: "Equipment",
    severity: "Medium",
    title: "Sensor Battery Low",
    description: "Temperature sensor battery level below 20%",
    location: "Warehouse 1 - Zone C-2",
    timestamp: "2024-01-15 10:30:00",
    status: "In Progress",
    assignedTo: "Maintenance Team",
    category: "Equipment",
    priority: "Low",
    source: "Sensor HUM-005",
    value: "15%",
    threshold: "20%",
    duration: "4 hours",
  },
]

const alertColumns = [
  {
    accessorKey: "id",
    header: "Alert ID",
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }: any) => {
      const severity = row.getValue("severity")
      const severityColors = {
        Critical: "bg-red-100 text-red-800 border-red-200",
        High: "bg-orange-100 text-orange-800 border-orange-200",
        Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Low: "bg-blue-100 text-blue-800 border-blue-200",
      }
      return <Badge className={severityColors[severity as keyof typeof severityColors]}>{severity}</Badge>
    },
  },
  {
    accessorKey: "title",
    header: "Alert Title",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "timestamp",
    header: "Time",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status")
      const statusColors = {
        Active: "bg-red-100 text-red-800",
        Acknowledged: "bg-yellow-100 text-yellow-800",
        "In Progress": "bg-blue-100 text-blue-800",
        Resolved: "bg-green-100 text-green-800",
      }
      return <Badge className={statusColors[status as keyof typeof statusColors]}>{status}</Badge>
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
  },
]

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const alertStats = {
    total: alertsData.length,
    active: alertsData.filter((alert) => alert.status === "Active").length,
    critical: alertsData.filter((alert) => alert.severity === "Critical").length,
    resolved: alertsData.filter((alert) => alert.status === "Resolved").length,
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "High":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "Medium":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "Low":
        return <Bell className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Environmental":
        return <Thermometer className="h-4 w-4" />
      case "Inventory":
        return <Package className="h-4 w-4" />
      case "Quality Control":
        return <Shield className="h-4 w-4" />
      case "Security":
        return <Zap className="h-4 w-4" />
      case "Equipment":
        return <Activity className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const filteredAlerts = alertsData.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = selectedSeverity === "all" || alert.severity === selectedSeverity
    const matchesStatus = selectedStatus === "all" || alert.status === selectedStatus
    const matchesCategory = selectedCategory === "all" || alert.category === selectedCategory

    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory
  })

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alert Management</h1>
            <p className="text-muted-foreground">Monitor and manage system alerts and notifications</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Configure Alerts
            </Button>
          </div>
        </div>

        {/* Alert Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertStats.total}</div>
              <p className="text-xs text-muted-foreground">All system alerts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{alertStats.active}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{alertStats.critical}</div>
              <p className="text-xs text-muted-foreground">High priority issues</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{alertStats.resolved}</div>
              <p className="text-xs text-muted-foreground">Successfully resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Environmental">Environmental</SelectItem>
                  <SelectItem value="Inventory">Inventory</SelectItem>
                  <SelectItem value="Quality Control">Quality Control</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alert Tabs */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Alert List</TabsTrigger>
            <TabsTrigger value="details">Detailed View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Alerts ({filteredAlerts.length})</CardTitle>
                <CardDescription>Comprehensive list of system alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={alertColumns} data={filteredAlerts} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getSeverityIcon(alert.severity)}
                        <div>
                          <CardTitle className="text-lg">{alert.title}</CardTitle>
                          <CardDescription>{alert.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            alert.severity === "Critical"
                              ? "bg-red-100 text-red-800"
                              : alert.severity === "High"
                                ? "bg-orange-100 text-orange-800"
                                : alert.severity === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                          }
                        >
                          {alert.severity}
                        </Badge>
                        <Badge
                          className={
                            alert.status === "Active"
                              ? "bg-red-100 text-red-800"
                              : alert.status === "Acknowledged"
                                ? "bg-yellow-100 text-yellow-800"
                                : alert.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                          }
                        >
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{alert.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{alert.assignedTo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(alert.category)}
                        <span>{alert.category}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Current Value:</span> {alert.value} |
                        <span className="font-medium"> Threshold:</span> {alert.threshold} |
                        <span className="font-medium"> Duration:</span> {alert.duration}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Archive className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alert Timeline</CardTitle>
                <CardDescription>Chronological view of all system alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAlerts.map((alert, index) => (
                    <div key={alert.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            alert.severity === "Critical"
                              ? "bg-red-500"
                              : alert.severity === "High"
                                ? "bg-orange-500"
                                : alert.severity === "Medium"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                          }`}
                        />
                        {index < filteredAlerts.length - 1 && <div className="w-0.5 h-8 bg-gray-200 ml-1 mt-2" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{alert.title}</p>
                          <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.location} • {alert.assignedTo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
