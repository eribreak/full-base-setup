/**
 * WebSocket client nhỏ, không phụ thuộc React.
 *
 * Dùng Browser WebSocket API trực tiếp. Không tự reconnect, không queue,
 * không heartbeat — chỉ đủ để demo luồng connect / send / receive /
 * disconnect trong React.
 */

export type DemoMessage = {
  type: string
  payload?: unknown
}

type MessageHandler = (message: DemoMessage) => void
type StatusHandler = (status: ConnectionStatus) => void
type ErrorHandler = (error: string) => void

export type ConnectionStatus = "Disconnected" | "Connecting" | "Connected"

export interface WebSocketClientOptions {
  url: string
  onMessage?: MessageHandler
  onStatusChange?: StatusHandler
  onError?: ErrorHandler
  /** Parse JSON trong try/catch; message không phải JSON thì bỏ qua (nhưng vẫn thông báo). */
  parseJson?: boolean
}

/**
 * Tạo một WebSocket client. Chưa kết nối — gọi `connect()` để mở.
 */
export function createWebSocketClient({
  url,
  onMessage,
  onStatusChange,
  onError,
  parseJson = true,
}: WebSocketClientOptions) {
  let socket: WebSocket | null = null
  let status: ConnectionStatus = "Disconnected"
  let manuallyClosed = false

  const setStatus = (next: ConnectionStatus) => {
    status = next
    onStatusChange?.(next)
  }

  const connect = () => {
    if (typeof window === "undefined") return false
    if (socket && socket.readyState === WebSocket.OPEN) return true
    if (!url) return false

    manuallyClosed = false
    setStatus("Connecting")

    try {
      socket = new WebSocket(url)
    } catch {
      setStatus("Disconnected")
      return false
    }

    socket.onopen = () => {
      setStatus("Connected")
    }

    socket.onmessage = (event: MessageEvent<string>) => {
      let parsed: DemoMessage | null = null
      if (parseJson) {
        try {
          parsed = JSON.parse(event.data) as DemoMessage
        } catch {
          // Dữ liệu không phải JSON → coi là message text đơn giản
          parsed = { type: "text", payload: event.data }
        }
      } else {
        parsed = { type: "raw", payload: event.data }
      }

      if (parsed) onMessage?.(parsed)
    }

    socket.onerror = () => {
      // onclose sẽ chạy ngay sau đó, ở đó status được set về Disconnected.
      // Báo lỗi để UI hiển thị lý do kết nối không thành công (server chưa chạy, URL sai...).
      onError?.("Ket noi that bai. Kiem tra server va NEXT_PUBLIC_WS_URL.")
    }

    socket.onclose = () => {
      socket = null
      if (!manuallyClosed) {
        // Kết nối bị mất (không phải do người dùng nhấn Disconnect).
        // Spec không yêu cầu tự reconnect → chỉ set lại trạng thái.
        setStatus("Disconnected")
      }
    }

    return true
  }

  const send = (message: DemoMessage): boolean => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return false
    socket.send(JSON.stringify(message))
    return true
  }

  const disconnect = () => {
    manuallyClosed = true
    if (socket) {
      socket.onopen = null
      socket.onmessage = null
      socket.onerror = null
      socket.onclose = null
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CLOSING
      ) {
        socket.close()
      }
      socket = null
    }
    setStatus("Disconnected")
  }

  const getStatus = () => status

  return { connect, send, disconnect, getStatus }
}