"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, Warehouse, MapPin, Thermometer, Package } from "lucide-react"

const setupSteps = [
  { id: 1, title: "Basic Information", description: "Warehouse name and type" },
  { id: 2, title: "Physical Structure", description: "Floors, zones, and layout" },
  { id: 3, title: "Rack Configuration", description: "Rows, racks, and levels" },
  { id: 4, title: "Environmental Settings", description: "Temperature and humidity" },
  { id: 5, title: "Allocation Rules", description: "Material assignment rules" },
  { id: 6, title: "Review & Create", description: "Final review and creation" },
]

export default function WarehouseSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic Information
    warehouseName: "",
    warehouseCode: "",
    warehouseType: "",
    building: "",
    description: "",

    // Physical Structure
    floors: 1,
    zonesPerFloor: 1,

    // Rack Configuration
    rowsPerZone: 1,
    racksPerRow: 1,
    levelsPerRack: 1,

    // Environmental Settings
    tempMin: "",
    tempMax: "",
    humidityMin: "",
    humidityMax: "",
    specialRequirements: [],

    // Allocation Rules
    autoAllocation: false,
    materialTypes: [],
    priorityRules: "",
  })

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < setupSteps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateTotalRacks = () => {
    return formData.floors * formData.zonesPerFloor * formData.rowsPerZone * formData.racksPerRow
  }

  const calculateTotalLevels = () => {
    return calculateTotalRacks() * formData.levelsPerRack
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="warehouseName">Warehouse Name *</Label>
                <Input
                  id="warehouseName"
                  placeholder="e.g., Warehouse A - General Storage"
                  value={formData.warehouseName}
                  onChange={(e) => updateFormData("warehouseName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouseCode">Warehouse Code *</Label>
                <Input
                  id="warehouseCode"
                  placeholder="e.g., WH-A"
                  value={formData.warehouseCode}
                  onChange={(e) => updateFormData("warehouseCode", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouseType">Warehouse Type *</Label>
                <Select
                  value={formData.warehouseType}
                  onValueChange={(value) => updateFormData("warehouseType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quarantine">Quarantine Only</SelectItem>
                    <SelectItem value="stock">Stock Only</SelectItem>
                    <SelectItem value="both">Both Quarantine & Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="building">Building *</Label>
                <Select value={formData.building} onValueChange={(value) => updateFormData("building", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="building1">Building 1</SelectItem>
                    <SelectItem value="building2">Building 2</SelectItem>
                    <SelectItem value="building3">Building 3</SelectItem>
                    <SelectItem value="building4">Building 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the warehouse purpose and special characteristics..."
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="floors">Number of Floors *</Label>
                <Input
                  id="floors"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.floors}
                  onChange={(e) => updateFormData("floors", Number.parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">Typically 1-3 floors for pharmaceutical warehouses</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zonesPerFloor">Zones per Floor *</Label>
                <Input
                  id="zonesPerFloor"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.zonesPerFloor}
                  onChange={(e) => updateFormData("zonesPerFloor", Number.parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">Zones help organize materials by type or temperature</p>
              </div>
            </div>

            <Card className="bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Structure Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-5 w-5 text-primary" />
                    <span className="font-medium">{formData.warehouseName || "New Warehouse"}</span>
                  </div>
                  <div className="ml-6 space-y-2">
                    {Array.from({ length: formData.floors }, (_, floorIndex) => (
                      <div key={floorIndex} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Floor {floorIndex + 1}</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          {Array.from({ length: formData.zonesPerFloor }, (_, zoneIndex) => (
                            <div key={zoneIndex} className="flex items-center gap-2">
                              <Package className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">Zone {zoneIndex + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      Total: {formData.floors} floors × {formData.zonesPerFloor} zones ={" "}
                      {formData.floors * formData.zonesPerFloor} zones
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="rowsPerZone">Rows per Zone *</Label>
                <Input
                  id="rowsPerZone"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.rowsPerZone}
                  onChange={(e) => updateFormData("rowsPerZone", Number.parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">Parallel storage rows in each zone</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="racksPerRow">Racks per Row *</Label>
                <Input
                  id="racksPerRow"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.racksPerRow}
                  onChange={(e) => updateFormData("racksPerRow", Number.parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">Individual storage racks in each row</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="levelsPerRack">Levels per Rack *</Label>
                <Input
                  id="levelsPerRack"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.levelsPerRack}
                  onChange={(e) => updateFormData("levelsPerRack", Number.parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">Vertical storage levels in each rack</p>
              </div>
            </div>

            <Card className="bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Rack Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium">Hierarchy Structure</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Warehouse</span>
                        <span>1</span>
                      </div>
                      <div className="flex justify-between">
                        <span>└── Floors</span>
                        <span>{formData.floors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;└── Zones</span>
                        <span>{formData.floors * formData.zonesPerFloor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Rows</span>
                        <span>{formData.floors * formData.zonesPerFloor * formData.rowsPerZone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Racks</span>
                        <span>{calculateTotalRacks()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──
                          Levels
                        </span>
                        <span>{calculateTotalLevels()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Storage Capacity</h4>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-primary">{calculateTotalRacks()}</div>
                        <div className="text-sm text-muted-foreground">Total Racks</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-secondary">{calculateTotalLevels()}</div>
                        <div className="text-sm text-muted-foreground">Total Storage Levels</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tempMin">Minimum Temperature (°C) *</Label>
                <Input
                  id="tempMin"
                  type="number"
                  placeholder="e.g., 2"
                  value={formData.tempMin}
                  onChange={(e) => updateFormData("tempMin", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempMax">Maximum Temperature (°C) *</Label>
                <Input
                  id="tempMax"
                  type="number"
                  placeholder="e.g., 8"
                  value={formData.tempMax}
                  onChange={(e) => updateFormData("tempMax", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="humidityMin">Minimum Humidity (%) *</Label>
                <Input
                  id="humidityMin"
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.humidityMin}
                  onChange={(e) => updateFormData("humidityMin", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="humidityMax">Maximum Humidity (%) *</Label>
                <Input
                  id="humidityMax"
                  type="number"
                  placeholder="e.g., 60"
                  value={formData.humidityMax}
                  onChange={(e) => updateFormData("humidityMax", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Special Requirements</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { id: "light-protection", label: "Light Protection Required" },
                  { id: "humidity-control", label: "Strict Humidity Control" },
                  { id: "air-circulation", label: "Controlled Air Circulation" },
                  { id: "contamination-control", label: "Contamination Control" },
                  { id: "segregation", label: "Material Segregation" },
                  { id: "monitoring", label: "Continuous Monitoring" },
                ].map((requirement) => (
                  <div key={requirement.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={requirement.id}
                      checked={formData.specialRequirements.includes(requirement.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData("specialRequirements", [...formData.specialRequirements, requirement.id])
                        } else {
                          updateFormData(
                            "specialRequirements",
                            formData.specialRequirements.filter((req) => req !== requirement.id),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={requirement.id} className="text-sm">
                      {requirement.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Environmental Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Temperature Range</h4>
                    <p className="text-lg">
                      {formData.tempMin || "___"}°C to {formData.tempMax || "___"}°C
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Humidity Range</h4>
                    <p className="text-lg">
                      {formData.humidityMin || "___"}% to {formData.humidityMax || "___"}%
                    </p>
                  </div>
                </div>
                {formData.specialRequirements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Special Requirements</h4>
                    <div className="flex gap-2 flex-wrap">
                      {formData.specialRequirements.map((req) => (
                        <Badge key={req} variant="secondary">
                          {req.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoAllocation"
                  checked={formData.autoAllocation}
                  onCheckedChange={(checked) => updateFormData("autoAllocation", checked)}
                />
                <Label htmlFor="autoAllocation" className="text-sm font-medium">
                  Enable Automatic Material Allocation
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, materials will be automatically assigned to appropriate zones based on their
                characteristics.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Material Types to Store</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { id: "api", label: "Active Pharmaceutical Ingredients (APIs)" },
                  { id: "excipients", label: "Excipients" },
                  { id: "intermediates", label: "Intermediates" },
                  { id: "raw-materials", label: "Raw Materials" },
                  { id: "packaging", label: "Packaging Materials" },
                  { id: "reference-standards", label: "Reference Standards" },
                ].map((material) => (
                  <div key={material.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={material.id}
                      checked={formData.materialTypes.includes(material.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData("materialTypes", [...formData.materialTypes, material.id])
                        } else {
                          updateFormData(
                            "materialTypes",
                            formData.materialTypes.filter((type) => type !== material.id),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={material.id} className="text-sm">
                      {material.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priorityRules">Priority Allocation Rules</Label>
              <Textarea
                id="priorityRules"
                placeholder="Define priority rules for material allocation (e.g., Cold storage materials get priority in temperature-controlled zones, High-value materials in secure zones, etc.)"
                value={formData.priorityRules}
                onChange={(e) => updateFormData("priorityRules", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Warehouse Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Basic Information</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Name:</span>
                          <span>{formData.warehouseName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Code:</span>
                          <span>{formData.warehouseCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span>{formData.warehouseType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Building:</span>
                          <span>{formData.building}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Physical Structure</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Floors:</span>
                          <span>{formData.floors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Zones:</span>
                          <span>{formData.floors * formData.zonesPerFloor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Racks:</span>
                          <span>{calculateTotalRacks()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Levels:</span>
                          <span>{calculateTotalLevels()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Environmental Settings</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Temperature:</span>
                          <span>
                            {formData.tempMin}°C to {formData.tempMax}°C
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Humidity:</span>
                          <span>
                            {formData.humidityMin}% to {formData.humidityMax}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Allocation Settings</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Auto Allocation:</span>
                          <span>{formData.autoAllocation ? "Enabled" : "Disabled"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Material Types:</span>
                          <span>{formData.materialTypes.length} selected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{formData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Warehouse Setup Wizard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {setupSteps.length}
          </span>
          <Progress value={(currentStep / setupSteps.length) * 100} className="w-32" />
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentStep === setupSteps.length ? (
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
                {setupSteps[currentStep - 1].title}
              </CardTitle>
              <p className="text-muted-foreground">{setupSteps[currentStep - 1].description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {setupSteps.map((step, index) => (
            <div
              key={step.id}
              className={`h-2 w-8 rounded-full ${
                index + 1 < currentStep ? "bg-secondary" : index + 1 === currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {currentStep === setupSteps.length ? (
          <Button className="flex items-center gap-2">
            <Warehouse className="h-4 w-4" />
            Create Warehouse
          </Button>
        ) : (
          <Button onClick={nextStep} className="flex items-center gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Setup Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {setupSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                {index + 1 < currentStep ? (
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                ) : index + 1 === currentStep ? (
                  <Circle className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-medium ${index + 1 <= currentStep ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index + 1 < currentStep && <Badge variant="secondary">Completed</Badge>}
                {index + 1 === currentStep && <Badge variant="default">In Progress</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  )
}
