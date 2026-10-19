# Kiến trúc React hiện đại

-   **Loại tài liệu:** Architecture Decision / Engineering Guide
-   **Trạng thái:** Đề xuất mặc định cho frontend base
-   **Đối tượng:** Developer, reviewer và AI coding agent
-   **Phạm vi:** React Server Components, rendering strategies, React
    Compiler và feature-based architecture

------------------------------------------------------------------------

## 1. Mục tiêu

Tài liệu này quy định cách lựa chọn và sử dụng các cơ chế kiến trúc
React để frontend base có thể:

-   Dễ mở rộng và bảo trì.
-   Có ranh giới rõ giữa server và browser.
-   Chọn chiến lược render phù hợp với từng loại trang.
-   Tránh tối ưu hiệu năng quá sớm hoặc thêm độ phức tạp không cần
    thiết.
-   Có cấu trúc nhất quán để developer và AI coding agent triển khai
    feature mới.

Tài liệu không yêu cầu mọi dự án phải sử dụng mọi tính năng được đề cập.
Quyết định cuối cùng phải phù hợp với framework đã chọn, yêu cầu sản
phẩm và môi trường triển khai.

## 2. Nguyên tắc kiến trúc

1.  **Ưu tiên sự đơn giản:** Không thêm tầng kiến trúc hoặc dependency
    nếu chưa có nhu cầu rõ ràng.
2.  **Chọn framework trước, chọn pattern sau:** RSC và các chiến lược
    rendering tích hợp của Next.js không mặc nhiên áp dụng cho ứng dụng
    React + Vite SPA.
3.  **Phân biệt server state và client state:** Dữ liệu lấy từ backend,
    trạng thái tương tác UI và trạng thái URL cần có chủ sở hữu rõ ràng.
4.  **Tách theo feature/domain:** Code nghiệp vụ nên được gom theo chức
    năng, không chỉ theo loại file.
5.  **Đo trước khi tối ưu:** Không dùng memoization hoặc kỹ thuật tối ưu
    phức tạp chỉ dựa trên cảm giác.
6.  **Bảo mật theo ranh giới thực thi:** Code chạy ở server không tự
    động an toàn; mọi endpoint và thao tác nhạy cảm vẫn cần xác thực,
    phân quyền và kiểm tra dữ liệu.
7.  **Quy ước phải kiểm tra được:** Những quy tắc có thể kiểm tra bằng
    TypeScript, lint, test hoặc CI nên được tự động hóa.

## 3. React Server Components (RSC)

### 3.1. Khái niệm

React Server Components cho phép một component được render trong môi
trường server. Chúng có thể đọc dữ liệu tại server và không cần gửi phần
triển khai component đó xuống browser như một Client Component.

Trong Next.js App Router, page và layout là Server Components theo mặc
định. Client Components được dùng khi cần tương tác phía trình duyệt như
state, event handlers, effects hoặc API của browser.

RSC là cơ chế kiến trúc, không phải một chỉ thị để chuyển toàn bộ ứng
dụng sang server. Một trang có thể kết hợp Server Components và Client
Components.

### 3.2. Quy tắc sử dụng

**Ưu tiên Server Component khi:**

-   Component chủ yếu đọc dữ liệu và hiển thị nội dung.
-   Có thể truy cập dữ liệu an toàn từ server.
-   Không cần state hoặc event handler phía browser.
-   Muốn hạn chế JavaScript gửi đến client.

**Sử dụng Client Component khi cần:**

-   `useState`, `useReducer`, `useEffect` hoặc hook yêu cầu môi trường
    client.
-   Event handler như `onClick`, `onChange`.
-   API của browser như `window`, `document`, `localStorage`.
-   Thư viện tương tác phụ thuộc DOM hoặc browser.

Không thêm `"use client"` vào mọi file một cách mặc định. Hãy đặt ranh
giới client ở component nhỏ nhất có thể để phần còn lại tiếp tục tận
dụng server rendering.

### 3.3. Ví dụ với Next.js App Router

``` tsx
// app/users/page.tsx
// Server Component mặc định trong Next.js App Router.

import { UsersTable } from "@/features/users/components/users-table";
import { getUsers } from "@/features/users/api/get-users";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <main>
      <h1>Users</h1>
      <UsersTable users={users} />
    </main>
  );
}
```

