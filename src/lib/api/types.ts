export interface ApiErrorResponse {
  message: string
  code?: string
  statusCode: number
  details?: Record<string, unknown>
}

export interface ApiResponse<T> {
  data: T
  meta?: Record<string, unknown>
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

// Use a more flexible headers type that's compatible with Axios
export type Headers = Record<string, string | number | boolean | undefined> | undefined

export interface RequestConfig {
  method: HttpMethod
  url: string
  data?: unknown
  params?: Record<string, unknown>
  headers?: Headers
  timeout?: number
  signal?: AbortSignal
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface QueryParams {
  page?: number
  pageSize?: number
  sort?: string
  order?: "asc" | "desc"
  search?: string
  filters?: Record<string, unknown>
}