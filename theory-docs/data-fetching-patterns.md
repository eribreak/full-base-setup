# Các pattern fetch dữ liệu hiện đại

-   **Loại tài liệu:** Engineering Guide
-   **Trạng thái:** Tài liệu tham khảo cho frontend base
-   **Đối tượng:** Developer, reviewer và AI coding agent
-   **Phạm vi:** Request deduplication, optimistic update, streaming UI,
    stale-while-revalidate, smart polling
-   **Stack minh họa:** Next.js 16, React 19, TanStack Query v5

------------------------------------------------------------------------

## 1. Mục tiêu

Năm khái niệm trong tài liệu này thường xuất hiện cùng nhau khi xây dựng
giao diện tương tác với dữ liệu từ server. Chúng giải quyết những vấn đề
khác nhau:

| Khái niệm | Vấn đề giải quyết |
|---|---|
| Request deduplication | Nhiều component cùng gọi một API → trùng request, tốn bandwidth, server bị tải thừa |
| Optimistic update | Chờ server phản hồi khiến UI "đơ", người dùng phải nhìn loading spinner cho thao tác nhỏ |
| Streaming UI | Trang chỉ hiển thị sau khi có đủ mọi dữ liệu → slow first paint |
| Stale-while-revalidate | Dữ liệu cũ được phục vụ ngay, cập nhật ngầm → cân bằng tốc độ và độ tươi |
| Smart polling | Dữ liệu thay đổi phía server mà client không biết → cần đồng bộ mà không lãng phí tài nguyên |

Tài liệu giải thích từng khái niệm một cách độc lập, sau đó chỉ ra
chúng kết hợp với nhau như thế nào.

------------------------------------------------------------------------

## 2. Request deduplication (Khử trùng request)

### 2.1. Khái niệm

Request deduplication là kỹ thuật **gộp nhiều request giống nhau đang
diễn ra đồng thời thành một request thật duy nhất**, rồi phát lại kết
quả cho tất cả bên chờ.

"Giống nhau" thường được xác định bằng một **cache key**: ví dụ
`["users", page=1]`. Hai component cùng mount và cùng request
`GET /api/users?page=1` trong cùng một khoảng thời gian ngắn chỉ tạo ra
**một** call mạng.

### 2.2. Vấn đề cụ thể

Không dedup, một trang dashboard có 3 widget đều hiển thị danh sách
users:

``` text
Widget A  →  GET /api/users   (0ms)
Widget B  →  GET /api/users   (0ms)
Widget C  →  GET /api/users   (0ms)
```

3 request giống hệt nhau, 3 lần parse JSON, 3 lần render loading state.
Tệ hơn: trong React, StrictMode hoặc re-render có thể khiến effect chạy
hai lần, tự nhân đôi request.

### 2.3. Cách hoạt động

Ý tưởng: giữ một map `key → Promise đang chạy` (in-flight map).

``` ts
// Dedup thủ công — minh họa cơ chế, không phải code production.
const inFlight = new Map<string, Promise<unknown>>();

function dedupedFetch<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>; // ★ tái dùng Promise đang chạy

  const promise = loader().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}
```

Lần gọi đầu tạo Promise và lưu vào map. Lần gọi thứ hai, thứ ba thấy
Promise đã tồn tại nên chỉ "ké" kết quả — không có network call mới.

### 2.4. Với TanStack Query

`useQuery` làm việc này tự động: các observer dùng **cùng query key**
trong cùng một `QueryClient` chỉ chia sẻ một request và một cache entry.

``` tsx
// features/users/hooks/use-users.ts
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/features/users/api/get-users";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],          // ★ key chung → request chỉ xảy ra 1 lần
    queryFn: () => getUsers(),
    staleTime: 60_000,
  });
}
```

```tsx
// 3 component khác nhau, 3 hook call:
<UsersTable />     // useUsers()  ┐
<UsersStats />     // useUsers()  ├─ chỉ 1 network request
<UserPicker />     // useUsers()  ┘
```

### 2.5. Dedup ở tầng server (Next.js)

Trong Next.js App Router, nhiều component trên cùng một trang có thể
`await` cùng một dữ liệu. `fetch` của Next tự dedup trong một lần render
khi cùng URL và cùng options:

``` ts
// Server Component A và B cùng gọi:
const res = await fetch("https://api.example.com/users");
// → chỉ 1 request thật ra backend trong một render pass
```

