// src/common/http/response.ts
import { currentRequest } from 'encore.dev'; // optional untuk traceId

export interface BaseMeta {
  status: number;
  message: string;
  traceId?: string;
  timestamp?: string;
  // Pagination fields (optional)
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: BaseMeta;
}

export interface DeleteResponse {
  success: boolean;
}

/**
 * Success response wrapper
 */
export function okResponse<T>(
  data: T,
  overrideMeta: Partial<BaseMeta> = {},
): ApiResponse<T> {
  const traceId = currentRequest()?.requestID || 'unknown';
  return {
    data,
    meta: {
      status: 200,
      message: 'success',
      traceId,
      timestamp: new Date().toISOString(),
      ...overrideMeta,
    },
  };
}

/**
 * Paginated response wrapper
 */
export function paginatedResponse<T>(
  data: T,
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  extraMeta: Partial<BaseMeta> = {},
): ApiResponse<T> {
  return okResponse(data, {
    ...pagination,
    message: 'success',
    ...extraMeta,
  });
}

/**
 * Error response wrapper
 */
export function errorResponse<T>(
  statusCode: number,
  message: string,
  extraMeta: Partial<BaseMeta> = {},
): ApiResponse<T> {
  const traceId = currentRequest()?.requestID || 'unknown';
  return {
    data: null as T,
    meta: {
      status: statusCode,
      message,
      traceId,
      timestamp: new Date().toISOString(),
      ...extraMeta,
    },
  };
}

/**
 * Delete success (convenience)
 */
export function deleteOkResponse(): ApiResponse<{ success: true }> {
  return okResponse({ success: true }, { message: 'deleted' });
}
