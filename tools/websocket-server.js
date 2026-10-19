/**
 * Mock WebSocket server tối giản — dùng để demo client trong dự án.
 *
 * Chạy:  node tools/websocket-server.js
 * Lắng nghe: ws://127.0.0.1:4001
 *
 * Nhận JSON từ client, trả lại một message echo:
 *   { "type": "echo", "payload": <nội dung vừa gửi> }
 */

const { WebSocketServer } = require("ws") // eslint-disable-line @typescript-eslint/no-require-imports

const PORT = Number(process.env.WS_PORT) || 4001
const HOST = process.env.WS_HOST || "127.0.0.1"

const server = new WebSocketServer({ host: HOST, port: PORT })

server.on("connection", (socket, req) => {
  const ip = req.socket.remoteAddress
  console.log(`[ws] client connected from ${ip} (total: ${server.clients.size})`)

  socket.on("message", (data) => {
    let incoming
    try {
      incoming = JSON.parse(data.toString())
    } catch {
      incoming = { type: "text", payload: data.toString() }
    }

    const echo = {
      type: "echo",
      payload: incoming?.payload ?? incoming,
      receivedAt: new Date().toISOString(),
    }

    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(echo))
    }
  })

  socket.on("close", (code) => {
    console.log(`[ws] client disconnected (code: ${code}, total: ${server.clients.size})`)
  })

  socket.on("error", (err) => {
    console.error("[ws] client error:", err.message)
  })
})

server.on("error", (err) => {
  console.error("[ws] server error:", err.message)
  process.exit(1)
})

console.log(`[ws] mock server listening on ws://${HOST}:${PORT}`)