Ngoài ra có thể dedup thủ công bằng `React.cache`:

``` tsx
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  return await db.user.findFirst({ where: { id: session.userId } });
});
// Mọi component gọi getCurrentUser() trong cùng request chỉ đọc DB 1 lần
```

**Lưu ý:** `fetch`/`cache` chỉ dedup trong phạm vi một server render.
Dedup giữa các browser, các người dùng là việc của cache server (CDN,
Redis...) — nằm ngoài phạm vi tài liệu.

------------------------------------------------------------------------

## 3. Optimistic update (Cập nhật lạc quan)

### 3.1. Khái niệm

Optimistic update là **cập nhật UI ngay khi người dùng thao tác, giả
định server sẽ chấp nhận**, thay vì chờ response. Nếu server trả lỗi
hoặc dữ liệu khác, UI **rollback** về trạng thái cũ.

### 3.2. Ví dụ người dùng cảm nhận được

Nút "like" bài viết:

``` text
Không optimistic:  bấm → spinner 300ms → icon đổi màu
Optimistic:         bấm → icon đổi màu ngay (0ms)
```

Với thao tác nhỏ và tỉ lệ lỗi thấp (like, bookmark, toggle, reorder,
rename), độ trễ round-trip là thời gian chết không cần thiết.

### 3.3. Code với TanStack Query

Kịch bản: thêm một task vào danh sách. Cache được cập nhật ngay, lỗi thì
 khôi phục.

``` tsx
// features/tasks/hooks/use-create-task.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Task = { id: string; title: string; done: boolean };

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) =>
      fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
      }).then((r) => r.json() as Promise<Task>),

    // 1.optimistic: đổi cache NGAY khi bấm
    onMutate: async (title) => {
      // Hủy các query đang refetch để không ghi đè cache của ta
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previous = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old = []) => [
        ...old,
        { id: crypto.randomUUID(), title, done: false }, // temp item
      ]);

      return { previous }; // context cho onError
    },

    // 2. rollback nếu mutation fail
    onError: (_err, _title, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks"], context.previous);
      }
    },

    // 3. dù succeed hay fail, đồng bộ lại với server thật
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
```

`onMutate` chạy trước `mutationFn`, nên UI update gần như tức thì.
`onSettled` đảm bảo temp id (randomUUID) được thay bằng entity thật từ
server.

### 3.4. UI hiển thị trạng thái "đang lưu"

Nên phân biệt "đang lưu" với "đã lưu" để người dùng biết dữ liệu chưa
an toàn:

```tsx
const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });
const createTask = useCreateTask();

{tasks.map((task) => (
  <li key={task.id} className={createTask.isPending ? "opacity-60" : ""}>
    {task.title}
  </li>
))}
```

### 3.5. Khi nào KHÔNG nên dùng

| Tình huống | Lý do |
|---|---|
| Thanh toán, chuyển tiền | Lỗi sau khi optimistic khiến người dùng tưởng đã xong |
| Server sinh ra dữ liệu phức tạp (validation, default, trigger) | UI tạm và dữ liệu thật chênh lệch nhiều → "nhảy" khó chịu |
| Tỉ lệ lỗi cao | Rollback liên tục tệ hơn chờ spinner |
| Hai user cùng mutate (collaborative) | Cần server-confirmed order hoặc CRDT, không phải optimistic đơn lẻ |

Quy tắc chọn: **thao tác đảo được (reversible) + tỉ lệ thành công cao +
delta nhỏ** → optimistic. Ngược lại → chờ server rồi update.

------------------------------------------------------------------------

## 4. Streaming UI

### 4.1. Khái niệm

Streaming UI là chiến lược **gửi và hiển thị giao diện theo từng phần**
thay vì chờ trang "chín" hết mới render. Server bắt đầu trả HTML sớm;
các phần chưa có dữ liệu được gửi dưới dạng skeleton, rồi được thay bằng
nội dung thật khi sẵn sàng.

Hai cơ chế trong Next.js App Router:

1.  **Suspense streaming**: `await` trong Server Component — phần dưới
    `fallback` hiển thị trước, phần chưa xong stream vào sau.
2.  **`renderToReadableStream` / AI SDK streaming**: hiển thị token của
    LLM khi chúng xuất hiện (hữu ích cho chat UI) — nằm ngoài phạm vi
    cốt lõi nhưng cùng tư tưởng.

