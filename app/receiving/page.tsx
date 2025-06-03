"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
  Scale,
  ClipboardCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Warehouse,
} from "lucide-react"

const qualityParameters = [
  { id: 1, description: "Cleanliness of the material containing vehicle" },
  { id: 2, description: "Free from any pesticide/fly materials" },
  { id: 3, description: "Receiving shutter is closed during de-dusting" },
  { id: 4, description: "No spillage of material during transportation" },
  { id: 5, description: "Kill pest is turn on" },
  { id: 6, description: "Air curtain is working properly" },
  { id: 7, description: "Door between quarantine area and receiving area is closed" },
  { id: 8, description: "Clean and dedicated pallets are used" },
  { id: 9, description: "Cleanliness of the received Containers/Boxes" },
  { id: 10, description: "Correct labeling & shipping marks identified" },
  { id: 11, description: "All containers/Boxes/Rolls found lock and sealed" },
  { id: 12, description: "The correct items were shipped" },
  { id: 13, description: "No items are missing" },
  { id: 14, description: "Quantity of item received matches quantity indicated on invoice" },
  { id: 15, description: "Manufacturer's expiry date is acceptable" },
  { id: 16, description: "Cold packs are cold (refrigerated items) or frozen or partially thawed (frozen items)" },
  { id: 17, description: "Items are not crushed, broken or leaking" },
  { id: 18, description: "Any broken or leaking item has been handled safely and disposed of properly" },
  { id: 19, description: "Any manufacturer's alerts or changes to the package insert are noted" },
  { id: 20, description: "A copy of the invoice and order request is retained in the respective department" },
  { id: 21, description: "Materials received from approved vendor" },
  { id: 22, description: "Condition of the containers/Boxes/Rolls (Damage/Taped/Torn)" },
  { id: 23, description: "Quantity" },
]

const quarantineWarehouses = [
  {
    id: "WH-A",
    name: "Warehouse A - General Storage",
    type: "Both",
    zones: [
      { id: "WH-A-Z1", name: "Zone 1", type: "Quarantine", rows: 5, racksPerRow: 4, levelsPerRack: 4 },
      { id: "WH-A-Z2", name: "Zone 2", type: "Stock", rows: 5, racksPerRow: 4, levelsPerRack: 4 },
      { id: "WH-A-Z3", name: "Zone 3", type: "Quarantine", rows: 4, racksPerRow: 3, levelsPerRack: 4 },
    ],
  },
  {
    id: "WH-C",
    name: "Warehouse C - Quarantine Only",
    type: "Quarantine",
    zones: [
      { id: "WH-C-Z1", name: "Zone 1", type: "Quarantine", rows: 3, racksPerRow: 5, levelsPerRack: 3 },
      { id: "WH-C-Z2", name: "Zone 2", type: "Quarantine", rows: 3, racksPerRow: 5, levelsPerRack: 3 },
    ],
  },
]

type ProcessStep =
  | "shipment-selection"
  | "document-verification"
  | "quality-verification"
  | "material-cleaning"
  | "weight-verification"
  | "quarantine-assignment"
  | "grn-generation"
  | "non-compliance"

