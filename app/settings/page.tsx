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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Settings, Database, Plus, Edit, Trash2 } from "lucide-react"

const userData = [
  {
    id: "USR-001",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Warehouse Manager",
    department: "Warehouse",
    status: "active",
    lastLogin: "2023-06-01 09:30",
    permissions: ["warehouse_full", "inventory_read", "grn_create"],
  },
  {
    id: "USR-002",
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "QC Manager",
    department: "Quality Control",
    status: "active",
    lastLogin: "2023-06-01 08:15",
    permissions: ["qc_full", "samples_manage", "decisions_approve"],
  },
  {
    id: "USR-003",
    name: "Michael Brown",
    email: "michael.brown@company.com",
    role: "Production Supervisor",
    department: "Production",
    status: "active",
    lastLogin: "2023-05-31 16:45",
    permissions: ["production_read", "requisition_create", "dispensing_view"],
  },
  {
    id: "USR-004",
    name: "Lisa Johnson",
    email: "lisa.johnson@company.com",
    role: "QC Analyst",
    department: "Quality Control",
    status: "inactive",
    lastLogin: "2023-05-28 14:20",
    permissions: ["qc_read", "samples_test", "results_enter"],
  },
]

const userColumns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
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
    accessorKey: "lastLogin",
    header: "Last Login",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

const productMaster = [
  {
    id: "PROD-001",
    name: "Paracetamol API",
    type: "API",
    category: "Analgesic",
    storageTemp: "15-25°C",
    shelfLife: "36 months",
    supplier: "PharmaCorp Inc.",
    status: "active",
  },
  {
    id: "PROD-002",
    name: "Amoxicillin API",
    type: "API",
    category: "Antibiotic",
    storageTemp: "2-8°C",
    shelfLife: "24 months",
    supplier: "MediChem Ltd.",
    status: "active",
  },
  {
    id: "PROD-003",
    name: "Microcrystalline Cellulose",
    type: "Supplementary",
    category: "Excipient",
    storageTemp: "15-25°C",
    shelfLife: "60 months",
    supplier: "ExcipientCorp",
    status: "active",
  },
]

const productColumns = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type")
      return <Badge variant={type === "API" ? "default" : "secondary"}>{type}</Badge>
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "storageTemp",
    header: "Storage Temp",
  },
  {
    accessorKey: "shelfLife",
    header: "Shelf Life",
  },
  {
    accessorKey: "supplier",
    header: "Primary Supplier",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
]

const vendorMaster = [
  {
    id: "VEN-001",
    name: "PharmaCorp Inc.",
    type: "API Supplier",
    country: "India",
    certifications: ["GMP", "ISO 9001", "FDA"],
    status: "approved",
    contactPerson: "Raj Patel",
    email: "raj.patel@pharmacorp.com",
    phone: "+91-9876543210",
  },
  {
    id: "VEN-002",
    name: "MediChem Ltd.",
    type: "API Supplier",
    country: "China",
    certifications: ["GMP", "ISO 9001"],
    status: "approved",
    contactPerson: "Li Wei",
    email: "li.wei@medichem.com",
    phone: "+86-13812345678",
  },
  {
    id: "VEN-003",
    name: "ExcipientCorp",
    type: "Excipient Supplier",
    country: "USA",
    certifications: ["GMP", "ISO 9001", "FDA", "USP"],
    status: "approved",
    contactPerson: "John Davis",
    email: "john.davis@excipientcorp.com",
    phone: "+1-555-123-4567",
  },
]

