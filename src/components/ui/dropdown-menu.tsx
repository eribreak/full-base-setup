"use client"

import * as React from "react"
import * as MenuPrimitive from "@base-ui/react/menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = MenuPrimitive.Menu.Root

const DropdownMenuTrigger = MenuPrimitive.Menu.Trigger

const DropdownMenuGroup = MenuPrimitive.Menu.Group

const DropdownMenuPortal = MenuPrimitive.Menu.Portal

const DropdownMenuSub = MenuPrimitive.Menu.SubmenuRoot

const DropdownMenuRadioGroup = MenuPrimitive.Menu.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Menu.SubmenuTrigger>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Menu.SubmenuTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <MenuPrimitive.Menu.SubmenuTrigger
    ref={ref}
    data-slot="dropdown-menu-sub-trigger"
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto size-4" />
  </MenuPrimitive.Menu.SubmenuTrigger>
))
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Menu.Popup>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Menu.Popup>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Menu.Popup
    ref={ref}
    data-slot="dropdown-menu-sub-content"
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = "DropdownMenuSubContent"

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Menu.Popup>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Menu.Popup>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Menu.Portal>
    <MenuPrimitive.Menu.Positioner>
      <MenuPrimitive.Menu.Popup
        ref={ref}
        data-slot="dropdown-menu-content"
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenuPrimitive.Menu.Positioner>
  </MenuPrimitive.Menu.Portal>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Menu.Item>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Menu.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.Menu.Item
    ref={ref}
    data-slot="dropdown-menu-item"
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Menu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Menu.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenuPrimitive.Menu.CheckboxItem
    ref={ref}
    data-slot="dropdown-menu-checkbox-item"
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <MenuPrimitive.Menu.CheckboxItemIndicator>
        <Check className="size-4" />
      </MenuPrimitive.Menu.CheckboxItemIndicator>
    </span>
    {children}
  </MenuPrimitive.Menu.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Menu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Menu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.Menu.RadioItem
    ref={ref}
    data-slot="dropdown-menu-radio-item"
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <MenuPrimitive.Menu.RadioItemIndicator>
        <Circle className="size-2 fill-current" />
      </MenuPrimitive.Menu.RadioItemIndicator>
    </span>
    {children}
  </MenuPrimitive.Menu.RadioItem>
))
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Menu.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Menu.GroupLabel> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.Menu.GroupLabel
    ref={ref}
    data-slot="dropdown-menu-label"
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Menu.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Menu.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Menu.Separator
    ref={ref}
    data-slot="dropdown-menu-separator"
    className={cn("-mx-1 my-1 h-[1px] bg-border", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuShortcut = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    data-slot="dropdown-menu-shortcut"
    className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
    {...props}
  />
)

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}