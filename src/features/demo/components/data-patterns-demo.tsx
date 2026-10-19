"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
  Layers,
  Zap,
  Radio,
  Clock,
  Activity,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Shared Types & State
// ---------------------------------------------------------------------------

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled"

type DemoOrder = {
  id: string
  customer: string
  item: string
  amount: number
  status: OrderStatus
}

const INITIAL_ORDERS: DemoOrder[] = [
  { id: "ORD-101", customer: "Nguyen Van A", item: "Laptop Pro 16", amount: 32000000, status: "processing" },
  { id: "ORD-102", customer: "Tran Thi B", item: "Ban phim co", amount: 2800000, status: "shipped" },
  { id: "ORD-103", customer: "Le Van C", item: "Man hinh 4K", amount: 11500000, status: "delivered" },
]

function formatCurrency(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v)
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    processing: { label: "Processing", variant: "default" },
    shipped: { label: "Shipped", variant: "secondary" },
    delivered: { label: "Delivered", variant: "outline" },
    cancelled: { label: "Cancelled", variant: "destructive" },
  }
  const config = map[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

// ===========================================================================
// TAB 1: Request Deduplication
// ===========================================================================

// Module-scoped: dem so request that, va la `notify` de buoc re-render
// (se tao ra mot `refresh` moi => request moi => tang dem).
let globalNetworkCalls = 0
let notifyDedupCount: (() => void) | null = null

async function fetchOrdersDedup(): Promise<DemoOrder[]> {
  globalNetworkCalls++
  notifyDedupCount?.()
  await new Promise((r) => setTimeout(r, 800))
  return INITIAL_ORDERS
}

function OrderWidget({ title, badge }: { title: string; badge: string }) {
  const { data, isFetching } = useQuery({
    queryKey: ["demo-dedup-orders"],
    queryFn: fetchOrdersDedup,
    staleTime: 5000,
  })

  return (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">{title}</h4>
        <Badge variant="outline">{badge}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Trang thai: {isFetching ? "Dang fetch..." : "San sang"}
      </p>
      <div className="text-sm font-medium">
        {data ? `${data.length} don hang trong cache` : "Chua co data"}
      </div>
    </div>
  )
}

function subscribeDedupCount(cb: () => void) {
  notifyDedupCount = cb
  return () => {
    if (notifyDedupCount === cb) notifyDedupCount = null
  }
}

function TabDeduplication() {
  const queryClient = useQueryClient()
  const [triggerCount, setTriggerCount] = useState(0)
  // Đồng bộ bộ đếm request thật ra UI mỗi khi có fetch mới diễn ra
  const networkCalls = useSyncExternalStore(subscribeDedupCount, () => globalNetworkCalls, () => globalNetworkCalls)

  const handleSimulate = () => {
    queryClient.invalidateQueries({ queryKey: ["demo-dedup-orders"] })
    setTriggerCount((c) => c + 1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-500" />
          1. Request Deduplication (Khử trùng request)
        </CardTitle>
        <CardDescription>
          {`3 widget duoi day mount cung luc va deu goi chung queryKey ["demo-dedup-orders"].`}
          Chi co <strong>1 network call duy nhat</strong> duoc phat di; ket qua duoc chia se cho ca 3.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-md bg-muted/60">
          <div>
            <div className="text-xs uppercase text-muted-foreground font-semibold">
              Tong so network request that da thuc hien
            </div>
            <div className="text-2xl font-bold text-primary">
              {networkCalls} call(s)
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              So lan ca 3 widget dong loat yeu cau: {triggerCount + 1}
            </div>
          </div>
          <Button onClick={handleSimulate} size="sm">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Kich hoat 3 widget cung fetch
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <OrderWidget title="Widget Header" badge="Component A" />
          <OrderWidget title="Widget Sidebar" badge="Component B" />
          <OrderWidget title="Widget Dashboard" badge="Component C" />
        </div>

        <div className="text-xs text-muted-foreground border-l-2 border-primary/40 pl-3 py-1 bg-muted/30 rounded-r">
          <strong>Co che:</strong> TanStack Query tao mot In-Flight Promise Map theo `queryKey`. Khi Component B va C
          goi cung key trong luc Promise cua Component A chua resolve, chung se nhan lai cung mot Promise ma khong mo
          them HTTP connection nao.
        </div>
      </CardContent>
    </Card>
  )
}

// ===========================================================================
// TAB 2: Optimistic Update
// ===========================================================================

function TabOptimisticUpdate() {
  const queryClient = useQueryClient()
  const [shouldFail, setShouldFail] = useState(false)

  const { data: orders = INITIAL_ORDERS } = useQuery({
    queryKey: ["demo-optimistic-orders"],
    queryFn: async () => INITIAL_ORDERS,
    initialData: INITIAL_ORDERS,
  })

  const cancelMutation = useMutation({
    mutationFn: async ({ orderId, fail }: { orderId: string; fail: boolean }) => {
      await new Promise((r) => setTimeout(r, 1200)) // network delay
      if (fail) {
        throw new Error("Server tu choi: Don hang da duoc dong goi, khong the huy!")
      }
      return orderId
    },
    onMutate: async ({ orderId }) => {
      // 1. Huy refetch de khong overwrite
      await queryClient.cancelQueries({ queryKey: ["demo-optimistic-orders"] })

      // 2. Snapshot state cu
      const previous = queryClient.getQueryData<DemoOrder[]>(["demo-optimistic-orders"])

      // 3. CAP NHAT LẠC QUAN NGAY LAP TUC (0ms)
      queryClient.setQueryData<DemoOrder[]>(["demo-optimistic-orders"], (old = []) =>
        old.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)),
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      // 4. Rollback neu server bao loi
      if (context?.previous) {
        queryClient.setQueryData(["demo-optimistic-orders"], context.previous)
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          2. Optimistic Update (Cập nhật lạc quan)
        </CardTitle>
        <CardDescription>
          UI cap nhat ngay lap tuc (0ms) khi ban bam Huy. Server se xu ly ngam trong 1.2 giay. Neu that bai, UI se tu dong
          <strong> rollback</strong> ve trang thai cu.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-md bg-muted/60 text-sm">
          <div className="space-y-0.5">
            <span className="font-medium">Mo phong server tra ve loi</span>
            <p className="text-xs text-muted-foreground">
              Bat switch nay roi bam huy de thay co che rollback hoat dong.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={shouldFail}
              onCheckedChange={setShouldFail}
            />
            <span className="text-xs font-semibold">{shouldFail ? "BẬT (sẽ lỗi)" : "TẮT (thành công)"}</span>
          </div>
        </div>

        {cancelMutation.isError && (
          <div className="flex items-center gap-2 text-xs p-2.5 rounded bg-destructive/10 text-destructive border border-destructive/20">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>{cancelMutation.error.message} - UI da duoc rollback!</span>
          </div>
        )}

        {cancelMutation.isSuccess && (
          <div className="flex items-center gap-2 text-xs p-2.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Server da xac nhan thanh cong!</span>
          </div>
        )}

        <div className="rounded-md border divide-y">
          {orders.map((o) => (
            <div key={o.id} className="p-3 flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{o.id}</span>
                  <span className="font-medium text-sm truncate">{o.item}</span>
                  <StatusBadge status={o.status} />
                </div>
                <div className="text-xs text-muted-foreground">
                  {o.customer} &bull; {formatCurrency(o.amount)}
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                disabled={o.status === "cancelled" || cancelMutation.isPending}
                onClick={() => cancelMutation.mutate({ orderId: o.id, fail: shouldFail })}
              >
                {cancelMutation.isPending ? "Dang gui..." : "Huy don"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ===========================================================================
// TAB 3: Streaming UI
// ===========================================================================

function SlowStreamingWidget({ stage, delayMs, label }: { stage: number; delayMs: number; label: string }) {
  const [loaded, setLoaded] = useState(false)

  const handleStart = () => {
    setLoaded(false)
    setTimeout(() => setLoaded(true), delayMs)
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-muted-foreground">
          Giai doan {stage} ({delayMs}ms)
        </span>
        <Button size="xs" variant="ghost" onClick={handleStart}>
          Stream lai
        </Button>
      </div>

      {!loaded ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <p className="text-xs text-muted-foreground italic">Dang stream tu server...</p>
        </div>
      ) : (
        <div className="space-y-1 animate-in fade-in duration-300">
          <div className="text-sm font-semibold text-primary">{label}</div>
          <p className="text-xs text-muted-foreground">
            Du lieu da giai quyet xong va stream truc tiep vao vi tri skeleton ma khong chan cac phan khac.
          </p>
        </div>
      )}
    </div>
  )
}

function TabStreamingUI() {
  const [streamKey, setStreamKey] = useState(0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-indigo-500" />
          3. Streaming UI (Giao diện dòng chảy)
        </CardTitle>
        <CardDescription>
          Thay vi cho toan bo trang san sang moi tra ve HTML, server se tra ngay khung trang (Shell). Cac khoi du lieu cham
          se duoc stream dan theo tung phan vao Suspense fallback.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Nhan nut de xem 3 khoi duoc stream den browser o 3 thoi diem khac nhau:
          </p>
          <Button size="sm" onClick={() => setStreamKey((k) => k + 1)}>
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Chay lai toan bo stream
          </Button>
        </div>

        <div key={streamKey} className="grid gap-3 sm:grid-cols-3">
          <SlowStreamingWidget stage={1} delayMs={300} label="Fast: Thong tin nguoi dung (300ms)" />
          <SlowStreamingWidget stage={2} delayMs={1000} label="Medium: Bao cao don hang (1000ms)" />
          <SlowStreamingWidget stage={3} delayMs={2000} label="Slow: Phuc tap - AI Recommendations (2000ms)" />
        </div>

        <div className="p-3 rounded bg-muted/40 text-xs font-mono">
          <div className="text-muted-foreground">{"// Tuong duong trong Next.js App Router:"}</div>
          <div>&lt;Suspense fallback=&#123;&lt;UserSkeleton /&gt;&#125;&gt;&lt;UserSection /&gt;&lt;/Suspense&gt;</div>
          <div>&lt;Suspense fallback=&#123;&lt;OrderSkeleton /&gt;&#125;&gt;&lt;OrderSection /&gt;&lt;/Suspense&gt;</div>
          <div>&lt;Suspense fallback=&#123;&lt;AiSkeleton /&gt;&#125;&gt;&lt;AiRecommendations /&gt;&lt;/Suspense&gt;</div>
        </div>
      </CardContent>
    </Card>
  )
}

// ===========================================================================
// TAB 4: Stale-While-Revalidate (SWR)
// ===========================================================================

let swrFetchCount = 0

async function fetchSwrData(): Promise<{ timestamp: string; value: number }> {
  swrFetchCount++
  await new Promise((r) => setTimeout(r, 600))
  return {
    timestamp: new Date().toLocaleTimeString(),
    value: Math.floor(Math.random() * 1000) + 100,
  }
}

function TabSWR() {
  const queryClient = useQueryClient()
  const [staleTimeMs, setStaleTimeMs] = useState(4000)
  // Tick moi giay de cap nhat do tuoi cua du lieu (stale hay fresh) ma khong
  // can goi ham lay thoi gian truc tiep trong luc render.
  const [now, setNow] = useState(() => Date.now())

  const { data, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["demo-swr-data"],
    queryFn: fetchSwrData,
    staleTime: staleTimeMs,
  })

  // Dong ho chi chay tren client sau khi mount, khong anh huong SSR.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const isStale = now - dataUpdatedAt > staleTimeMs

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-emerald-500" />
          4. Stale-While-Revalidate (SWR)
        </CardTitle>
        <CardDescription>
          Phuc vu du lieu cu (stale) ngay lap tuc de UI khong bi chan, dong thoi kich hoat request ngam duoi background de
          lay ban moi nhat.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="p-3 border rounded-lg bg-card">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Trang thai du lieu</span>
            <div className="mt-1">
              {isStale ? (
                <Badge variant="destructive">STALE (Cũ)</Badge>
              ) : (
                <Badge variant="default">FRESH (Mới)</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              `staleTime`: {staleTimeMs / 1000} giay
            </p>
          </div>

          <div className="p-3 border rounded-lg bg-card">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Gia tri hien tai</span>
            <div className="text-xl font-bold text-primary mt-1">
              {data?.value ?? "..."}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Cap nhat luc: {data?.timestamp}</p>
          </div>

          <div className="p-3 border rounded-lg bg-card">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Background Revalidate</span>
            <div className="text-sm font-medium mt-1">
              {isFetching ? (
                <span className="text-amber-500 flex items-center gap-1">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Dang revalidate ngam...
                </span>
              ) : (
                <span className="text-muted-foreground">Khong co task ngam</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tong request: {swrFetchCount}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["demo-swr-data"] })}
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Yeu cau Revalidate
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setStaleTimeMs((t) => (t === 4000 ? 10000 : 4000))}
          >
            Doi staleTime ({staleTimeMs / 1000}s)
          </Button>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded border">
          <strong>Nhan xet:</strong> Khi ban bam &quot;Yeu cau Revalidate&quot;, giao dien KHONG HE bi thay the bang man hinh trang hay spinner to. Ban van doc duoc gia tri cu ngay lap tuc, va khi request ngam xong, gia tri moi se tu dong update em ai vao vi tri.
        </div>
      </CardContent>
    </Card>
  )
}

// ===========================================================================
// TAB 5: Smart Polling
// ===========================================================================

function TabSmartPolling() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [pollCount, setPollCount] = useState(0)

  const { data: statusData } = useQuery({
    queryKey: ["demo-smart-polling", isProcessing],
    queryFn: async () => {
      setPollCount((c) => c + 1)
      await new Promise((r) => setTimeout(r, 200))
      return {
        step: isProcessing ? "Dang xu ly giao dich..." : "Giao dich HOAN TAT",
        time: new Date().toLocaleTimeString(),
      }
    },
    // ★ SMART POLLING: chi poll khi dang processing, ngung ngay khi hoan tat
    refetchInterval: isProcessing ? 2000 : false,
    refetchIntervalInBackground: false, // Tab an thi ngung poll de tiet kiem pin & bang thong
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-rose-500" />
          5. Smart Polling (Lấy mẫu thông minh)
        </CardTitle>
        <CardDescription>
          Khong phai cu poll vo han moi 2 giay. Polling chi hoat dong khi du lieu dang o trang thai can theo doi
          (&apos;processing&apos;) va tu dong tat hoan toan khi ve trang thai cuoi, dong thoi tam dung khi user chuyen tab khac.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="p-4 border rounded-lg bg-card space-y-2">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Tien trinh don hang</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold">{statusData?.step}</span>
              {isProcessing && <RefreshCw className="h-4 w-4 animate-spin text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground">Cap nhat: {statusData?.time}</p>
          </div>

          <div className="p-4 border rounded-lg bg-card space-y-2">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Co che tiet kiem</span>
            <div className="text-sm font-medium">
              So lan poll: <strong className="text-primary">{pollCount}</strong>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isProcessing ? (
                <span className="text-emerald-500 font-medium flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Polling dang chay (2s/lan)
                </span>
              ) : (
                <span className="text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Da ngat polling tu dong
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant={isProcessing ? "destructive" : "default"}
            onClick={() => setIsProcessing(!isProcessing)}
          >
            {isProcessing ? "Ket thuc tien trinh (Tat poll)" : "Khoi dong lai tien trinh (Bat poll)"}
          </Button>

          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> Thu chuyen sang tab trinh duyet khac: polling se tu dong ngung lai!
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// ===========================================================================
// MAIN COMPONENT EXPORT
// ===========================================================================

export function DataPatternsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kien truc Fetch Du Lieu</h1>
        <p className="text-muted-foreground">
          Minh hoa 5 khai niem quan trong trong TanStack Query &amp; Next.js thong qua vi du tuong tac truc tiep.
        </p>
      </div>

      <Tabs defaultValue="dedup" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto p-1 gap-1">
          <TabsTrigger value="dedup" className="py-2 text-xs sm:text-sm">
            <Layers className="h-4 w-4 mr-1.5" />
            Deduplication
          </TabsTrigger>
          <TabsTrigger value="optimistic" className="py-2 text-xs sm:text-sm">
            <Zap className="h-4 w-4 mr-1.5" />
            Optimistic
          </TabsTrigger>
          <TabsTrigger value="streaming" className="py-2 text-xs sm:text-sm">
            <Radio className="h-4 w-4 mr-1.5" />
            Streaming UI
          </TabsTrigger>
          <TabsTrigger value="swr" className="py-2 text-xs sm:text-sm">
            <Clock className="h-4 w-4 mr-1.5" />
            SWR
          </TabsTrigger>
          <TabsTrigger value="polling" className="py-2 text-xs sm:text-sm">
            <Activity className="h-4 w-4 mr-1.5" />
            Smart Polling
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="dedup">
            <TabDeduplication />
          </TabsContent>

          <TabsContent value="optimistic">
            <TabOptimisticUpdate />
          </TabsContent>

          <TabsContent value="streaming">
            <TabStreamingUI />
          </TabsContent>

          <TabsContent value="swr">
            <TabSWR />
          </TabsContent>

          <TabsContent value="polling">
            <TabSmartPolling />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
