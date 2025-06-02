"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const requisitions = [
  {
    id: "REQ-2023-06-001",
    department: "Production Unit A",
    requestedBy: "John Smith",
    material: "Paracetamol API",
    quantity: "100 kg",
    urgency: "High",
    status: "pending",
    requestDate: "2023-06-01",
    requiredDate: "2023-06-05",
  },
  {
    id: "REQ-2023-05-028",
    department: "Production Unit B",
    requestedBy: "Sarah Johnson",
    material: "Amoxicillin API",
    quantity: "50 kg",
    urgency: "Medium",
    status: "approved",
    requestDate: "2023-05-28",
    requiredDate: "2023-06-02",
  },
  {
    id: "REQ-2023-05-025",
    department: "R&D Department",
    requestedBy: "Dr. Michael Brown",
    material: "Ibuprofen API",
    quantity: "25 kg",
    urgency: "Low",
    status: "completed",
    requestDate: "2023-05-25",
    requiredDate: "2023-05-30",
  },
  {
    id: "REQ-2023-05-020",
    department: "Quality Control",
    requestedBy: "Lisa Wilson",
    material: "Reference Standards",
    quantity: "5 kg",
    urgency: "High",
    status: "rejected",
    requestDate: "2023-05-20",
    requiredDate: "2023-05-25",
  },
]

const requisitionColumns = [
  {
    accessorKey: "id",
    header: "Requisition ID",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "requestedBy",
    header: "Requested By",
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
    accessorKey: "urgency",
    header: "Urgency",
    cell: ({ row }) => {
      const urgency = row.getValue("urgency")
      const variant = urgency === "High" ? "destructive" : urgency === "Medium" ? "default" : "secondary"
      return <Badge variant={variant}>{urgency}</Badge>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "requestDate",
    header: "Request Date",
  },
  {
    accessorKey: "requiredDate",
    header: "Required Date",
  },
]

export default function RequisitionPage() {
  const [activeTab, setActiveTab] = useState("list")

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Requisition Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setActiveTab("create")}>
            <Plus className="mr-2 h-4 w-4" />
            New Requisition
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="list">Requisition List</TabsTrigger>
          <TabsTrigger value="create">Create Requisition</TabsTrigger>
          <TabsTrigger value="status">Status Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Requisitions</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search requisitions..." className="pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={requisitionColumns}
                data={requisitions}
                searchColumn="material"
                searchPlaceholder="Search by material..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Requisition</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production-a">Production Unit A</SelectItem>
                        <SelectItem value="production-b">Production Unit B</SelectItem>
                        <SelectItem value="rd">R&D Department</SelectItem>
                        <SelectItem value="qc">Quality Control</SelectItem>
                        <SelectItem value="qa">Quality Assurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requestedBy">Requested By</Label>
                    <Input id="requestedBy" placeholder="Enter your name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paracetamol">Paracetamol API</SelectItem>
                        <SelectItem value="amoxicillin">Amoxicillin API</SelectItem>
                        <SelectItem value="ibuprofen">Ibuprofen API</SelectItem>
                        <SelectItem value="aspirin">Aspirin API</SelectItem>
                        <SelectItem value="standards">Reference Standards</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" placeholder="Enter quantity (e.g., 100 kg)" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requiredDate">Required Date</Label>
                    <Input id="requiredDate" type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose/Justification</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Explain the purpose and justification for this requisition..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" placeholder="Any additional notes or special requirements..." rows={3} />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button">
                    Save as Draft
                  </Button>
                  <Button type="submit">Submit Requisition</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Requisition Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">REQ-2023-06-001</h3>
                      <p className="text-sm text-muted-foreground">Paracetamol API - 100 kg</p>
                    </div>
                    <StatusBadge status="pending" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">REQ-2023-05-028</h3>
                      <p className="text-sm text-muted-foreground">Amoxicillin API - 50 kg</p>
                    </div>
                    <StatusBadge status="approved" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">REQ-2023-05-025</h3>
                      <p className="text-sm text-muted-foreground">Ibuprofen API - 25 kg</p>
                    </div>
                    <StatusBadge status="completed" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approval Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Department Head Review</p>
                      <p className="text-sm text-muted-foreground">Initial approval by department head</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Inventory Check</p>
                      <p className="text-sm text-muted-foreground">Verify material availability</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Final Approval</p>
                      <p className="text-sm text-muted-foreground">Final approval and scheduling</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Material Dispatch</p>
                      <p className="text-sm text-muted-foreground">Material prepared and dispatched</p>
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
