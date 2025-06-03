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
import { Factory, Scale, ArrowLeft, CheckCircle2, Package, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const departmentRequisitions = [
  {
    id: "DEPT-REQ-001",
    department: "Production Unit A",
    material: "Paracetamol API",
    requestedQty: "50 kg",
    approvedQty: "50 kg",
    purpose: "Tablet Production Batch #TB-2023-001",
    requestedBy: "Production Manager",
    status: "approved",
    requestDate: "2023-06-01",
    requiredDate: "2023-06-03",
  },
  {
    id: "DEPT-REQ-002",
    department: "Production Unit B",
    material: "Amoxicillin API",
    requestedQty: "25 kg",
    approvedQty: "25 kg",
    purpose: "Capsule Production Batch #CB-2023-002",
    requestedBy: "Production Supervisor",
    status: "pending",
    requestDate: "2023-06-02",
    requiredDate: "2023-06-04",
  },
  {
    id: "DEPT-REQ-003",
    department: "R&D Department",
    material: "Ibuprofen API",
    requestedQty: "5 kg",
    approvedQty: "5 kg",
    purpose: "Formulation Development",
    requestedBy: "R&D Manager",
    status: "completed",
    requestDate: "2023-05-30",
    requiredDate: "2023-06-01",
  },
]

const deptReqColumns = [
  {
    accessorKey: "id",
    header: "Requisition ID",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "material",
    header: "Material",
  },
  {
    accessorKey: "requestedQty",
    header: "Requested Qty",
  },
  {
    accessorKey: "approvedQty",
    header: "Approved Qty",
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "requiredDate",
    header: "Required Date",
  },
]

const dispensingData = [
  {
    id: "DISP-001",
    requisitionId: "DEPT-REQ-003",
    material: "Ibuprofen API",
    batch: "IBU-2023-01",
    requestedQty: "5 kg",
    dispensedQty: "4.98 kg",
    variance: "-0.02 kg",
    dispensedBy: "Warehouse Operator",
    dispensedTo: "R&D Department",
    dispensingDate: "2023-06-01",
    status: "completed",
    scaleVerified: true,
  },
  {
    id: "DISP-002",
    requisitionId: "DEPT-REQ-001",
    material: "Paracetamol API",
    batch: "PCM-2023-01",
    requestedQty: "50 kg",
    dispensedQty: "50 kg",
    variance: "0 kg",
    dispensedBy: "Warehouse Supervisor",
    dispensedTo: "Production Unit A",
    dispensingDate: "2023-06-03",
    status: "in-progress",
    scaleVerified: false,
  },
]

const dispensingColumns = [
  {
    accessorKey: "id",
    header: "Dispensing ID",
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
    accessorKey: "dispensedTo",
    header: "Dispensed To",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "scaleVerified",
    header: "Scale Verified",
    cell: ({ row }) => {
      const verified = row.getValue("scaleVerified")
      return <Badge variant={verified ? "default" : "destructive"}>{verified ? "Yes" : "No"}</Badge>
    },
  },
]

const returnsData = [
  {
    id: "RET-001",
    dispensingId: "DISP-001",
    material: "Ibuprofen API",
    batch: "IBU-2023-01",
    originalQty: "4.98 kg",
    returnedQty: "0.15 kg",
    reason: "Excess material after production",
    returnedBy: "R&D Department",
    returnDate: "2023-06-01",
    reweighed: true,
    newWeight: "0.148 kg",
    status: "completed",
  },
]

const returnsColumns = [
  {
    accessorKey: "id",
    header: "Return ID",
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
    accessorKey: "returnedQty",
    header: "Returned Qty",
  },
  {
    accessorKey: "newWeight",
    header: "Reweighed",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "returnedBy",
    header: "Returned By",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
]

const dispensingTimelineItems = [
  {
    title: "Requisition Approved",
    description: "Department requisition approved by warehouse manager",
    icon: CheckCircle2,
    date: "2023-06-01 09:00",
    status: "completed",
  },
  {
    title: "Material Located",
    description: "Material located in warehouse inventory",
    icon: Package,
    date: "2023-06-01 09:15",
    status: "completed",
  },
  {
    title: "Dispensing Started",
    description: "Material dispensing process initiated",
    icon: Scale,
    date: "2023-06-01 09:30",
    status: "completed",
  },
  {
    title: "Weight Verification",
    description: "Material weight verified on calibrated scale",
    icon: Scale,
    date: "2023-06-01 09:45",
    status: "current",
  },
  {
    title: "Dispatch to Department",
    description: "Material ready for dispatch to requesting department",
    icon: Users,
    date: "Pending",
    status: "upcoming",
  },
]

export default function ProductionPage() {
  const [activeTab, setActiveTab] = useState("requisition")
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showDispensingDialog, setShowDispensingDialog] = useState(false)
  const [showReturnDialog, setShowReturnDialog] = useState(false)
  const [selectedRequisition, setSelectedRequisition] = useState(null)

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Production Support</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">
            <Factory className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Requisitions</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Materials Dispensed</CardTitle>
            <Scale className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Returns Processed</CardTitle>
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weight Variances</CardTitle>
            <Scale className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requiring investigation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="requisition">Department Requisition</TabsTrigger>
          <TabsTrigger value="dispensing">Dispensing</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="approval">Approval Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="requisition" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Requisitions</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={deptReqColumns}
                  data={departmentRequisitions}
                  searchColumn="material"
                  searchPlaceholder="Search requisitions..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create Department Requisition</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="department">Requesting Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production-a">Production Unit A</SelectItem>
                          <SelectItem value="production-b">Production Unit B</SelectItem>
                          <SelectItem value="rd">R&D Department</SelectItem>
                          <SelectItem value="qc">Quality Control</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="material">Material Required</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paracetamol">Paracetamol API</SelectItem>
                          <SelectItem value="amoxicillin">Amoxicillin API</SelectItem>
                          <SelectItem value="ibuprofen">Ibuprofen API</SelectItem>
                          <SelectItem value="aspirin">Aspirin API</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Required Quantity</Label>
                      <Input id="quantity" placeholder="Enter quantity (e.g., 50 kg)" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requiredDate">Required Date</Label>
                      <Input id="requiredDate" type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose/Production Batch</Label>
                    <Textarea id="purpose" placeholder="Enter production batch number and purpose..." rows={3} />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button">
                      Save Draft
                    </Button>
                    <Button type="submit">Submit Requisition</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dispensing" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dispensing Log</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={dispensingColumns}
                  data={dispensingData}
                  searchColumn="material"
                  searchPlaceholder="Search dispensing records..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dispensing Process</CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline items={dispensingTimelineItems} />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Dispensing Booth Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="requisitionSelect">Select Requisition</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select approved requisition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DEPT-REQ-001">DEPT-REQ-001 - Paracetamol API</SelectItem>
                        <SelectItem value="DEPT-REQ-002">DEPT-REQ-002 - Amoxicillin API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dispensedBy">Dispensed By</Label>
                    <Input id="dispensedBy" placeholder="Enter operator name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scaleReading">Scale Reading (kg)</Label>
                    <Input id="scaleReading" type="number" step="0.001" placeholder="Enter actual weight" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variance">Variance (kg)</Label>
                    <Input id="variance" placeholder="Auto-calculated" disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dispensingNotes">Dispensing Notes</Label>
                  <Textarea id="dispensingNotes" placeholder="Any observations during dispensing..." rows={3} />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      // Save progress
                      console.log("Saving dispensing progress")
                    }}
                  >
                    Save Progress
                  </Button>
                  <Button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowDispensingDialog(true)
                    }}
                  >
                    Complete Dispensing
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Material Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={returnsColumns}
                  data={returnsData}
                  searchColumn="material"
                  searchPlaceholder="Search returns..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Process Material Return</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dispensingRef">Dispensing Reference</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dispensing record" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DISP-001">DISP-001 - Ibuprofen API</SelectItem>
                          <SelectItem value="DISP-002">DISP-002 - Paracetamol API</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="returnedBy">Returned By</Label>
                      <Input id="returnedBy" placeholder="Department/Person returning" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="returnQty">Returned Quantity (kg)</Label>
                      <Input id="returnQty" type="number" step="0.001" placeholder="Enter returned quantity" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reweighedQty">Reweighed Quantity (kg)</Label>
                      <Input id="reweighedQty" type="number" step="0.001" placeholder="Enter reweighed quantity" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="returnReason">Return Reason</Label>
                    <Textarea id="returnReason" placeholder="Explain reason for return..." rows={3} />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        // Save draft
                        console.log("Saving return draft")
                      }}
                    >
                      Save Draft
                    </Button>
                    <Button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowReturnDialog(true)
                      }}
                    >
                      Process Return
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="approval" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">DEPT-REQ-002</h4>
                      <StatusBadge status="pending" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Production Unit B requesting 25 kg Amoxicillin API
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => {
                          setSelectedRequisition("DEPT-REQ-002")
                          setShowApprovalDialog(true)
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Handle rejection
                          console.log("Rejecting DEPT-REQ-002")
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Request more info
                          console.log("Requesting info for DEPT-REQ-002")
                        }}
                      >
                        Request Info
                      </Button>
                    </div>
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
                      <p className="font-medium">Department Head Approval</p>
                      <p className="text-sm text-muted-foreground">Initial approval by requesting department head</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Warehouse Manager Review</p>
                      <p className="text-sm text-muted-foreground">Check inventory availability and approve dispatch</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Material Dispensing</p>
                      <p className="text-sm text-muted-foreground">Physical dispensing and weight verification</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Dispatch Confirmation</p>
                      <p className="text-sm text-muted-foreground">Final confirmation and delivery to department</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Requisition</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium">Requisition: {selectedRequisition}</h4>
              <p className="text-sm text-muted-foreground">Production Unit B - 25 kg Amoxicillin API</p>
            </div>
            <div className="space-y-2">
              <Label>Approved Quantity</Label>
              <Input placeholder="25 kg" />
            </div>
            <div className="space-y-2">
              <Label>Approval Notes</Label>
              <Textarea placeholder="Enter approval notes..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowApprovalDialog(false)}>Approve Requisition</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDispensingDialog} onOpenChange={setShowDispensingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Dispensing</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium">Dispensing Confirmation</h4>
              <p className="text-sm text-muted-foreground">Please verify all details before completing</p>
            </div>
            <div className="space-y-2">
              <Label>Digital Signature</Label>
              <Input placeholder="Enter your digital signature" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDispensingDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowDispensingDialog(false)
                  console.log("Dispensing completed")
                }}
              >
                Complete Dispensing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Return</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium">Return Confirmation</h4>
              <p className="text-sm text-muted-foreground">Please verify all details before completing</p>
            </div>
            <div className="space-y-2">
              <Label>Digital Signature</Label>
              <Input placeholder="Enter your digital signature" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReturnDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowReturnDialog(false)
                  console.log("Return completed")
                }}
              >
                Complete Return
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
