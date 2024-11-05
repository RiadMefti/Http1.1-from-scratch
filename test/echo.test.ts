import { strict as assert } from "assert";
import { NewRouter } from "../app/main.js";

describe("Echo Handler", () => {
  it("should echo back the path content with correct headers", () => {
    const buffer = Buffer.from("GET /echo/hello HTTP/1.1\r\n\r\n");
    const result = NewRouter(buffer);
    const expected =
      "HTTP/1.1 200 OK\r\n" +
      "Content-Type: text/plain\r\n" +
      "Content-Length: 5\r\n" +
      "Connection: close\r\n\r\n" +
      "hello";
    assert.strictEqual(result, expected);
  });

  it("should handle empty echo path correctly", () => {
    const buffer = Buffer.from("GET /echo/ HTTP/1.1\r\n\r\n");
    const result = NewRouter(buffer);
    const expected =
      "HTTP/1.1 200 OK\r\n" +
      "Content-Type: text/plain\r\n" +
      "Content-Length: 0\r\n" +
      "Connection: close\r\n\r\n" +
      "";
    assert.strictEqual(result, expected);
  });

  it("should return 404 for nested paths in echo", () => {
    const buffer = Buffer.from("GET /echo/nested/path HTTP/1.1\r\n\r\n");
    const result = NewRouter(buffer);
    assert.strictEqual(result, "HTTP/1.1 404 Not Found\r\n\r\n");
  });

  it("should echo content with special characters", () => {
    const buffer = Buffer.from("GET /echo/hello-world_123 HTTP/1.1\r\n\r\n");
    const result = NewRouter(buffer);
    const expected =
      "HTTP/1.1 200 OK\r\n" +
      "Content-Type: text/plain\r\n" +
      "Content-Length: 15\r\n" +
      "Connection: close\r\n\r\n" +
      "hello-world_123";
    assert.strictEqual(result, expected);
  });
});
