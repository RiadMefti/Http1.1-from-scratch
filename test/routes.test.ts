import { strict as assert } from "assert";
import { NewRouter } from "../app/main.js";

describe("Basic Route Handling", () => {
  it("should return 200 OK for root path", () => {
    const buffer = Buffer.from("GET / HTTP/1.1\r\n\r\n");
    const result = NewRouter(buffer);
    assert.strictEqual(result, "HTTP/1.1 200 OK\r\n\r\n");
  });

  it("should return 404 Not Found for unknown path", () => {
    const buffer = Buffer.from("GET /unknown HTTP/1.1\r\n\r\n");
    const result = NewRouter(buffer);
    assert.strictEqual(result, "HTTP/1.1 404 Not Found\r\n\r\n");
  });
});
