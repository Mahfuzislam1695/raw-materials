"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { FileText, Package, MapPin, Calendar, User, ArrowRight, ArrowLeft } from "lucide-react"

interface BinCardTransaction {
  id: string
  date: string
  type: "receipt" | "issue" | "return" | "transfer" | "adjustment"
  reference: string
  description: string
  inQty?: string
  outQty?: string
  balance: string
  authorizedBy: string
}

interface DigitalBinCardProps {
  binCardId: string
  material: string
  batch: string
  location: string
  currentBalance: string
  status: "stock" | "quarantine" | "reject"
  transactions: BinCardTransaction[]
}

export function DigitalBinCard({
  binCardId,
  material,
  batch,
  location,
  currentBalance,
  status,
  transactions,
}: DigitalBinCardProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "receipt":
        return <ArrowRight className="h-4 w-4 text-green-600" />
      case "issue":
        return <ArrowLeft className="h-4 w-4 text-blue-600" />
      case "return":
        return <ArrowRight className="h-4 w-4 text-purple-600" />
      case "transfer":
        return <Package className="h-4 w-4 text-orange-600" />
      case "adjustment":
        return <FileText className="h-4 w-4 text-gray-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stock":
        return "default"
      case "quarantine":
        return "secondary"
      case "reject":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Digital Bin Card
          </CardTitle>
          <Badge variant={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">Bin Card ID: {binCardId}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Material Information */}
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
              Current Location
            </div>
            <p className="font-medium">{location}</p>
          </div>
        </div>

        <Separator />

        {/* Current Balance */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-2xl font-bold text-blue-600">{currentBalance}</p>
        </div>

        <Separator />

        {/* Transaction History */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Transaction History
          </h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTransactionIcon(transaction.type)}
                    <span className="font-medium capitalize">{transaction.type}</span>
                    <Badge variant="outline" className="text-xs">
                      {transaction.reference}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{transaction.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{transaction.description}</p>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">In: </span>
                    <span className="font-medium">{transaction.inQty || "-"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Out: </span>
                    <span className="font-medium">{transaction.outQty || "-"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Balance: </span>
                    <span className="font-medium">{transaction.balance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="text-xs">{transaction.authorizedBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            Print Bin Card
          </Button>
          <Button variant="outline" className="flex-1">
            Export History
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