Nếu bảng cần thao tác phía client, tách phần tương tác thành Client
Component:

``` tsx
// features/users/components/users-table.tsx
"use client";

import { useState } from "react";

type User = {
  id: string;
  name: string;
};

export function UsersTable({ users }: { users: User[] }) {
  const [query, setQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section>
      <label>
        Search users
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </section>
  );
}
```

Ví dụ trên chỉ minh họa ranh giới server/client. Với danh sách lớn hoặc
cần lọc/phân trang từ backend, nên cân nhắc xử lý query ở server/API
thay vì tải toàn bộ dữ liệu xuống browser.

### 3.4. Quy tắc bảo mật

-   Không đưa secret, private API key hoặc thông tin nhạy cảm vào props
    được serialize cho client.
-   Không xem việc dùng Server Component là cơ chế phân quyền.
-   Mọi thao tác đọc/ghi dữ liệu nhạy cảm phải xác thực và phân quyền
    tại server/API.
-   Không import module chỉ dành cho server vào Client Component.
-   Không truy cập `window`, `document` hoặc `localStorage` trong code
    có thể được thực thi ở server.
-   Chỉ đưa dữ liệu tối thiểu cần thiết qua ranh giới server/client.
-   Nếu dùng Server Actions, phải xem chúng như điểm gọi có thể bị
    request trực tiếp: xác thực, phân quyền và validate input ở phía
    server.

### 3.5. Khi không dùng RSC

Nếu dự án chọn React + Vite theo mô hình SPA, không cần bổ sung RSC chỉ
vì đây là xu hướng. Hãy sử dụng các cơ chế React client-side và gọi
backend qua API theo kiến trúc của dự án.

## 4. Rendering strategies

### 4.1. Các chiến lược

  -----------------------------------------------------------------------
  Chiến lược              Mô tả                   Trường hợp phù hợp
  ----------------------- ----------------------- -----------------------
  CSR                     Browser tải JavaScript  Dashboard, ứng dụng nội
                          và render giao diện     bộ, giao diện tương tác
                                                  cao

  SSR                     Server tạo HTML theo    Trang cần dữ liệu mới
                          request                 theo request hoặc HTML
                                                  ban đầu phù hợp SEO

  SSG                     HTML được tạo trước khi Landing page, tài liệu,
                          phục vụ                 nội dung ít thay đổi

  ISR / revalidation      Nội dung được tái tạo   Trang nội dung có thể
                          hoặc làm mới theo chính cache và cập nhật định
                          sách framework          kỳ

  Streaming               Gửi HTML theo từng phần Trang có vùng dữ liệu
                          khi nội dung sẵn sàng   tải độc lập hoặc tác vụ
                                                  chậm
  -----------------------------------------------------------------------

Tên gọi và hành vi cụ thể có thể khác nhau theo framework và phiên bản.
Với Next.js, cần tuân theo tài liệu chính thức của phiên bản đang dùng
thay vì giả định mọi route có cùng quy tắc cache/rendering.

### 4.2. Quy tắc chọn chiến lược

-   Chọn chiến lược đơn giản nhất đáp ứng yêu cầu sản phẩm.
-   Dashboard có xác thực không mặc nhiên cần SSR; CSR có thể là lựa
    chọn phù hợp.
-   Trang công khai cần SEO nên đánh giá SSR hoặc SSG.
-   Chỉ dùng caching/revalidation khi đã xác định độ mới dữ liệu được
    phép.
-   Không cache dữ liệu cá nhân hoặc dữ liệu theo quyền truy cập theo
    cách có thể làm lộ dữ liệu giữa người dùng.
-   Tách các vùng giao diện có thời gian tải khác nhau khi streaming
    thực sự cải thiện trải nghiệm.
-   Đo các chỉ số hiệu năng thực tế trước khi đổi chiến lược rendering.

### 4.3. Caching và dữ liệu người dùng

Caching là một quyết định về tính đúng đắn và bảo mật, không chỉ là tối
ưu tốc độ.

Trước khi bật cache, xác định:

-   Dữ liệu có công khai hay phụ thuộc người dùng?
-   Dữ liệu được phép cũ tối đa bao lâu?
-   Cache được chia theo key nào?
-   Khi cập nhật dữ liệu, cache được invalidated/revalidated ra sao?
-   Có nguy cơ trả dữ liệu của người dùng A cho người dùng B không?

Không dựa vào hành vi mặc định của framework để suy đoán chính sách
cache. Hành vi này có thể thay đổi theo phiên bản và cấu hình.

### 4.4. Loading, error và empty states

Mỗi feature tải dữ liệu cần có trải nghiệm rõ ràng cho các trạng thái:

-   Loading hoặc pending.
-   Thành công có dữ liệu.
-   Thành công nhưng không có dữ liệu.
-   Lỗi có thể thử lại.
-   Không có quyền truy cập.
-   Dữ liệu không còn tồn tại.

Trong Next.js App Router, có thể dùng các cơ chế route-level như
`loading.tsx`, `error.tsx` và `not-found.tsx` khi phù hợp. Trong SPA,
triển khai các trạng thái tương đương ở tầng route/feature.

## 5. React Compiler và tối ưu hiệu năng

### 5.1. Vai trò

React Compiler phân tích code React để tự động áp dụng nhiều tối ưu
memoization trong các trường hợp được hỗ trợ. Mục tiêu là giảm nhu cầu
thêm `useMemo`, `useCallback` hoặc `React.memo` thủ công một cách tràn
lan.

Compiler không thay thế việc thiết kế component hợp lý, giảm request
thừa, tối ưu truy vấn hoặc đo hiệu năng.

### 5.2. Quy tắc áp dụng

-   Kiểm tra phiên bản React, framework, build tool và hướng dẫn tích
    hợp chính thức trước khi bật.
-   Bật theo cấu hình được framework hỗ trợ; không tự thêm cấu hình chưa
    được xác minh.
-   Chạy lint, typecheck, unit test, E2E test và production build sau
    khi bật.
-   Đánh giá các thư viện quan trọng và các component có logic phức tạp.
-   So sánh hiệu năng trước/sau bằng dữ liệu đo được khi tối ưu hiệu
    năng là mục tiêu.
-   Giữ code dễ đọc; không viết code khó hiểu chỉ để "giúp compiler".
-   Chỉ dùng memoization thủ công khi có lý do rõ ràng, ví dụ API của
    thư viện yêu cầu identity ổn định hoặc phép tính tốn kém đã được đo.

### 5.3. Checklist trước khi bật

-   [ ] Phiên bản React và công cụ build được hỗ trợ.
-   [ ] Cấu hình dựa trên tài liệu chính thức hiện hành.
-   [ ] CI chạy thành công.
-   [ ] Các luồng quan trọng đã có test.
-   [ ] Không có regression quan sát được.
-   [ ] Có cách tắt hoặc rollback cấu hình nếu gặp vấn đề.

React Compiler là lựa chọn tối ưu hóa, không phải yêu cầu bắt buộc của
mọi dự án.

## 6. Feature-based architecture

### 6.1. Mục tiêu

Tổ chức code theo feature giúp nhóm các phần liên quan đến cùng một
nghiệp vụ lại với nhau, giảm sự phụ thuộc chéo và giúp agent dễ xác định
nơi cần thay đổi.

Cấu trúc khởi điểm đề xuất:

``` text
src/
├── app/                    # Routing, providers, cấu hình cấp ứng dụng
├── shared/
│   ├── ui/                 # UI primitives dùng chung
│   ├── lib/                # Utilities dùng chung
│   ├── hooks/              # Hooks dùng chung thực sự
│   ├── config/             # Cấu hình ứng dụng không chứa secret
│   └── types/              # Kiểu dữ liệu dùng chung
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── schemas/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   └── users/
│       ├── api/
│       ├── components/
│       ├── schemas/
│       ├── hooks/
│       ├── types/
│       └── index.ts
└── ...
```

Cấu trúc này là điểm bắt đầu, không phải yêu cầu tạo mọi thư mục cho mọi
feature. Chỉ tạo thư mục khi có nội dung thực sự cần đặt ở đó.

Với Next.js, route files có thể nằm trong `app/`, còn logic nghiệp vụ
vẫn đặt trong `features/`. Với Vite SPA, `app/` có thể chứa router và
cấu hình khởi tạo.