### 4.2. Vấn đề cụ thể

Không streaming, một trang cần 3 nguồn dữ liệu (users: 100ms, stats:
400ms, activity: 1500ms) chỉ hiển thị sau 1500ms — vì `await` tuần tự
hoặc `Promise.all` chờ lâu nhất:

``` text
HTML bắt đầu  ─────────────────────► 1500ms: cả trang hiện ra
                    (blank page 1.5s)
```

Có streaming, khung trang + users có thể tới browser ở 100ms:

``` text
120ms: header + users table   (stats & activity là skeleton)
450ms: stats hiện vào
1550ms: activity hiện vào
```

### 4.3. Code Next.js App Router

```tsx
// app/dashboard/page.tsx — Server Component
import { Suspense } from "react";
import { UsersTable } from "@/features/users/components/users-table";
import { ActivityFeed } from "@/features/activity/components/activity-feed";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <UsersSection />

      {/* Phần chậm không chặn phần nhanh */}
      <Suspense fallback={<ActivitySkeleton />}>
        <ActivityFeed />
      </Suspense>
    </div>
  );
}

// Nhanh (100ms) — await trực tiếp
async function UsersSection() {
  const users = await fetch("/api/users").then((r) => r.json());
  return <UsersTable users={users} />;
}
```

```tsx
// features/activity/components/activity-feed.tsx — chậm (1.5s)
export async function ActivityFeed() {
  const items = await fetchSlowActivityService(); // await trong component
  return <Feed items={items} />;
}
```

React sẽ **flush shell (toàn bộ khung + phần đã xong) trước**, rồi
stream `<ActivityFeed>` vào khi resolve. Không cần JavaScript phía
client cho phần streaming — đó là HTML thật.

Kỹ thuật quan trọng: `await` **trong component**, không `await Promise.all`
ở page — nếu await all ở page, mọi phần cùng hiện ra một lúc (triệt tiêu
streaming).

### 4.4. Streaming UI phía client (TanStack Query)

Khái niệm "streaming" cũng dùng cho UI mà client nhận dữ liệu tăng dần:
ví dụ bảng kết quả load từng trang, timeline infinitescroll:

```tsx
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["activities"],
  queryFn: ({ pageParam }) => fetchActivities(pageParam),
  getNextPageParam: (last) => last.nextCursor,
});
// data xuất hiện "cuốn chiếu": trang 1 hiển thị, trang 2 được stream vào danh sách
```

### 4.5. Lợi và đánh đổi

-   Lợi: Time-to-First-Token/Byte và LCP tốt hơn; người dùng thấy nội
    dung sớm; phần chậm không kéo cả trang chết.
-   Đánh đổi: layout shift nếu skeleton sai kích thước; nước đôi khi
    trang cần dữ liệu của phần chậm để quyết định render phần nhanh;
    thêm ranh giới Suspense cần design skeleton nhất quán.

------------------------------------------------------------------------

## 5. Stale-while-revalidate (SWR)

### 5.1. Khái niệm

Stale-while-revalidate là chiến lược cache:

> **Phục vụ dữ liệu cũ (stale) ngay lập tức, đồng thời phát lại request
> nền để lấy dữ liệu mới (revalidate).**

