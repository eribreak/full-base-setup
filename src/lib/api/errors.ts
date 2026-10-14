import { AxiosError, isAxiosError } from "axios"
import type { ApiErrorResponse } from "./types"

export class ApiError extends Error {
  public readonly statusCode: number
  public readonly code?: string
  public readonly details?: Record<string, unknown>
  public readonly isNetworkError: boolean
  public readonly isTimeout: boolean
  public readonly isCanceled: boolean

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    details?: Record<string, unknown>,
    isNetworkError = false,
    isTimeout = false,
    isCanceled = false
  ) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.isNetworkError = isNetworkError
    this.isTimeout = isTimeout
    this.isCanceled = isCanceled

    Object.setPrototypeOf(this, ApiError.prototype)
  }

  static fromAxiosError(error: AxiosError): ApiError {
    if (!isAxiosError(error)) {
      const message = (error as Error)?.message || "Unknown error"
      return new ApiError(
        message,
        0,
        "UNKNOWN_ERROR",
        undefined,
        true
      )
    }

    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return new ApiError(
        "Request timeout",
        408,
        "TIMEOUT",
        undefined,
        false,
        true
      )
    }

    if (error.code === "ERR_CANCELED") {
      return new ApiError(
        "Request canceled",
        0,
        "CANCELED",
        undefined,
        false,
        false,
        true
      )
    }

    if (!error.response) {
      return new ApiError(
        "Network error. Please check your connection.",
        0,
        "NETWORK_ERROR",
        undefined,
        true
      )
    }

    const responseData = error.response.data as ApiErrorResponse | undefined
    const message = responseData?.message || error.message || `HTTP ${error.response.status}`
    const code = responseData?.code || `HTTP_${error.response.status}`
    const details = responseData?.details

    return new ApiError(message, error.response.status, code, details)
  }

  static fromUnknown(error: unknown): ApiError {
    if (error instanceof ApiError) return error
    if (isAxiosError(error)) return ApiError.fromAxiosError(error)
    if (error instanceof Error) {
      return new ApiError(error.message, 0, "UNKNOWN_ERROR", undefined, true)
    }
    return new ApiError("An unknown error occurred", 0, "UNKNOWN_ERROR")
  }

  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500
  }

  get isServerError(): boolean {
    return this.statusCode >= 500
  }

  get isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403
  }

  get isNotFound(): boolean {
    return this.statusCode === 404
  }

  get isValidationError(): boolean {
    return this.statusCode === 422 || this.code === "VALIDATION_ERROR"
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function handleApiError(error: unknown): never {
  throw ApiError.fromUnknown(error)
}