### 6.2. Trách nhiệm của từng vùng

**`app/`** - Khởi tạo ứng dụng. - Khai báo route và layout cấp ứng
dụng. - Đăng ký provider toàn cục. - Kết nối các feature vào route. -
Không chứa phần lớn logic nghiệp vụ.

**`shared/`** - Chỉ chứa code dùng chung giữa nhiều feature. - Không phụ
thuộc vào feature cụ thể. - Không trở thành nơi chứa mọi thứ chưa biết
đặt ở đâu.

**`features/<name>/`** - Chứa logic và UI thuộc một nghiệp vụ. - Sở hữu
schema, kiểu dữ liệu và API functions đặc thù của feature. - Hạn chế
import trực tiếp implementation nội bộ của feature khác. - Công khai
những API cần thiết qua public entry point khi dự án áp dụng quy tắc
này.

**`entities/` (tùy chọn)** - Chỉ thêm khi domain có mô hình nghiệp vụ
dùng chung đủ rõ. - Không bắt buộc cho base nhỏ hoặc ứng dụng đơn
giản. - Tránh tạo tầng entity chỉ để đổi tên các kiểu dữ liệu đơn giản.

### 6.3. Quy tắc phụ thuộc

Hướng phụ thuộc khuyến nghị:

-   `app` có thể kết nối `features` và `shared`.
-   `features` có thể sử dụng `shared`.
-   `shared` không phụ thuộc vào `features`.
-   Một feature không nên import sâu vào cấu trúc nội bộ của feature
    khác.
-   Nếu hai feature cần dùng chung logic, cân nhắc trích phần thực sự
    dùng chung ra module phù hợp thay vì tạo dependency vòng.

Ví dụ, ưu tiên:

``` tsx
import { UserSummary } from "@/features/users";
```

thay vì:

``` tsx
import { UserSummary } from "@/features/users/components/internal/user-summary";
```

Quy tắc public entry point có thể được áp dụng dần; không cần tạo barrel
file cho mọi thư mục nếu nó làm phức tạp dependency graph hoặc gây vấn
đề với build.

### 6.4. Quy ước cho feature mới

Khi tạo feature mới:

1.  Xác định nghiệp vụ và phạm vi sở hữu.
2.  Tạo thư mục tối thiểu cần thiết.
3.  Đặt API calls và schema gần feature sở hữu chúng, trừ khi API client
    là hạ tầng dùng chung.
4.  Tách UI dùng chung khỏi UI chỉ phục vụ feature.
5.  Định nghĩa loading, error, empty và success states.
6.  Thêm test cho logic và các luồng quan trọng.
7.  Không thêm global state nếu local state hoặc URL state đã đáp ứng.
8.  Không thêm dependency mới nếu các công cụ hiện có đáp ứng được yêu
    cầu.
9.  Cập nhật public API/documentation nếu feature được sử dụng từ nơi
    khác.
10. Chạy đầy đủ các lệnh kiểm tra của project.

### 6.5. Không lạm dụng kiến trúc

Tránh các dấu hiệu sau:

-   Mỗi component có nhiều lớp wrapper không mang lại giá trị.
-   Tạo `services`, `repositories`, `use-cases`, `adapters` cho mọi thao
    tác CRUD đơn giản mà không có yêu cầu.
-   Đưa tất cả logic vào `shared`.
-   Tạo một global store chứa toàn bộ dữ liệu server.
-   Tạo abstraction chỉ được dùng một lần và không giúp giảm độ phức
    tạp.
-   Tách module quá nhỏ khiến việc lần theo luồng xử lý khó hơn.

Bổ sung tầng kiến trúc khi có nhu cầu thực tế như nghiệp vụ phức tạp,
nhiều nguồn dữ liệu, quy tắc domain cần kiểm thử độc lập hoặc nhiều
feature cần dùng chung một năng lực.

## 7. Hướng dẫn cho AI coding agent

Khi thực hiện thay đổi trong frontend base, agent phải:

1.  Đọc quy ước kiến trúc và cấu trúc feature hiện có trước khi sửa.
2.  Xác định framework và môi trường thực thi của component.
3.  Với Next.js App Router, giữ Server Component mặc định và chỉ thêm
    `"use client"` khi có nhu cầu client thực sự.
