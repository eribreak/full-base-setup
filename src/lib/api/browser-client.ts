import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios"
import type { RequestConfig, HttpMethod } from "./types"
import { ApiError } from "./errors"

const DEFAULT_TIMEOUT = 30000

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || ""
  }
  return process.env.API_BASE_URL || ""
}

function createBrowserClient(): AxiosInstance {
  const baseURL = getBaseUrl()

  const client = axios.create({
    baseURL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      return config
    },
    (error) => Promise.reject(ApiError.fromUnknown(error))
  )

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => Promise.reject(ApiError.fromAxiosError(error))
  )

  return client
}

let browserClient: AxiosInstance | null = null

export function getBrowserClient(): AxiosInstance {
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}

export async function browserRequest<T>(config: RequestConfig): Promise<T> {
  const client = getBrowserClient()
  try {
    const response = await client.request<T>({
      method: config.method,
      url: config.url,
      data: config.data,
      params: config.params,
      headers: config.headers as Record<string, string> | undefined,
      timeout: config.timeout,
      signal: config.signal,
    })
    return response.data
  } catch (error) {
    throw ApiError.fromUnknown(error)
  }
}

// Simple wrapper functions that don't spread config
export function browserGet<T>(url: string, params?: Record<string, unknown>, headers?: Record<string, string>): Promise<T> {
  return browserRequest<T>({ method: "GET" as HttpMethod, url, params, headers })
}

export function browserPost<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
  return browserRequest<T>({ method: "POST" as HttpMethod, url, data, headers })
}

export function browserPut<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
  return browserRequest<T>({ method: "PUT" as HttpMethod, url, data, headers })
}

export function browserPatch<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
  return browserRequest<T>({ method: "PATCH" as HttpMethod, url, data, headers })
}

export function browserDelete<T>(url: string, headers?: Record<string, string>): Promise<T> {
  return browserRequest<T>({ method: "DELETE" as HttpMethod, url, headers })
}

export const browserApi = {
  get: browserGet,
  post: browserPost,
  put: browserPut,
  patch: browserPatch,
  delete: browserDelete,
}