const vendorColumns = [
  {
    accessorKey: "name",
    header: "Vendor Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "certifications",
    header: "Certifications",
    cell: ({ row }) => {
      const certs = row.getValue("certifications") as string[]
      return (
        <div className="flex gap-1 flex-wrap">
          {certs.map((cert, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {cert}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "contactPerson",
    header: "Contact Person",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("users")

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings & Administration</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Database className="mr-2 h-4 w-4" />
            Backup
          </Button>
          <Button size="sm">
            <Settings className="mr-2 h-4 w-4" />
            System Config
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="products">Product Master</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Master</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System Config</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={userColumns}
                  data={userData}
                  searchColumn="name"
                  searchPlaceholder="Search users..."
                />
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Role & Permission Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Warehouse Manager</h4>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="default">Warehouse Full Access</Badge>
                        <Badge variant="default">Inventory Management</Badge>
                        <Badge variant="default">GRN Creation</Badge>
                        <Badge variant="default">User Management</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">QC Manager</h4>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="default">QC Full Access</Badge>
                        <Badge variant="default">Sample Management</Badge>
                        <Badge variant="default">Decision Approval</Badge>
                        <Badge variant="default">Report Generation</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Production Supervisor</h4>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">Production Read</Badge>
                        <Badge variant="secondary">Requisition Create</Badge>
                        <Badge variant="secondary">Dispensing View</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">QC Analyst</h4>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">QC Read</Badge>
                        <Badge variant="secondary">Sample Testing</Badge>
                        <Badge variant="secondary">Result Entry</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add New User</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="userName">Full Name</Label>
                        <Input id="userName" placeholder="Enter full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userEmail">Email</Label>
                        <Input id="userEmail" type="email" placeholder="Enter email address" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userRole">Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="warehouse-manager">Warehouse Manager</SelectItem>
                            <SelectItem value="qc-manager">QC Manager</SelectItem>
                            <SelectItem value="production-supervisor">Production Supervisor</SelectItem>
                            <SelectItem value="qc-analyst">QC Analyst</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userDepartment">Department</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="warehouse">Warehouse</SelectItem>
                            <SelectItem value="quality-control">Quality Control</SelectItem>
                            <SelectItem value="production">Production</SelectItem>
                            <SelectItem value="rd">R&D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                      <Button type="submit">Create User</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Master</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={productColumns}
                data={productMaster}
                searchColumn="name"
                searchPlaceholder="Search products..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Master</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={vendorColumns}
                data={vendorMaster}
                searchColumn="name"
                searchPlaceholder="Search vendors..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notification Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Expiry Alerts</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">30 Days Before Expiry</p>
                          <p className="text-xs text-muted-foreground">Send warning notification</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">10 Days Before Expiry</p>
                          <p className="text-xs text-muted-foreground">Send critical notification</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">5 Days Before Expiry</p>
                          <p className="text-xs text-muted-foreground">Send urgent notification</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Temperature Alerts</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Temperature Deviation</p>
                          <p className="text-xs text-muted-foreground">Alert when temperature goes out of range</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Equipment Failure</p>
                          <p className="text-xs text-muted-foreground">Alert when monitoring equipment fails</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Workflow Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Requisition Approval</p>
                          <p className="text-xs text-muted-foreground">Notify when requisition needs approval</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">QC Decision Required</p>
                          <p className="text-xs text-muted-foreground">Notify when QC decision is pending</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryTemplate">Expiry Alert Template</Label>
                    <Textarea
                      id="expiryTemplate"
                      placeholder="Material {material_name} in batch {batch_number} will expire in {days_left} days."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tempTemplate">Temperature Alert Template</Label>
                    <Textarea
                      id="tempTemplate"
                      placeholder="Temperature deviation detected in {warehouse_name} {zone_name}. Current temperature: {current_temp}°C"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approvalTemplate">Approval Required Template</Label>
                    <Textarea
                      id="approvalTemplate"
                      placeholder="Requisition {requisition_id} requires your approval. Requested by: {requested_by}"
                      rows={3}
                    />
                  </div>

                  <Button className="w-full">Save Templates</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">General Settings</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" defaultValue="MediTrack Pharmaceuticals" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="utc">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc">UTC</SelectItem>
                            <SelectItem value="est">Eastern Time</SelectItem>
                            <SelectItem value="pst">Pacific Time</SelectItem>
                            <SelectItem value="ist">India Standard Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select defaultValue="usd">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="eur">EUR</SelectItem>
                            <SelectItem value="inr">INR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Weight Tolerance Settings</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="weightTolerance">Weight Tolerance (%)</Label>
                        <Input id="weightTolerance" type="number" defaultValue="0.5" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="criticalVariance">Critical Variance (%)</Label>
                        <Input id="criticalVariance" type="number" defaultValue="2.0" step="0.1" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup & Restore</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Automatic Backup</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Enable Automatic Backup</p>
                          <p className="text-xs text-muted-foreground">Daily backup at 2:00 AM</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                        <Input id="backupRetention" type="number" defaultValue="30" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Manual Operations</h4>
                    <div className="space-y-3">
                      <Button className="w-full">
                        <Database className="mr-2 h-4 w-4" />
                        Create Backup Now
                      </Button>
                      <Button variant="outline" className="w-full">
                        Restore from Backup
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Recent Backups</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>2023-06-01 02:00:00</span>
                        <span className="text-secondary">Success</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>2023-05-31 02:00:00</span>
                        <span className="text-secondary">Success</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>2023-05-30 02:00:00</span>
                        <span className="text-secondary">Success</span>
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
