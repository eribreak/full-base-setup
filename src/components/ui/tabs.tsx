"use client"

import * as React from "react"
import * as TabsPrimitive from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Tabs.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Tabs.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tabs.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tabs.List
    ref={ref}
    data-slot="tabs-list"
    className={cn(
      "inline-flex h-10 items-center justify-center gap-1 rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Tabs.Tab>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tabs.Tab>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tabs.Tab
    ref={ref}
    data-slot="tabs-trigger"
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Tabs.Panel>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tabs.Panel>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tabs.Panel
    ref={ref}
    data-slot="tabs-content"
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }