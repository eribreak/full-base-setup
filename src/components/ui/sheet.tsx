"use client"

import * as React from "react"
import * as DrawerPrimitive from "@base-ui/react/drawer"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = DrawerPrimitive.Drawer.Root

// SheetTrigger is a simple wrapper that renders a button
const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        ...props,
        ref,
      } as React.ComponentPropsWithoutRef<"button"> & { asChild?: boolean })
    }
    return (
      <button ref={ref} {...props}>
        {children}
      </button>
    )
  }
)
SheetTrigger.displayName = "SheetTrigger"

const SheetClose = DrawerPrimitive.Drawer.Close

const SheetPortal = DrawerPrimitive.Drawer.Portal

const SheetBackdrop = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Drawer.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Drawer.Backdrop>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Drawer.Backdrop
    ref={ref}
    data-slot="sheet-overlay"
    className={cn(
      "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
SheetBackdrop.displayName = "SheetBackdrop"

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Drawer.Popup>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Drawer.Popup> & { side?: "top" | "bottom" | "left" | "right" }
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetBackdrop />
    <DrawerPrimitive.Drawer.Popup
      ref={ref}
      data-slot="sheet-content"
      data-side={side}
      className={cn(
        "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
        {
          "w-[400px] right-0 top-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right":
            side === "right",
          "w-[400px] left-0 top-0 h-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left":
            side === "left",
          "h-[400px] bottom-0 left-0 right-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom":
            side === "bottom",
          "h-[400px] top-0 left-0 right-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top":
            side === "top",
        },
        className
      )}
      {...props}
    >
      <DrawerPrimitive.Drawer.Close
        data-slot="sheet-close"
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        )}
      >
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </DrawerPrimitive.Drawer.Close>
      {children}
    </DrawerPrimitive.Drawer.Popup>
  </SheetPortal>
))
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="sheet-header"
    className={cn("flex flex-col space-y-2", className)}
    {...props}
  />
)

const SheetFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="sheet-footer"
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Drawer.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Drawer.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Drawer.Title
    ref={ref}
    data-slot="sheet-title"
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Drawer.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Drawer.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Drawer.Description
    ref={ref}
    data-slot="sheet-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetPortal,
  SheetBackdrop,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}