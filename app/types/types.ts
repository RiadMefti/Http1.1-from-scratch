export interface HTTPRequest {
  method: string;
  url: string;
  version: string;
  headers: HTTPHeaders;
  body: string;
}

export interface HTTPHeaders {
  [key: string]: string;
}
