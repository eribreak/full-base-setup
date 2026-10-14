"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type ToastProps = React.ComponentProps<"div">

function Toast({ className, ...props }: ToastProps) {
  return (
    <div
      data-slot="toast"
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border bg-background p-4 shadow-md",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="toast-title"
      className={cn("text-sm font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function ToastDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="toast-description"
      className={cn("text-sm opacity-90 [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

function ToastClose({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="toast-close"
      className={cn(
        "rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors",
        className
      )}
      {...props}
    />
  )
}

function ToastAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toast-action"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

const toastContext = React.createContext<{
  addToast: (toast: ToastProps) => void
  removeToast: (id: string) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([])

  const addToast = React.useCallback((toast: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = { addToast, removeToast }

  return (
    <toastContext.Provider value={value}>
      {children}
      <div data-slot="toast-viewport" className="fixed top-0 z-50 flex flex-col gap-2 p-4">
        {toasts.map(({ id, ...toast }) => (
          <Toast key={id} {...toast} />
        ))}
      </div>
    </toastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(toastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  type ToastProps,
}