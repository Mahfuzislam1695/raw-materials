"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Home,
  ArrowLeft,
  Search,
  AlertTriangle,
  Package,
  Warehouse,
  ClipboardList,
  Shield,
  BarChart3,
  Settings,
} from "lucide-react"

export default function NotFound() {
  const quickLinks = [
    {
      title: "Dashboard",
      description: "Return to main dashboard",
      href: "/",
      icon: Home,
      color: "text-blue-600",
    },
    {
      title: "Inventory Management",
      description: "Manage raw materials inventory",
      href: "/inventory",
      icon: Package,
      color: "text-green-600",
    },
    {
      title: "Warehouse Operations",
      description: "Warehouse and storage management",
      href: "/warehouse",
      icon: Warehouse,
      color: "text-purple-600",
    },
    {
      title: "Requisition Management",
      description: "Handle material requisitions",
      href: "/requisition",
      icon: ClipboardList,
      color: "text-orange-600",
    },
    {
      title: "Quality Control",
      description: "Quality assurance and testing",
      href: "/quality",
      icon: Shield,
      color: "text-red-600",
    },
    {
      title: "Reports & Analytics",
      description: "View reports and analytics",
      href: "/reports",
      icon: BarChart3,
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Main Error Card */}
        <Card className="text-center border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-2">404 - Page Not Found</CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-md mx-auto">
              The page you're looking for doesn't exist in the Medicine Raw Material Management System.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="javascript:history.back()">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">Quick Navigation</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Access key areas of the system directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border border-gray-200 hover:border-blue-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg bg-gray-50 ${link.color}`}>
                          <link.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                          <p className="text-sm text-gray-600">{link.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Help Finding Something?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If you're looking for a specific feature or page in the Medicine Raw Material Management System, try using
              the search function in the main navigation or contact your system administrator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/alerts">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Alerts
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Medicine Raw Material Management System v2.0</p>
          <p className="mt-1">© 2024 Pharmaceutical Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
