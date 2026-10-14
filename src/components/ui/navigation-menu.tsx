"use client"

import * as React from "react"
import * as NavigationMenuPrimitive from "@base-ui/react/navigation-menu"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.NavigationMenu.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.NavigationMenu.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.NavigationMenu.Root
    ref={ref}
    data-slot="navigation-menu"
    className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.NavigationMenu.Root>
))
NavigationMenu.displayName = "NavigationMenu"

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.NavigationMenu.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.NavigationMenu.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.NavigationMenu.List
    ref={ref}
    data-slot="navigation-menu-list"
    className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
    {...props}
  />
))
NavigationMenuList.displayName = "NavigationMenuList"

const NavigationMenuItem = NavigationMenuPrimitive.NavigationMenu.Item

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.NavigationMenu.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.NavigationMenu.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.NavigationMenu.Content
    ref={ref}
    data-slot="navigation-menu-content"
    className={cn(
      "left-0 top-0 w-full data-[motion=from-start]:animate-in data-[motion=from-end]:animate-in data-[motion=from-start]:fade-in data-[motion=from-end]:fade-in data-[motion=to-start]:animate-out data-[motion=to-end]:animate-out data-[motion=to-start]:fade-out data-[motion=to-end]:fade-out data-[motion=from-start]:slide-in-from-left-52 data-[motion=from-end]:slide-in-from-right-52",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = "NavigationMenuContent"

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.NavigationMenu.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.NavigationMenu.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.NavigationMenu.Trigger
    ref={ref}
    data-slot="navigation-menu-trigger"
    className={cn(
      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
  </NavigationMenuPrimitive.NavigationMenu.Trigger>
))
NavigationMenuTrigger.displayName = "NavigationMenuTrigger"

const NavigationMenuLink = NavigationMenuPrimitive.NavigationMenu.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.NavigationMenu.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.NavigationMenu.Viewport>
>(({ className, ...props }, ref) => (
  <div data-slot="navigation-menu-viewport" className={cn("absolute left-0 top-full flex justify-center", className)}>
    <NavigationMenuPrimitive.NavigationMenu.Viewport
      ref={ref}
      className={cn(
        "origin-top-center rounded-md border border-border bg-background text-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-90 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-90 data-[state=open]:fade-in-0 md:absolute md:w-auto",
        className
      )}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName = "NavigationMenuViewport"

export const navigationMenuTriggerStyle = "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuViewport,
}