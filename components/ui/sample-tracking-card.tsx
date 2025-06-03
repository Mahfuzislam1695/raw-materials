"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, TestTube, MapPin } from "lucide-react"

interface SampleTrackingCardProps {
  sampleId: string
  material: string
  batch: string
  sourceLocation: "quarantine" | "stock"
  warehouse: string
  zone: string
  rack: string
  level: string
  sampleQuantity: string
  availableQuantity: string
  reason: string
}

export function SampleTrackingCard({
  sampleId,
  material,
  batch,
  sourceLocation,
  warehouse,
  zone,
  rack,
  level,
  sampleQuantity,
  availableQuantity,
  reason,
}: SampleTrackingCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            {sampleId}
          </CardTitle>
          <Badge variant={sourceLocation === "quarantine" ? "secondary" : "default"}>
            {sourceLocation === "quarantine" ? "Quarantine" : "Stock"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              Material & Batch
            </div>
            <div>
              <p className="font-medium">{material}</p>
              <p className="text-sm text-muted-foreground">{batch}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Location
            </div>
            <div>
              <p className="font-medium">{warehouse}</p>
              <p className="text-sm text-muted-foreground">
                {zone} → {rack} → {level}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Sample Quantity</p>
            <p className="font-medium text-lg">{sampleQuantity}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Remaining Quantity</p>
            <p className="font-medium text-lg">{availableQuantity}</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground mb-1">Testing Reason</p>
          <p className="text-sm">{reason}</p>
        </div>
      </CardContent>
    </Card>
  )
}
