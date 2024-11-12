import { HTTPHeaders, HTTPRequest } from "@/types/types";
import { Buffer } from "buffer";

const parseRequest = (data: Buffer): HTTPRequest => {
  // Convert Buffer to string
  const requestString = data.toString("utf-8");

  // Split request into lines
  const lines = requestString.split("\r\n");

  // Parse request line (first line)
  const [method, url, version] = decodeRequestLine(lines[0]);

  // Parse headers and find where body starts
  const { headers, bodyStartIndex } = decodeHeaders(lines.slice(1));

  // Parse body
  const body = decodeBody(lines.slice(bodyStartIndex + 1).join("\r\n"));

  return {
    method,
    url,
    version,
    headers,
    body,
  };
};

const decodeRequestLine = (line: string): [string, string, string] => {
  const parts = line.split(" ");
  if (parts.length !== 3) {
    throw new Error("Invalid request line format");
  }
  return [parts[0], parts[1], parts[2]];
};

const decodeMethode = (data: string): string => {
  const firstLine = data.split("\r\n")[0];
  const method = firstLine.split(" ")[0];

  if (!isValidMethod(method)) {
    throw new Error("Invalid HTTP method");
  }

  return method;
};

const isValidMethod = (method: string): boolean => {
  const validMethods = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "HEAD",
    "OPTIONS",
    "PATCH",
  ];
  return validMethods.includes(method);
};

const decodeURL = (data: string): string => {
  const firstLine = data.split("\r\n")[0];
  const url = firstLine.split(" ")[1];

  if (!url || url.length === 0) {
    throw new Error("Invalid URL");
  }

  return url;
};

const decodeVersion = (data: string): string => {
  const firstLine = data.split("\r\n")[0];
  const version = firstLine.split(" ")[2];

  if (!version?.startsWith("HTTP/")) {
    throw new Error("Invalid HTTP version");
  }

  return version;
};

const decodeHeaders = (
  lines: string[]
): { headers: HTTPHeaders; bodyStartIndex: number } => {
  const headers: HTTPHeaders = {};
  let bodyStartIndex = 0;

  // Find empty line that separates headers from body
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === "") {
      bodyStartIndex = i;
      break;
    }

    const [key, ...valueParts] = line.split(":");
    if (!key || valueParts.length === 0) {
      throw new Error("Invalid header format");
    }

    const value = valueParts.join(":").trim();
    headers[key.toLowerCase()] = value;
  }

  return { headers, bodyStartIndex };
};

const decodeBody = (data: string): string => {
  return data.trim();
};

export {
  parseRequest,
  decodeMethode,
  decodeURL,
  decodeVersion,
  decodeHeaders,
  decodeBody,
};