Tên xuất phát từ header HTTP `Cache-Control: stale-while-revalidate=N`
([RFC 5861](https://datatracker.ietf.org/doc/html/rfc5861)). Đó cũng là
tên thư viện `swr` của Vercel — cùng một chiến lược, cùng cách gọi.

### 5.2. Vòng đời dữ liệu trong TanStack Query

Mọi cached query có 2 trạng thái thời gian, hiểu SWR là hiểu chúng:

``` text
fetch → cache
        │
        │◄── staleTime (vd 60s): data còn "fresh", đọc cache, KHÔNG refetch
        │
        ├── sau staleTime: data "stale" (cũ) — nhưng VẪN hiển thị
        │
        └── khi query được " dùng lại" (mount, window focus...) 
            → refetch ngầm → cache update → UI re-render
```

``` tsx
useQuery({
  queryKey: ["users"],
  queryFn: getUsers,
  staleTime: 60_000,        // fresh trong 60s
  gcTime: 5 * 60_000,       // giữ cache 5 phút sau khi không còn observer
});
```

### 5.3. Trải nghiệm người dùng

Người dùng mở tab Users (data stale), rồi điều hướng sang Settings, rồi
quay lại Users:

``` text
Không SWR (force fetch mỗi lần):
  Users → settings → Users: [skeleton 400ms] rồi mới hiện danh sách

Có SWR:
  Users → settings → Users: danh sách HIỆN NGAY (data cũ)
                            → data mới replace êm ái phía sau
```

Đây chính là **caching + deduplication (mục 2) khác biệt cốt lõi**:
dedup gộp request *đồng thời*, SWR tránh request *không cần thiết* khi
cache còn đủ mới.

### 5.4. SWR trên tầng HTTP/CDN

Cùng chiến lược áp dụng cho response header — CDN phục vụ bản cũ trong
khi goi origin cập nhật:

``` http
Cache-Control: public, s-maxage=60, stale-while-revalidate=300
```

-   0–60s: CDN trả bản fresh.
-   60–360s: CDN trả bản stale **ngay** và fetch origin ngầm để update.
-   Sau 360s: phải chờ origin.

Trong Next.js 16, chiến lược tương tự ở tầng server-side là
`cacheLife({ stale, revalidate, expire })` kết hợp `revalidateTag` /
`revalidatePath` để invalidate theo tag khi dữ liệu thay đổi (tương tự
ISR nhưng model cache Components). Ví dụ:

```tsx
import { cacheLife } from "next/cache";

export async function getUsers() {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 }); // 1p stale, 5p revalidate
  return db.query("SELECT * FROM users");
}
```

### 5.5. Khi nào không phù hợp

-   Dữ liệu phải luôn chính xác tuyệt đối khi hiển thị (số dư ngân
    hàng) → người dùng nhìn thấy số cũ 1 nhịp rồi nhảy số mới, có thể
    gây hiểu nhầm.
-   Refetch nền tốn kém cho dữ liệu ít thay đổi → tăng `staleTime`
    hoặc dùng polling có điều kiện (mục 6).

------------------------------------------------------------------------

## 6. Smart polling (Lấy dữ liệu theo điều kiện)

### 6.1. Khái niệm

Polling là client định kỳ hỏi server "có gì mới không?". **Smart
polling** là polling nhưng **tần suất được điều chỉnh theo tín hiệu thực
tế** thay vì một con số cố định:

-   Tab có đang được nhìn không (visible vs background)?
-   Dữ liệu có thay đổi gần đây không? (backoff khi im ắng)
-   Có kênh sự kiện (SSE/WebSocket) hoạt động không? (có thì khỏi poll)
-   Người dùng đang tương tác hay idle?
-   Mạng có ổn định không?

### 6.2. Code TanStack Query

TanStack Query hỗ trợ 2 cơ sở sẵn:

``` tsx
// 6.2.1 Interval polling
useQuery({
  queryKey: ["orders", orderId],
  queryFn: () => fetchOrder(orderId),
  refetchInterval: 2000,
  refetchIntervalInBackground: false, // ★ tab ẩn thì NGỪNG poll — đây là "smart" #1
});
```

Polling "thông minh" hơn: chỉ poll khi dữ liệu thật sự còn nóng. Ví dụ
chỉ poll đơn hàng đang ở trạng thái `processing`:

``` tsx
useQuery({
  queryKey: ["orders", orderId],
  queryFn: () => fetchOrder(orderId),
  refetchInterval: (query) => {
    const order = query.state.data;
    // Đã giao / đã hủy → không poll nữa (0 = tắt)
    return order?.status === "processing" ? 2000 : false;
  },
});
```

Đây chính là pattern "trạng thái máy" — poll cho tới khi sang trạng thái
cuối. Nó tiết kiệm hơn nhiều so với poll vô hạn định.

### 6.2.2 Focus polling — mặc định của TanStack Query

```tsx
useQuery({
  queryKey: ["users"],
  queryFn: getUsers,
  refetchOnWindowFocus: true, // quay lại tab → revalidate nếu stale
});
```

`refetchOnWindowFocus` về bản chất là SWR (mục 5) kết hợp tín hiệu
"người dùng quay lại" — một dạng smart trigger không cần interval.

### 6.3. Backoff lũy tiến khi API lỗi

``` tsx
refetchInterval: (query) => {
  if (query.state.status === "error") {
    // 2s → 4s → 8s... tối đa 30s, tránh spam server đang lỗi
    return Math.min(2_000 * 2 ** (query.state.dataUpdateCount ?? 0), 30_000);
  }
  return query.state.data?.status === "processing" ? 1_000 : false;
},
```

### 6.4. polling vs push

| | Polling | SSE/WebSocket (push) |
|---|---|---|
| Độ trễ | ≤ interval | Gần realtime |
| Hạ tầng | HTTP thường | Giữ kết nối, scale phức tạp hơn |
| Chi phí | Request "trả lời rỗng" lặp lại | Gần 0 khi không có event |
| Độ tin cậy | Tự hồi phục rất tốt | Cần reconnect logic, heartbeat |

**Smart polling trưởng thành nhất** là chiến lược lai:

``` text
WebSocket/SSE đang kết nối  →  KHÔNG poll (lắng nghe event)
Mất kết nối / fallback      →  poll interval ngắn
Tab ẩn                       →  poll interval dài hoặc dừng hẳn
Dữ liệu nguội dần (backoff)  →  tăng interval
```

Tuy nhiên: với đa số app nội bộ (admin, dashboard SaaS), **polling đơn
giản + focus + điều kiện dừng (6.2) là đủ**. Push là quyết định kiến
trúc riêng, chỉ khi có yêu cầu realtime thật.

------------------------------------------------------------------------

## 7. Các pattern ghép lại với nhau

Một trang "Orders" hoàn chỉnh dùng cả năm khái niệm:

``` tsx
// features/orders/components/orders-page.tsx
export function OrdersPage() {
  // (2) dedup: nhiều widget dùng key ["orders"] → 1 request
  // (5) SWR:  staleTime → mount lại không loading, chỉ revalidate ngầm
  // (6) smart polling: chỉ poll khi có đơn "processing", tab ẩn thì dừng
  const { data: orders = [], status, isFetching } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 30_000,
    refetchInterval: (q) =>
      q.state.data?.some((o: Order) => o.status === "processing") &&
      document.visibilityState === "visible"
        ? 3_000
        : false,
  });

  const cancelOrder = useCancelOrder(); // (3) optimistic update

  return (
    <>
      {isFetching && <RefreshingBar />} {/* dữ liệu đang được làm mới ngầm */}
      <OrderList orders={orders} onCancel={cancelOrder.mutate} />
    </>
  );
}
```

Và ở tầng trang (Next.js):

```tsx
// app/orders/page.tsx — (4) streaming UI: shell tới sớm, phần chậm vào sau
export default function OrdersLayout() {
  return (
    <>
      <OrdersPage />          {/* đọc cache nhanh */}
      <Suspense fallback={<TimelineSkeleton />}>
        <OrderTimeline />     {/* 1.5s, stream vào sau */}
      </Suspense>
    </>
  );
}
```

Tóm lại vai trò từng pattern trong một hệ:

``` text
dedup        →  chống lãng phí khi request (không trùng lặp lúc này lúc khác)
SWR          →  chống lãng phí khi đọc     (cache cũ vẫn phục vụ được)
streaming    →  chống chờ khi hiển  (shell trước, data sau)
optimistic   →  chống chờ khi thao tác (UI đi trước, server xác nhận sau)
smart polling→  chống mù khi dữ liệu nguội (tần suất theo tín hiệu)
```

------------------------------------------------------------------------

## 8. Ghi chú ra quyết định

1.  Đừng tự viết dedup cache — `useQuery` đã làm; chỉ cần giữ `queryKey`
    kỷ luật (mộc mạc, không nhét object không ổn định vào key).
2.  Optimistic update bắt buộc đi kèm rollback (`onError`) và
    reconcile (`onSettled`). Thiếu một trong hai là nguồn bug "UI nói
    dối".
3.  Streaming chỉ có nghĩa khi phần chậm **await trong component**,
    không phải await all ở page.
4.  `staleTime` là nút chỉnh SWR: `0` = luôn revalidate (mặc định),
    vô hạn / tắt focus refetch = gần như "cache tĩnh".
5.  Smart polling bắt đầu từ `refetchInterval` có điều kiện +
    `refetchIntervalInBackground: false`; thêm backoff khi có error; chỉ
    cân nhắc SSE/WebSocket khi requirement realtime thật sự.
