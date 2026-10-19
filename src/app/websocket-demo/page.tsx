"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createWebSocketClient, type ConnectionStatus, type DemoMessage } from "@/lib/websocket"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || ""

export default function WebsocketDemoPage() {
  const [status, setStatus] = useState<ConnectionStatus>("Disconnected")
  const [messages, setMessages] = useState<{ dir: "sent" | "received"; data: DemoMessage }[]>([])
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // client được tạo một lần; các effect đăng ký handler
  const client = useMemo(
    () =>
      createWebSocketClient({
        url: WS_URL,
        onMessage: (msg) => {
          setMessages((prev) => [...prev, { dir: "received", data: msg }])
        },
        onStatusChange: setStatus,
        onError: (msg) => setError(msg),
      }),
    []
  )

  // Nếu kết nối không thành công trong 5s (server chưa chạy, URL sai...),
  // reset về Disconnected để người dùng thấy rõ và có thể thử lại.
  useEffect(() => {
    if (status !== "Connecting") return undefined
    const id = setTimeout(() => {
      if (client.getStatus() === "Connecting") {
        setError("Ket noi khong thanh cong trong 5s. Dam bao mock server dang chay tai ws://localhost:4001.")
        setStatus("Disconnected")
      }
    }, 5000)
    return () => clearTimeout(id)
  }, [status, client])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Cleanup khi component unmount: đóng kết nối và dọn listener
  useEffect(() => {
    return () => {
      client.disconnect()
    }
  }, [client])

  const handleConnect = () => {
    if (!WS_URL) {
      setError("NEXT_PUBLIC_WS_URL chua duoc cau hinh. Xem .env.")
      return
    }
    setError(null)
    const ok = client.connect()
    if (!ok) setError("Khong the mo ket noi. Kiem tra URL va server.")
  }

  const handleDisconnect = () => {
    client.disconnect()
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    const ok = client.send({ type: "chat", payload: text })
    if (ok) {
      setMessages((prev) => [...prev, { dir: "sent", data: { type: "chat", payload: text } }])
      setInput("")
    } else {
      setError("Khong gui duoc: ket noi chua mo hoac da dong.")
    }
  }

  const statusVariant: Record<ConnectionStatus, "default" | "secondary" | "destructive"> = {
    Disconnected: "destructive",
    Connecting: "secondary",
    Connected: "default",
  }

  return (
    <div className="container max-w-2xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>WebSocket Demo</CardTitle>
          <CardDescription>
            Luot tuong tac co ban giua React/Next.js client va mock server local.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trang thai:</span>
              <Badge variant={statusVariant[status]}>{status}</Badge>
            </div>
            <div className="ml-auto flex gap-2">
              <Button onClick={handleConnect} disabled={status === "Connected"}>Connect</Button>
              <Button onClick={handleDisconnect} variant="outline" disabled={status === "Disconnected"}>
                Disconnect
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-sm p-2 rounded bg-destructive/10 text-destructive border border-destructive/20">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Nhap noi dung..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend()
              }}
            />
            <Button onClick={handleSend} disabled={status !== "Connected" || !input.trim()}>
              Send
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-sm font-medium">Messages</div>
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chua co message nao.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto rounded-md border p-3 space-y-2">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col rounded-md p-2 text-sm ${
                      m.dir === "sent" ? "bg-primary/10 ml-6" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold">{m.dir === "sent" ? "SENT" : "RECEIVED"}</span>
                      <span className="font-mono">{m.data.type}</span>
                    </div>
                    <pre className="whitespace-pre-wrap break-words text-xs mt-0.5">
                      {JSON.stringify(m.data.payload)}
                    </pre>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}