import { HTTPHeaders } from "@/types/types";

// Common status codes and their messages
const StatusCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

const StatusMessages = {
  [StatusCodes.OK]: "OK",
  [StatusCodes.CREATED]: "Created",
  [StatusCodes.ACCEPTED]: "Accepted",
  [StatusCodes.NO_CONTENT]: "No Content",
  [StatusCodes.BAD_REQUEST]: "Bad Request",
  [StatusCodes.UNAUTHORIZED]: "Unauthorized",
  [StatusCodes.FORBIDDEN]: "Forbidden",
  [StatusCodes.NOT_FOUND]: "Not Found",
  [StatusCodes.INTERNAL_SERVER_ERROR]: "Internal Server Error",
  [StatusCodes.NOT_IMPLEMENTED]: "Not Implemented",
  [StatusCodes.BAD_GATEWAY]: "Bad Gateway",
  [StatusCodes.SERVICE_UNAVAILABLE]: "Service Unavailable",
} as const;
const createResponse = (
  statusCode: number,
  statusMessage: string,
  headers: HTTPHeaders = {},
  body: string = ""
): Buffer => {
  // Ensure headers contain Content-Length if there's a body
  if (body && !headers["content-length"]) {
    headers["content-length"] = Buffer.from(body).length.toString();
  }

  // Create status line
  const statusLine = `HTTP/1.1 ${statusCode} ${statusMessage}\r\n`;

  // Convert headers to string format
  const headerLines = Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\r\n");

  // Combine all parts with proper CRLF separators
  const response =
    statusLine +
    (headerLines ? headerLines + "\r\n" : "") +
    "\r\n" +
    (body || "");

  return Buffer.from(response);
};

export { createResponse, StatusCodes, StatusMessages };
