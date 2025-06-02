"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  BarChart3,
  ClipboardList,
  FileText,
  Home,
  Package,
  Settings,
  ShieldCheck,
  Truck,
  Warehouse,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

interface SidebarItemProps {
  href: string
  icon: React.ElementType
  title: string
  badge?: string | number
  badgeColor?: string
  children?: {
    href: string
    title: string
  }[]
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()

  const sidebarItems: SidebarItemProps[] = [
    {
      href: "/dashboard",
      icon: Home,
      title: "Dashboard",
    },
    {
      href: "/requisition",
      icon: ClipboardList,
      title: "Requisition",
      badge: 3,
      badgeColor: "bg-primary text-primary-foreground",
      children: [
        { href: "/requisition/create", title: "Create Requisition" },
        { href: "/requisition/view", title: "View Requisitions" },
        { href: "/requisition/status", title: "Status Timeline" },
      ],
    },
    {
      href: "/inbound",
      icon: Truck,
      title: "Inbound Shipment",
      children: [
        { href: "/inbound/notifications", title: "Notifications" },
        { href: "/inbound/receiving", title: "Receiving Process" },
        { href: "/inbound/grn", title: "GRN Management" },
      ],
    },
    {
      href: "/quality",
      icon: ShieldCheck,
      title: "Quality Control",
      badge: 2,
      badgeColor: "bg-warning text-white",
      children: [
        { href: "/quality/samples", title: "Sample Management" },
        { href: "/quality/tests", title: "Test Results" },
        { href: "/quality/decisions", title: "QC Decisions" },
        { href: "/quality/rejection", title: "Rejection Management" },
      ],
    },
    {
      href: "/warehouse",
      icon: Warehouse,
      title: "Warehouse",
      children: [
        { href: "/warehouse/overview", title: "Overview" },
        { href: "/warehouse/setup", title: "Setup" },
        { href: "/warehouse/temperature", title: "Temperature Mapping" },
      ],
    },
    {
      href: "/inventory",
      icon: Package,
      title: "Inventory",
      badge: 5,
      badgeColor: "bg-destructive text-destructive-foreground",
      children: [
        { href: "/inventory/listing", title: "Inventory Listing" },
        { href: "/inventory/expiry", title: "Expiry Management" },
        { href: "/inventory/retest", title: "Retest Management" },
        { href: "/inventory/adjustments", title: "Adjustments" },
      ],
    },
    {
      href: "/production",
      icon: BarChart3,
      title: "Production",
      children: [
        { href: "/production/requisition", title: "Department Requisition" },
        { href: "/production/dispensing", title: "Dispensing" },
        { href: "/production/returns", title: "Returns" },
      ],
    },
    {
      href: "/reports",
      icon: FileText,
      title: "Reports",
      children: [
        { href: "/reports/grn", title: "GRN History" },
        { href: "/reports/requisition", title: "Requisition History" },
        { href: "/reports/qa-qc", title: "QA/QC Logs" },
        { href: "/reports/expiry", title: "Expiry Reports" },
        { href: "/reports/movement", title: "Material Movement" },
      ],
    },
    {
      href: "/alerts",
      icon: AlertCircle,
      title: "Alerts",
      badge: 12,
      badgeColor: "bg-destructive text-destructive-foreground",
    },
    {
      href: "/settings",
      icon: Settings,
      title: "Settings",
    },
  ]

  return (
    <>
      <div
        className={cn("fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden", open ? "block" : "hidden")}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r bg-card text-card-foreground shadow-sm transition-transform lg:relative lg:z-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">M</span>
            </div>
            <span className="text-lg font-semibold">MediTrack</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-3 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Main Navigation
            </h2>
            <div className="space-y-1">
              {sidebarItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  badge={item.badge}
                  badgeColor={item.badgeColor}
                  children={item.children}
                />
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}

function SidebarItem({
  href,
  icon: Icon,
  title,
  badge,
  badgeColor = "bg-primary text-primary-foreground",
  children,
}: SidebarItemProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  if (children) {
    return (
      <Collapsible open={open || isActive} onOpenChange={setOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn("flex w-full items-center justify-between px-4 py-2 hover:bg-muted", isActive && "bg-muted")}
          >
            <div className="flex items-center">
              <Icon className="mr-2 h-4 w-4" />
              <span>{title}</span>
            </div>
            {badge && (
              <span
                className={cn(
                  "ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-xs font-medium",
                  badgeColor,
                )}
              >
                {badge}
              </span>
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-6">
          {children.map((child, index) => {
            const isChildActive = pathname === child.href
            return (
              <Link
                key={index}
                href={child.href}
                className={cn(
                  "flex items-center py-2 pl-4 pr-2 text-sm hover:text-foreground",
                  isChildActive ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {child.title}
              </Link>
            )
          })}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-4 py-2 text-sm hover:bg-muted",
        isActive ? "bg-muted font-medium text-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="mr-2 h-4 w-4" />
      <span>{title}</span>
      {badge && (
        <span
          className={cn(
            "ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-xs font-medium",
            badgeColor,
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  )
}
