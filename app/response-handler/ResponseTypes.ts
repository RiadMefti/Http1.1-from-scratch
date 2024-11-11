export interface HTTPResponse {
  statusCode: number;
  statusMessage: string;
  version: string;
  headers: HTTPHeaders;
  body: string;
}

export type HTTPHeaders = { [key: string]: string };
