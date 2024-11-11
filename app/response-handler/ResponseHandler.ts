import { HTTPHeaders, HTTPResponse } from "./ResponseTypes";

const parseResponse = (data: Buffer): HTTPResponse => {
  // Convert buffer to string and split into lines
  const responseString = data.toString("utf8");
  const [statusLine, ...rest] = responseString.split("\r\n");

  // Parse status line
  const { statusCode, statusMessage, version } = parseStatusLine(statusLine);

  // Parse headers and find where body starts
  const { headers, bodyStartIndex } = parseHeaders(rest);

  // Parse body
  const body = parseBody(rest.slice(bodyStartIndex + 1).join("\r\n"));

  return {
    statusCode,
    statusMessage,
    version,
    headers,
    body,
  };
};

const parseStatusLine = (
  line: string
): {
  statusCode: number;
  statusMessage: string;
  version: string;
} => {
  const matches = line.match(/^(HTTP\/\d\.\d)\s+(\d{3})\s+(.*)$/);
  if (!matches) {
    throw new Error("Invalid status line format");
  }

  const [_, version, statusCode, statusMessage] = matches;
  return {
    version,
    statusCode: parseInt(statusCode, 10),
    statusMessage,
  };
};

const parseHeaders = (
  lines: string[]
): {
  headers: HTTPHeaders;
  bodyStartIndex: number;
} => {
  const headers: HTTPHeaders = {};
  let bodyStartIndex = 0;

  // Process each line until empty line (CRLF) is found
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === "") {
      bodyStartIndex = i;
      break;
    }

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      throw new Error("Invalid header format");
    }

    const key = line.slice(0, separatorIndex).toLowerCase().trim();
    const value = line.slice(separatorIndex + 1).trim();
    headers[key] = value;
  }

  return { headers, bodyStartIndex };
};

const parseBody = (data: string): string => {
  return data.trim();
};

const isValidStatusCode = (code: number): boolean => {
  return code >= 100 && code < 600;
};

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

export {
  createResponse,
  parseResponse,
  parseStatusLine,
  parseHeaders,
  parseBody,
  isValidStatusCode,
  StatusCodes,
  StatusMessages,
  HTTPResponse,
  HTTPHeaders,
};
