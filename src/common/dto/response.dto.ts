export interface ResponseMeta {
  status: number;
  message: string;
  [key: string]: any;
}

export interface GlobalResponse<T = any> {
  data: T | null;
  meta: ResponseMeta;
}
