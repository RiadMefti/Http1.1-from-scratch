import { strict as assert } from "assert";
import { NewRouter } from "../app/main.js";

describe("Request Parsing", () => {
  it("should handle malformed requests correctly", () => {
    const buffer = Buffer.from("INVALID");
    const result = NewRouter(buffer);
    assert.strictEqual(result, "HTTP/1.1 404 Not Found\r\n\r\n");
  });

  it("should handle requests with extra whitespace", () => {
    const buffer = Buffer.from("GET    /    HTTP/1.1\r\n\r\n");
    const result = NewRouter(buffer);
    assert.strictEqual(result, "HTTP/1.1 200 OK\r\n\r\n");
  });
  it("should set correct content length for unicode characters", () => {
    const buffer = Buffer.from("GET /echo/héllo HTTP/1.1\r\n\r\n");
    const result = NewRouter(buffer);
    const expected =
      "HTTP/1.1 200 OK\r\n" +
      "Content-Type: text/plain\r\n" +
      "Content-Length: 5\r\n" +
      "Connection: close\r\n\r\n" +
      "héllo";
    assert.strictEqual(result, expected);
  });
});