4.  Không đưa secret hoặc logic phân quyền nhạy cảm vào client.
5.  Tuân thủ hướng phụ thuộc giữa `app`, `features` và `shared`.
6.  Tái sử dụng pattern hiện có trước khi tạo abstraction hoặc
    dependency mới.
7.  Không tự bật React Compiler hoặc thay đổi chiến lược
    caching/rendering nếu chưa có căn cứ và yêu cầu rõ ràng.
8.  Bổ sung hoặc cập nhật test cho hành vi thay đổi.
9.  Chạy lint, typecheck, test và build theo scripts của repository.
10. Báo rõ những kiểm tra chưa chạy được và nguyên nhân; không tuyên bố
    đã kiểm thử nếu chưa thực hiện.

## 8. Tiêu chí nghiệm thu

Một thay đổi tuân thủ tài liệu khi:

-   Ranh giới server/client đúng với framework được chọn.
-   Không có truy cập browser API trong code được thực thi ở server.
-   Không để lộ secret hoặc dữ liệu không cần thiết cho client.
-   Rendering và caching phù hợp với độ mới dữ liệu và yêu cầu bảo mật.
-   Feature có trách nhiệm rõ ràng và tuân thủ quy tắc phụ thuộc.
-   Có xử lý trạng thái loading, error và empty khi feature tải dữ liệu.
-   Không thêm dependency hoặc tầng kiến trúc không cần thiết.
-   Các kiểm tra tự động liên quan đều đạt hoặc có ngoại lệ được giải
    thích.
-   Tài liệu được cập nhật khi thay đổi quy ước kiến trúc.

## 9. Quyết định theo loại ứng dụng

  ----------------------------------------------------------------------------
  Loại dự án        RSC               Rendering              Kiến trúc
  ----------------- ----------------- ---------------------- -----------------
  React + Vite SPA  Không mặc định    Chủ yếu CSR            Feature-based

  Next.js,          Dùng khi phù hợp  Kết hợp server/client; Feature-based,
  dashboard có xác                    cân nhắc CSR cho phần  route trong
  thực                                tương tác              `app/`

  Website công khai Có thể tận dụng   Đánh giá               Feature-based
  cần SEO           với Next.js       SSR/SSG/revalidation   
                                      theo dữ liệu           

  Landing page hoặc Tùy framework     Ưu tiên SSG khi nội    Có thể đơn giản
  site nội dung                       dung phù hợp           hơn

  Ứng dụng lớn      Tùy framework     Theo yêu cầu từng      Feature-based;
  nhiều domain                        route                  thêm
                                                             domain/entity
                                                             layer khi cần
  ----------------------------------------------------------------------------

## 10. Tài liệu tham khảo chính thức

Các chi tiết về phiên bản, cấu hình compiler và hành vi rendering có thể
thay đổi. Trước khi triển khai, kiểm tra tài liệu phù hợp với phiên bản
dependency đang cài:

-   React Server Components:
    https://react.dev/reference/rsc/server-components
-   React Compiler: https://react.dev/learn/react-compiler
-   Next.js Server and Client Components:
    https://nextjs.org/docs/app/getting-started/server-and-client-components
-   Next.js Data Fetching:
    https://nextjs.org/docs/app/getting-started/fetching-data
-   Next.js Caching: https://nextjs.org/docs/app/guides/caching
-   Vite SSR: https://vite.dev/guide/ssr

------------------------------------------------------------------------

## Tóm tắt quyết định

-   **Bắt buộc:** kiến trúc theo feature, ranh giới phụ thuộc rõ ràng,
    quy tắc bảo mật server/client, loading/error states và kiểm tra tự
    động.
-   **Theo framework:** RSC và các cơ chế rendering tích hợp chỉ áp dụng
    khi framework hỗ trợ.
-   **Theo nhu cầu:** React Compiler, domain/entity layer và các tầng
    abstraction bổ sung.
-   **Không mặc định:** bật mọi chiến lược rendering, cache dữ liệu cá
    nhân, dùng global state cho mọi dữ liệu hoặc memoize mọi component.
