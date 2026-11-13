import { API_URL } from './config'
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokens'

export type FieldErrors = Record<string, string[]>

export class ApiError extends Error {
  status: number
  fieldErrors: FieldErrors

  constructor(status: number, message: string, fieldErrors: FieldErrors) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

type ErrorBody = {
  error?: string | FieldErrors
  detail?: string
}

// Our views send {"error": ...} and DRF itself sends {"detail": ...}
function readError(status: number, body: ErrorBody | null) {
  if (body && typeof body.error === 'string') {
    return new ApiError(status, body.error, {})
  }

  if (body && body.error && typeof body.error === 'object') {
    const fieldErrors = body.error
    let message = 'Please fix the errors below.'
    if (fieldErrors.non_field_errors) {
      message = fieldErrors.non_field_errors[0]
    }
    return new ApiError(status, message, fieldErrors)
  }

  if (body && typeof body.detail === 'string') {
    return new ApiError(status, body.detail, {})
  }

  return new ApiError(status, 'Something went wrong. Please try again.', {})
}

// The auth provider sets this so we can log the user out when their session runs out
let onSessionExpired = () => {}

export function setSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler
}

// Dashboards send a few requests at once. If they all get a 401 we only want
// one refresh call, because the server throws away the old refresh token after using it.
let refreshInProgress: Promise<boolean> | null = null

async function refreshAccessToken() {
  const refresh = getRefreshToken()
  if (!refresh) {
    return false
  }

  const response = await fetch(API_URL + '/accounts/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refresh }),
  })
  if (!response.ok) {
    return false
  }

  const data = await response.json()
  saveTokens(data.access, data.refresh || refresh)
  return true
}

function refreshOnce() {
  if (refreshInProgress === null) {
    refreshInProgress = refreshAccessToken().finally(() => {
      refreshInProgress = null
    })
  }
  return refreshInProgress
}

function sendRequest(method: string, path: string, body?: unknown) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getAccessToken()
  if (token) {
    headers['Authorization'] = 'Bearer ' + token
  }

  return fetch(API_URL + path, {
    method: method,
    headers: headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  let response = await sendRequest(method, path, body)

  // The access token only lasts a few minutes, so try to get a new one and retry once
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshOnce()
    if (refreshed) {
      response = await sendRequest(method, path, body)
    } else {
      clearTokens()
      onSessionExpired()
    }
  }

  if (response.status === 204) {
    return null as T
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    throw readError(response.status, data)
  }
  return data as T
}

export function apiGet<T>(path: string) {
  return request<T>('GET', path)
}

export function apiPost<T>(path: string, body: unknown) {
  return request<T>('POST', path, body)
}

export function apiPatch<T>(path: string, body: unknown) {
  return request<T>('PATCH', path, body)
}

export function apiDelete(path: string) {
  return request<null>('DELETE', path)
}

export function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }
  return 'Could not reach the server. Please check your connection.'
}
