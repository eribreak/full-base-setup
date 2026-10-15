"use client"

import { Toaster } from "@/components/ui/toast"

// Re-export of the registry Toaster (src/components/ui/toast.tsx), which
// renders its own toast list through the Base UI toast manager. Keeping this
// module so src/app/layout.tsx can import "@/components/ui/toaster".
export { Toaster }
