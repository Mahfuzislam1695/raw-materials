"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, TestTube, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react"

const qcSamples = [
  {
    id: "QC-2023-001",
    material: "Paracetamol API",
    batch: "PCM-2023-01",
    sampleId: "S-PCM-001",
    grn: "GRN-2023-001",
    samplingDate: "2023-06-01",
    testType: "Identity, Assay, Impurities",
    status: "testing",
    priority: "High",
    analyst: "Dr. Sarah Wilson",
    expectedCompletion: "2023-06-03",
  },
  {
    id: "QC-2023-002",
    material: "Amoxicillin API",
    batch: "AMX-2023-01",
    sampleId: "S-AMX-001",
    grn: "GRN-2023-002",
    samplingDate: "2023-05-28",
    testType: "Microbiological, Assay",
    status: "completed",
    priority: "Medium",
    analyst: "Dr. Michael Brown",
    expectedCompletion: "2023-05-30",
  },
  {
    id: "QC-2023-003",
    material: "Ibuprofen API",
    batch: "IBU-2023-01",
    sampleId: "S-IBU-001",
    grn: "GRN-2023-003",
    samplingDate: "2023-05-25",
    testType: "Identity, Assay, Dissolution",
    status: "pending",
    priority: "Low",
    analyst: "Dr. Lisa Johnson",
    expectedCompletion: "2023-05-27",
  },
]

const qcSamplesColumns = [
  {
    accessorKey: "sampleId",
    header: "Sample ID",
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
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority")
      const variant = priority === "High" ? "destructive" : priority === "Medium" ? "default" : "secondary"
      return <Badge variant={variant}>{priority}</Badge>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "analyst",
    header: "Analyst",
  },
  {
    accessorKey: "expectedCompletion",
    header: "Expected Completion",
  },
]

const testResults = [
  {
    id: "TR-2023-001",
    sampleId: "S-AMX-001",
    material: "Amoxicillin API",
    batch: "AMX-2023-01",
    testParameter: "Assay",
    specification: "98.0 - 102.0%",
    result: "99.8%",
    status: "passed",
    testDate: "2023-05-30",
    analyst: "Dr. Michael Brown",
  },
  {
    id: "TR-2023-002",
    sampleId: "S-AMX-001",
    material: "Amoxicillin API",
    batch: "AMX-2023-01",
    testParameter: "Microbiological",
    specification: "< 100 CFU/g",
    result: "< 10 CFU/g",
    status: "passed",
    testDate: "2023-05-30",
    analyst: "Dr. Michael Brown",
  },
  {
    id: "TR-2023-003",
    sampleId: "S-IBU-002",
    material: "Ibuprofen API",
    batch: "IBU-2023-02",
    testParameter: "Identity",
    specification: "Complies",
    result: "Does not comply",
    status: "failed",
    testDate: "2023-05-28",
    analyst: "Dr. Lisa Johnson",
  },
]

const testResultsColumns = [
  {
    accessorKey: "sampleId",
    header: "Sample ID",
  },
  {
    accessorKey: "material",
    header: "Material",
  },
  {
    accessorKey: "testParameter",
    header: "Test Parameter",
  },
  {
    accessorKey: "specification",
    header: "Specification",
  },
  {
    accessorKey: "result",
    header: "Result",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <Badge variant={status === "passed" ? "default" : "destructive"}>
          {status === "passed" ? "Passed" : "Failed"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "testDate",
    header: "Test Date",
  },
  {
    accessorKey: "analyst",
    header: "Analyst",
  },
]

const qcDecisions = [
  {
    id: "QCD-2023-001",
    material: "Amoxicillin API",
    batch: "AMX-2023-01",
    sampleId: "S-AMX-001",
    decision: "approved",
    decisionDate: "2023-05-30",
    decidedBy: "QC Manager",
    remarks: "All tests passed. Material approved for use.",
  },
  {
    id: "QCD-2023-002",
    material: "Ibuprofen API",
    batch: "IBU-2023-02",
    sampleId: "S-IBU-002",
    decision: "rejected",
    decisionDate: "2023-05-28",
    decidedBy: "QC Manager",
    remarks: "Identity test failed. Material rejected.",
  },
]

const qcDecisionsColumns = [
  {
    accessorKey: "material",
    header: "Material",
  },
  {
    accessorKey: "batch",
    header: "Batch",
  },
  {
    accessorKey: "sampleId",
    header: "Sample ID",
  },
  {
    accessorKey: "decision",
    header: "Decision",
    cell: ({ row }) => <StatusBadge status={row.getValue("decision")} />,
  },
  {
    accessorKey: "decisionDate",
    header: "Decision Date",
  },
  {
    accessorKey: "decidedBy",
    header: "Decided By",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
]

export default function QualityPage() {
  const [activeTab, setActiveTab] = useState("samples")

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quality Control</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Generate Report
          </Button>
          <Button size="sm">
            <TestTube className="mr-2 h-4 w-4" />
            New Sample
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">3 high priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <ShieldCheck className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <Progress value={94.2} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected Batches</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="samples">Sample Management</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="decisions">QC Decisions</TabsTrigger>
          <TabsTrigger value="rejection">Rejection Management</TabsTrigger>
        </TabsList>

        <TabsContent value="samples" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>QC Samples</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={qcSamplesColumns}
                data={qcSamples}
                searchColumn="material"
                searchPlaceholder="Search samples..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={testResultsColumns}
                data={testResults}
                searchColumn="material"
                searchPlaceholder="Search test results..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>QC Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={qcDecisionsColumns}
                data={qcDecisions}
                searchColumn="material"
                searchPlaceholder="Search decisions..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejection" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Rejected Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-destructive/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Ibuprofen API</h4>
                        <p className="text-sm text-muted-foreground">Batch: IBU-2023-02</p>
                        <p className="text-sm text-destructive">Reason: Identity test failed</p>
                      </div>
                      <StatusBadge status="rejected" />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline">
                        Return to Vendor
                      </Button>
                      <Button size="sm" variant="outline">
                        Destroy
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rejection Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Identity Test Failure</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Assay Out of Specification</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <Progress value={30} />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Microbiological Failure</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <Progress value={15} />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Other</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <Progress value={10} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}