export default function ReceivingProcessPage() {
  const [currentStep, setCurrentStep] = useState<ProcessStep>("shipment-selection")
  const [selectedShipment, setSelectedShipment] = useState("")
  const [documentVerified, setDocumentVerified] = useState(false)
  const [qualityChecks, setQualityChecks] = useState<Record<number, boolean | null>>({})
  const [qualityReasons, setQualityReasons] = useState<Record<number, string>>({})
  const [cleaningApproved, setCleaningApproved] = useState<boolean | null>(null)
  const [weightVerified, setWeightVerified] = useState<boolean | null>(null)
  const [nonComplianceReason, setNonComplianceReason] = useState("")
  const [quarantineLocation, setQuarantineLocation] = useState({
    warehouse: "",
    zone: "",
    row: "",
    rack: "",
    level: "",
  })
  const [receivingData, setReceivingData] = useState({
    receivedBy: "",
    receivedDate: "",
    receivedQty: "",
    expectedWeight: "",
    actualWeight: "",
    cleaningNotes: "",
    weightNotes: "",
  })

  const getStepProgress = () => {
    const steps = [
      "shipment-selection",
      "document-verification",
      "quality-verification",
      "material-cleaning",
      "weight-verification",
      "quarantine-assignment",
      "grn-generation",
    ]
    const currentIndex = steps.indexOf(currentStep)
    return ((currentIndex + 1) / steps.length) * 100
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case "shipment-selection":
        return "Select Shipment"
      case "document-verification":
        return "Document Verification"
      case "quality-verification":
        return "Quality Parameters Verification"
      case "material-cleaning":
        return "Material Cleaning Process"
      case "weight-verification":
        return "Weight Verification"
      case "quarantine-assignment":
        return "Quarantine Zone Assignment"
      case "grn-generation":
        return "GRN Generation"
      case "non-compliance":
        return "Non-Compliance Processing"
      default:
        return "Receiving Process"
    }
  }

  const handleQualityCheck = (parameterId: number, value: boolean | null) => {
    setQualityChecks((prev) => ({ ...prev, [parameterId]: value }))
    // Clear reason if setting to true
    if (value === true) {
      setQualityReasons((prev) => ({ ...prev, [parameterId]: "" }))
    }
  }

  const handleQualityReason = (parameterId: number, reason: string) => {
    setQualityReasons((prev) => ({ ...prev, [parameterId]: reason }))
  }

  const selectAllParameters = (value: boolean) => {
    const newChecks: Record<number, boolean> = {}
    qualityParameters.forEach((param) => {
      newChecks[param.id] = value
    })
    setQualityChecks(newChecks)
    if (value) {
      setQualityReasons({}) // Clear all reasons if selecting all as true
    }
  }

  const isQualityVerificationComplete = () => {
    return qualityParameters.every((param) => {
      const check = qualityChecks[param.id]
      if (check === null || check === undefined) return false
      if (check === false) {
        return qualityReasons[param.id] && qualityReasons[param.id].trim() !== ""
      }
      return true
    })
  }

  const getQualityVerificationSummary = () => {
    const trueCount = qualityParameters.filter((param) => qualityChecks[param.id] === true).length
    const falseCount = qualityParameters.filter((param) => qualityChecks[param.id] === false).length
    const falseWithReasons = qualityParameters.filter(
      (param) => qualityChecks[param.id] === false && qualityReasons[param.id]?.trim(),
    ).length

    return { trueCount, falseCount, falseWithReasons, total: qualityParameters.length }
  }

  const handleQualityApproval = () => {
    const summary = getQualityVerificationSummary()
    if (summary.trueCount === 23) {
      // All parameters are true - proceed to cleaning
      setCurrentStep("material-cleaning")
    } else if (summary.falseWithReasons === summary.falseCount) {
      // All false parameters have reasons - user can choose
      // For now, proceed to cleaning (user can still choose non-compliance later)
      setCurrentStep("material-cleaning")
    } else {
      // Some false parameters don't have reasons
      alert("Please provide reasons for all parameters marked as false before proceeding.")
    }
  }

  const handleCleaningDecision = (approved: boolean) => {
    setCleaningApproved(approved)
    if (approved) {
      setCurrentStep("weight-verification")
    } else {
      setCurrentStep("non-compliance")
      setNonComplianceReason("Material cleaning not approved")
    }
  }

  const handleWeightDecision = (approved: boolean) => {
    setWeightVerified(approved)
    if (approved) {
      setCurrentStep("quarantine-assignment")
    } else {
      setCurrentStep("non-compliance")
      setNonComplianceReason("Weight verification failed")
    }
  }

  const getAvailableZones = () => {
    const warehouse = quarantineWarehouses.find((w) => w.id === quarantineLocation.warehouse)
    return warehouse ? warehouse.zones.filter((z) => z.type === "Quarantine" || warehouse.type === "Both") : []
  }

  const getAvailableRows = () => {
    const zones = getAvailableZones()
    const zone = zones.find((z) => z.id === quarantineLocation.zone)
    return zone ? Array.from({ length: zone.rows }, (_, i) => i + 1) : []
  }

  const getAvailableRacks = () => {
    const zones = getAvailableZones()
    const zone = zones.find((z) => z.id === quarantineLocation.zone)
    return zone ? Array.from({ length: zone.racksPerRow }, (_, i) => i + 1) : []
  }

  const getAvailableLevels = () => {
    const zones = getAvailableZones()
    const zone = zones.find((z) => z.id === quarantineLocation.zone)
    return zone ? Array.from({ length: zone.levelsPerRack }, (_, i) => i + 1) : []
  }

  const generateGRN = () => {
    const grnNumber = `GRN-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
    const locationString = `${quarantineLocation.warehouse}-${quarantineLocation.zone}-R${quarantineLocation.row}-RK${quarantineLocation.rack}-L${quarantineLocation.level}`

    alert(
      `GRN Generated Successfully!\n\nGRN Number: ${grnNumber}\nQuarantine Location: ${locationString}\nStatus: Material moved to Quarantine\n\nInventory updated with quarantine status.`,
    )

    // Reset process
    setCurrentStep("shipment-selection")
    setQualityChecks({})
    setQualityReasons({})
    setCleaningApproved(null)
    setWeightVerified(null)
    setSelectedShipment("")
    setDocumentVerified(false)
    setQuarantineLocation({ warehouse: "", zone: "", row: "", rack: "", level: "" })
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Material Receiving Process</h1>
            <p className="text-muted-foreground">Step-by-step material receiving with quality verification</p>
          </div>
          <Badge variant="outline" className="text-sm">
            Step{" "}
            {[
              "shipment-selection",
              "document-verification",
              "quality-verification",
              "material-cleaning",
              "weight-verification",
              "quarantine-assignment",
              "grn-generation",
            ].indexOf(currentStep) + 1}{" "}
            of 7
          </Badge>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Process Progress</span>
                <span>{Math.round(getStepProgress())}% Complete</span>
              </div>
              <Progress value={getStepProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Current Step Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === "shipment-selection" && <Truck className="h-5 w-5" />}
              {currentStep === "document-verification" && <FileText className="h-5 w-5" />}
              {currentStep === "quality-verification" && <ClipboardCheck className="h-5 w-5" />}
              {currentStep === "material-cleaning" && <Package className="h-5 w-5" />}
              {currentStep === "weight-verification" && <Scale className="h-5 w-5" />}
              {currentStep === "quarantine-assignment" && <MapPin className="h-5 w-5" />}
              {currentStep === "grn-generation" && <CheckCircle2 className="h-5 w-5" />}
              {currentStep === "non-compliance" && <AlertTriangle className="h-5 w-5" />}
              {getStepTitle()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Quality Parameters Verification */}
            {currentStep === "quality-verification" && (
              <div className="space-y-4">
                <Alert>
                  <ClipboardCheck className="h-4 w-4" />
                  <AlertDescription>
                    Verify all 23 quality parameters. Parameters marked as false require a reason. You can proceed even
                    with some false parameters if reasons are provided.
                  </AlertDescription>
                </Alert>

                {/* Bulk Selection */}
                <div className="flex gap-2 p-3 bg-muted rounded-lg">
                  <Button size="sm" onClick={() => selectAllParameters(true)} variant="outline">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Select All True
                  </Button>
                  <Button size="sm" onClick={() => selectAllParameters(false)} variant="outline">
                    <XCircle className="h-4 w-4 mr-2" />
                    Select All False
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setQualityChecks({})
                      setQualityReasons({})
                    }}
                    variant="outline"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-3 border-b">
                    <div className="grid grid-cols-12 gap-4 font-medium text-sm">
                      <div className="col-span-1">SI</div>
                      <div className="col-span-1">Check</div>
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Reason (if False)</div>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {qualityParameters.map((param) => (
                      <div key={param.id} className="grid grid-cols-12 gap-4 p-3 border-b items-start text-sm">
                        <div className="col-span-1 pt-2">{param.id}</div>
                        <div className="col-span-1 pt-2">
                          <Checkbox
                            checked={qualityChecks[param.id] !== undefined && qualityChecks[param.id] !== null}
                            readOnly
                          />
                        </div>
                        <div className="col-span-6 pt-2">{param.description}</div>
                        <div className="col-span-2">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant={qualityChecks[param.id] === true ? "default" : "outline"}
                              onClick={() => handleQualityCheck(param.id, true)}
                              className="h-7 px-2"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant={qualityChecks[param.id] === false ? "destructive" : "outline"}
                              onClick={() => handleQualityCheck(param.id, false)}
                              className="h-7 px-2"
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="col-span-2">
                          {qualityChecks[param.id] === false && (
                            <Input
                              placeholder="Enter reason..."
                              value={qualityReasons[param.id] || ""}
                              onChange={(e) => handleQualityReason(param.id, e.target.value)}
                              className="h-7 text-xs"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Verification Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Parameters Verified:</span>
                        <span>
                          {Object.keys(qualityChecks).length} of {qualityParameters.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>True Parameters:</span>
                        <span className="text-green-600">{getQualityVerificationSummary().trueCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>False Parameters:</span>
                        <span className="text-red-600">{getQualityVerificationSummary().falseCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>False with Reasons:</span>
                        <span className="text-orange-600">{getQualityVerificationSummary().falseWithReasons}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Decision Options</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>All 23 True: Automatic approval</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span>Some False with reasons: Can proceed or mark non-compliant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>Many False: Consider non-compliance</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep("document-verification")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setCurrentStep("non-compliance")
                      setNonComplianceReason(
                        "Quality parameters verification - marked as non-compliant by user decision",
                      )
                    }}
                    className="flex-1"
                  >
                    Mark Non-Compliant
                  </Button>
                  <Button
                    onClick={handleQualityApproval}
                    disabled={!isQualityVerificationComplete()}
                    className="flex-1"
                  >
                    Proceed to Cleaning <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Quarantine Assignment */}
            {currentStep === "quarantine-assignment" && (
              <div className="space-y-4">
                <Alert>
                  <MapPin className="h-4 w-4" />
                  <AlertDescription>
                    Assign the material to a specific quarantine location. Select warehouse, zone, row, rack, and level.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <div className="space-y-2">
                    <Label htmlFor="warehouse">Warehouse</Label>
                    <Select
                      value={quarantineLocation.warehouse}
                      onValueChange={(value) =>
                        setQuarantineLocation({ warehouse: value, zone: "", row: "", rack: "", level: "" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        {quarantineWarehouses.map((warehouse) => (
                          <SelectItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zone">Zone</Label>
                    <Select
                      value={quarantineLocation.zone}
                      onValueChange={(value) =>
                        setQuarantineLocation((prev) => ({ ...prev, zone: value, row: "", rack: "", level: "" }))
                      }
                      disabled={!quarantineLocation.warehouse}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableZones().map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name} ({zone.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="row">Row</Label>
                    <Select
                      value={quarantineLocation.row}
                      onValueChange={(value) =>
                        setQuarantineLocation((prev) => ({ ...prev, row: value, rack: "", level: "" }))
                      }
                      disabled={!quarantineLocation.zone}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select row" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableRows().map((row) => (
                          <SelectItem key={row} value={row.toString()}>
                            Row {row}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rack">Rack</Label>
                    <Select
                      value={quarantineLocation.rack}
                      onValueChange={(value) => setQuarantineLocation((prev) => ({ ...prev, rack: value, level: "" }))}
                      disabled={!quarantineLocation.row}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rack" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableRacks().map((rack) => (
                          <SelectItem key={rack} value={rack.toString()}>
                            Rack {rack}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={quarantineLocation.level}
                      onValueChange={(value) => setQuarantineLocation((prev) => ({ ...prev, level: value }))}
                      disabled={!quarantineLocation.rack}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableLevels().map((level) => (
                          <SelectItem key={level} value={level.toString()}>
                            Level {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {quarantineLocation.warehouse && quarantineLocation.zone && (
                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Warehouse className="h-5 w-5" />
                        Selected Quarantine Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Full Location:</span>
                          <span className="font-medium">
                            {quarantineLocation.warehouse}-{quarantineLocation.zone}
                            {quarantineLocation.row && `-R${quarantineLocation.row}`}
                            {quarantineLocation.rack && `-RK${quarantineLocation.rack}`}
                            {quarantineLocation.level && `-L${quarantineLocation.level}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Warehouse:</span>
                          <span>{quarantineWarehouses.find((w) => w.id === quarantineLocation.warehouse)?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Zone Type:</span>
                          <span>
                            {getAvailableZones().find((z) => z.id === quarantineLocation.zone)?.type || "Quarantine"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep("weight-verification")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("grn-generation")}
                    disabled={
                      !quarantineLocation.warehouse ||
                      !quarantineLocation.zone ||
                      !quarantineLocation.row ||
                      !quarantineLocation.rack ||
                      !quarantineLocation.level
                    }
                    className="flex-1"
                  >
                    Confirm Location & Generate GRN <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Other steps remain the same... */}
            {/* I'll include the other steps here but they remain unchanged from the previous version */}

            {/* Shipment Selection */}
            {currentStep === "shipment-selection" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shipment">Select Shipment to Process</Label>
                  <Select value={selectedShipment} onValueChange={setSelectedShipment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a shipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SH-2023-06-001">SH-2023-06-001 - Paracetamol API (PharmaCorp Inc.)</SelectItem>
                      <SelectItem value="SH-2023-05-028">SH-2023-05-028 - Amoxicillin API (MediChem Ltd.)</SelectItem>
                      <SelectItem value="SH-2023-05-025">SH-2023-05-025 - Ibuprofen API (BioSynth Labs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="receivedBy">Received By</Label>
                    <Input
                      id="receivedBy"
                      value={receivingData.receivedBy}
                      onChange={(e) => setReceivingData((prev) => ({ ...prev, receivedBy: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receivedDate">Received Date & Time</Label>
                    <Input
                      id="receivedDate"
                      type="datetime-local"
                      value={receivingData.receivedDate}
                      onChange={(e) => setReceivingData((prev) => ({ ...prev, receivedDate: e.target.value }))}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => setCurrentStep("document-verification")}
                  disabled={!selectedShipment || !receivingData.receivedBy || !receivingData.receivedDate}
                  className="w-full"
                >
                  Start Document Verification <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Document Verification */}
            {currentStep === "document-verification" && (
              <div className="space-y-4">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    Verify all required documents are present and accurate before proceeding.
                  </AlertDescription>
                </Alert>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium">Required Documents Checklist:</h4>
                    <div className="space-y-2">
                      {[
                        "Invoice",
                        "Packing List",
                        "Certificate of Analysis",
                        "Material Safety Data Sheet",
                        "Transport Documentation",
                      ].map((doc) => (
                        <div key={doc} className="flex items-center space-x-2">
                          <Checkbox id={doc} />
                          <Label htmlFor={doc} className="text-sm">
                            {doc}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Verification Notes:</h4>
                    <Textarea placeholder="Document verification notes..." rows={4} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep("shipment-selection")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={() => setCurrentStep("quality-verification")} className="flex-1">
                    Documents Verified - Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Material Cleaning */}
            {currentStep === "material-cleaning" && (
              <div className="space-y-4">
                <Alert>
                  <Package className="h-4 w-4" />
                  <AlertDescription>
                    Perform material cleaning process and verify completion before proceeding.
                  </AlertDescription>
                </Alert>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cleaningNotes">Cleaning Process Notes</Label>
                    <Textarea
                      id="cleaningNotes"
                      value={receivingData.cleaningNotes}
                      onChange={(e) => setReceivingData((prev) => ({ ...prev, cleaningNotes: e.target.value }))}
                      placeholder="Document cleaning process, observations, and any issues..."
                      rows={4}
                    />
                  </div>
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-medium mb-2">Cleaning Process Checklist:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• External packaging cleaned and sanitized</li>
                      <li>• All surfaces wiped with approved cleaning agents</li>
                      <li>• Packaging integrity maintained</li>
                      <li>• No contamination detected</li>
                      <li>• Cleaning documented and verified</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep("quality-verification")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button variant="destructive" onClick={() => handleCleaningDecision(false)} className="flex-1">
                    Cleaning Failed - Non-Compliant
                  </Button>
                  <Button onClick={() => handleCleaningDecision(true)} className="flex-1">
                    Cleaning Approved - Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Weight Verification */}
            {currentStep === "weight-verification" && (
              <div className="space-y-4">
                <Alert>
                  <Scale className="h-4 w-4" />
                  <AlertDescription>
                    Verify the actual weight matches the expected weight within acceptable tolerance.
                  </AlertDescription>
                </Alert>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="expectedWeight">Expected Weight (kg)</Label>
                    <Input
                      id="expectedWeight"
                      value={receivingData.expectedWeight}
                      onChange={(e) => setReceivingData((prev) => ({ ...prev, expectedWeight: e.target.value }))}
                      placeholder="250.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actualWeight">Actual Weight (kg)</Label>
                    <Input
                      id="actualWeight"
                      value={receivingData.actualWeight}
                      onChange={(e) => setReceivingData((prev) => ({ ...prev, actualWeight: e.target.value }))}
                      placeholder="248.50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variance">Variance</Label>
                    <Input
                      id="variance"
                      value={
                        receivingData.expectedWeight && receivingData.actualWeight
                          ? `${(Number.parseFloat(receivingData.actualWeight) - Number.parseFloat(receivingData.expectedWeight)).toFixed(2)} kg`
                          : ""
                      }
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weightNotes">Weight Verification Notes</Label>
                  <Textarea
                    id="weightNotes"
                    value={receivingData.weightNotes}
                    onChange={(e) => setReceivingData((prev) => ({ ...prev, weightNotes: e.target.value }))}
                    placeholder="Weight verification notes and observations..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep("material-cleaning")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button variant="destructive" onClick={() => handleWeightDecision(false)} className="flex-1">
                    Weight Variance Unacceptable - Non-Compliant
                  </Button>
                  <Button
                    onClick={() => handleWeightDecision(true)}
                    className="flex-1"
                    disabled={!receivingData.expectedWeight || !receivingData.actualWeight}
                  >
                    Weight Verified - Assign Quarantine <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* GRN Generation */}
            {currentStep === "grn-generation" && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    All verifications completed successfully. Ready to generate GRN and move material to assigned
                    quarantine location.
                  </AlertDescription>
                </Alert>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium">Receiving Summary:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Shipment ID:</span>
                        <span className="font-medium">{selectedShipment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Received By:</span>
                        <span className="font-medium">{receivingData.receivedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Received Date:</span>
                        <span className="font-medium">{receivingData.receivedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weight Variance:</span>
                        <span className="font-medium">
                          {receivingData.expectedWeight && receivingData.actualWeight
                            ? `${(Number.parseFloat(receivingData.actualWeight) - Number.parseFloat(receivingData.expectedWeight)).toFixed(2)} kg`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quarantine Location:</span>
                        <span className="font-medium">
                          {quarantineLocation.warehouse}-{quarantineLocation.zone}-R{quarantineLocation.row}-RK
                          {quarantineLocation.rack}-L{quarantineLocation.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Verification Status:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Document Verification: Passed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Quality Parameters: {getQualityVerificationSummary().trueCount}/23 Approved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Material Cleaning: Approved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Weight Verification: Approved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Quarantine Location: Assigned</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep("quarantine-assignment")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={generateGRN} className="flex-1">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Generate GRN & Move to Quarantine
                  </Button>
                </div>
              </div>
            )}

            {/* Non-Compliance */}
            {currentStep === "non-compliance" && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Material has been marked as non-compliant and requires investigation.
                  </AlertDescription>
                </Alert>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nonComplianceReason">Non-Compliance Reason</Label>
                    <Textarea
                      id="nonComplianceReason"
                      value={nonComplianceReason}
                      onChange={(e) => setNonComplianceReason(e.target.value)}
                      placeholder="Detailed reason for non-compliance..."
                      rows={4}
                    />
                  </div>
                  <div className="p-4 border rounded-lg bg-red-50">
                    <h4 className="font-medium mb-2 text-red-800">Next Steps:</h4>
                    <ul className="text-sm space-y-1 text-red-700">
                      <li>• Material will be quarantined separately</li>
                      <li>• Quality team will be notified</li>
                      <li>• Investigation report will be generated</li>
                      <li>• Supplier will be informed of non-compliance</li>
                      <li>• Material may be rejected or require rework</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Reset to appropriate step based on where failure occurred
                      if (nonComplianceReason.includes("Quality parameters")) {
                        setCurrentStep("quality-verification")
                      } else if (nonComplianceReason.includes("cleaning")) {
                        setCurrentStep("material-cleaning")
                      } else if (nonComplianceReason.includes("Weight")) {
                        setCurrentStep("weight-verification")
                      }
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Fix Issues
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      alert("Non-compliance recorded. Material moved to non-compliant quarantine area.")
                      setCurrentStep("shipment-selection")
                      setQualityChecks({})
                      setQualityReasons({})
                      setCleaningApproved(null)
                      setWeightVerified(null)
                      setSelectedShipment("")
                      setDocumentVerified(false)
                      setNonComplianceReason("")
                    }}
                    className="flex-1"
                  >
                    Confirm Non-Compliance & Quarantine
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
