
export interface HTTPRequest {
  method: string;
  url: string;
  version: string;
  headers: HTTPHeaders;
  body: string;
}

export type HTTPHeaders = { [key: string]: string };
