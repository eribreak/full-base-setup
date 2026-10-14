import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios"
import type { RequestConfig, HttpMethod } from "./types"
import { ApiError } from "./errors"

const DEFAULT_TIMEOUT = 30000

function getBaseUrl(): string {
  return process.env.API_BASE_URL || ""
}

function createServerClient(): AxiosInstance {
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

let serverClient: AxiosInstance | null = null

export function getServerClient(): AxiosInstance {
  if (!serverClient) {
    serverClient = createServerClient()
  }
  return serverClient
}

export async function serverRequest<T>(config: RequestConfig): Promise<T> {
  const client = getServerClient()
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
export function serverGet<T>(url: string, params?: Record<string, unknown>, headers?: Record<string, string>): Promise<T> {
  return serverRequest<T>({ method: "GET" as HttpMethod, url, params, headers })
}

export function serverPost<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
  return serverRequest<T>({ method: "POST" as HttpMethod, url, data, headers })
}

export function serverPut<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
  return serverRequest<T>({ method: "PUT" as HttpMethod, url, data, headers })
}

export function serverPatch<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
  return serverRequest<T>({ method: "PATCH" as HttpMethod, url, data, headers })
}

export function serverDelete<T>(url: string, headers?: Record<string, string>): Promise<T> {
  return serverRequest<T>({ method: "DELETE" as HttpMethod, url, headers })
}

export const serverApi = {
  get: serverGet,
  post: serverPost,
  put: serverPut,
  patch: serverPatch,
  delete: serverDelete,
}