import type { Metadata } from "next"
import { DataPatternsDemo } from "@/features/demo/components/data-patterns-demo"

export const metadata: Metadata = {
  title: "Data Fetching Patterns",
  description: "Minh hoa 5 khai niem: deduplication, optimistic update, streaming, SWR, smart polling.",
}

export default function DataPatternsPage() {
  return <DataPatternsDemo />
}
