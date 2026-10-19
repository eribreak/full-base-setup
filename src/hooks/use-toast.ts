"use client"

import { toast as toastManager } from "@/components/ui/toast"

type ToastOptions = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Compatibility layer over the Base UI toast manager exported by
// @/components/ui/toast, preserving the familiar toast({...}) call signature.
function toast({ variant, duration, action, ...options }: ToastOptions) {
  const id = toastManager.add({
    ...options,
    type: variant === "destructive" ? "error" : undefined,
    timeout: duration,
    actionProps: action
      ? { children: action.label, onClick: action.onClick }
      : undefined,
  })

  return {
    id,
    dismiss: () => toastManager.close(id),
  }
}

function dismiss(toastId?: string) {
  toastManager.close(toastId)
}

export { toast, dismiss }
