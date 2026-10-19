# Basic WebSocket Demo for React / Next.js

**Mục tiêu:** Tạo ví dụ WebSocket tối giản trong dự án React/Next.js, có
thể chạy thử mà chưa cần backend nghiệp vụ.

## 1. Phạm vi

Chỉ cần: - Một WebSocket client nhỏ, tách khỏi UI. - Một React hook hoặc
component demo để kết nối, hiển thị trạng thái và gửi/nhận message. -
Một mock server chạy local. - Hướng dẫn chạy và kiểm tra.

Chưa cần: - Reconnect nâng cao, exponential backoff hoặc jitter. -
Heartbeat, authentication, message queue, ACK/replay. - Event bus,
provider toàn ứng dụng, logging framework. - Nhiều tầng abstraction hoặc
cấu hình phức tạp.

## 2. Cấu trúc gợi ý

Điều chỉnh theo cấu trúc hiện tại của repository; không cần tạo thư mục
mới nếu dự án đã có chỗ phù hợp.

``` text
src/
  lib/
    websocket.ts
  app/
    websocket-demo/
      page.tsx

tools/
  websocket-server.js
```

Có thể dùng component riêng thay vì `page.tsx` nếu phù hợp hơn với dự
án.

## 3. WebSocket client

Tạo một module nhỏ dùng Browser WebSocket API, không phụ thuộc React.

Yêu cầu: - Nhận `url` khi khởi tạo. - Có hàm `connect()`,
`send(message)`, `disconnect()`. - Cho phép đăng ký handler nhận message
và thay đổi trạng thái. - Parse message JSON trong `try/catch`. - Chỉ
gửi khi socket đang ở trạng thái `OPEN`; nếu chưa sẵn sàng thì trả về
`false`. - Khi `disconnect()` được gọi, đóng kết nối và không tự kết nối
lại. - Dọn event listener khi component unmount.

Có thể dùng kiểu message đơn giản:

``` ts
export type DemoMessage = {
  type: string;
  payload?: unknown;
};
```

Không cần xây dựng protocol tổng quát hoặc hệ thống event type phức tạp
cho ví dụ này.

## 4. React / Next.js demo

Tạo một trang demo client-side với `"use client"`.

Trang cần hiển thị: - Trạng thái: `Disconnected`, `Connecting`,
`Connected`. - Nút Connect. - Nút Disconnect. - Ô nhập nội dung. - Nút
Send. - Danh sách message đã gửi/nhận.

Hành vi: 1. Nhấn Connect để mở kết nối WebSocket. 2. Khi kết nối thành
công, trạng thái hiển thị `Connected`. 3. Nhập nội dung và nhấn Send để
gửi message. 4. Server phản hồi message; trang hiển thị nội dung nhận
được. 5. Nhấn Disconnect để đóng kết nối. 6. Khi component unmount, đóng
kết nối và dọn listener.

Không cần tự reconnect. Nếu kết nối bị mất, người dùng có thể nhấn
Connect lại.

## 5. Mock WebSocket server

Dùng Node.js và thư viện `ws` nếu repository chưa có thư viện WebSocket
server.

Server tối thiểu: - Lắng nghe tại `ws://localhost:4001`. - Nhận JSON từ
client. - Trả lại một message phản hồi, ví dụ
`{ "type": "echo", "payload": "nội dung vừa gửi" }`. - In log kết nối và
ngắt kết nối. - Chỉ bind `127.0.0.1` mặc định để dùng local.

Thêm script chạy server nếu phù hợp với package hiện tại, ví dụ:

``` bash
node tools/websocket-server.js
```

Nếu cần cài `ws`, ghi rõ lệnh cài đặt tương ứng với package manager của
dự án. Không thêm framework server mới.

## 6. Cấu hình

Dùng một biến môi trường phía client:

``` env
NEXT_PUBLIC_WS_URL=ws://localhost:4001
```

Không bắt buộc phải có cờ bật/tắt riêng trong ví dụ này. Nếu URL chưa
được cấu hình, hiển thị thông báo dễ hiểu và không cố kết nối.

Đây là cấu hình dành cho local demo. Khi deploy HTTPS, endpoint
WebSocket thật thường cần dùng `wss://`.

## 7. Kiểm tra thủ công

1.  Khởi động mock server.
2.  Khởi động ứng dụng Next.js.
3.  Mở trang demo.
4.  Nhấn Connect và xác nhận trạng thái Connected.
5.  Gửi một nội dung và xác nhận server echo lại.
6.  Nhấn Disconnect và xác nhận trạng thái Disconnected.
7.  Rời trang demo rồi quay lại; xác nhận không có kết nối cũ bị bỏ lại.

## 8. Tiêu chí hoàn thành

-   [ ] Có module WebSocket nhỏ, không phụ thuộc React.
-   [ ] Có trang demo React/Next.js.
-   [ ] Có mock server local.
-   [ ] Gửi và nhận được message.
-   [ ] Hiển thị trạng thái kết nối.
-   [ ] Có thể chủ động ngắt kết nối.
-   [ ] Cleanup kết nối khi component unmount.
-   [ ] Có hướng dẫn chạy ngắn gọn.
-   [ ] Không triển khai thêm abstraction hoặc tính năng ngoài phạm vi.

## 9. Hướng dẫn cho coding agent

Trước khi sửa code: 1. Kiểm tra cấu trúc repository, package manager và
cách tổ chức route hiện tại. 2. Tái sử dụng thư viện hoặc quy ước sẵn có
nếu có. 3. Nêu ngắn gọn các file dự định thêm/sửa.

Sau khi triển khai: 1. Chạy typecheck hoặc lệnh kiểm tra tương đương
hiện có. 2. Báo các file đã tạo/sửa. 3. Ghi chính xác lệnh chạy mock
server và Next.js. 4. Nêu rõ những kiểm tra đã chạy; không báo test pass
nếu chưa thực sự chạy.

**Nguyên tắc:** Đây là ví dụ học tập để hiểu luồng WebSocket trong
React/Next.js, không phải thư viện realtime production-ready.
