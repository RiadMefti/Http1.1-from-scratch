import assert from "assert";
import { Socket } from "net";

import { TCPServer } from "../app/server/server";
describe("TCPServer", () => {
  let server: TCPServer;
  const TEST_PORT = 3001;
  const TEST_HOST = "localhost";

  // Helper function to create a client connection
  const createClient = (): Promise<Socket> => {
    return new Promise((resolve, reject) => {
      const client = new Socket();
      client.connect(TEST_PORT, TEST_HOST, () => {
        resolve(client);
      });
      client.on("error", reject);
    });
  };

  // Helper function to send data and get response
  const sendData = (client: Socket, data: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      let response = "";

      client.on("data", (chunk) => {
        response += chunk;
      });

      client.on("end", () => {
        resolve(response);
      });

      client.on("error", reject);

      client.write(data);
    });
  };

  beforeEach(async () => {
    // Create a new server instance before each test
    server = TCPServer.createServer({ port: TEST_PORT, host: TEST_HOST });
    await server.start();
  });

  afterEach(async () => {
    // Clean up after each test
    await server.stop();
  });

  describe("Server Creation", () => {
    it("should create a singleton instance", () => {
      const server1 = TCPServer.createServer();
      const server2 = TCPServer.createServer();
      assert.strictEqual(
        server1,
        server2,
        "Server instances should be identical"
      );
    });

    it("should use default config when none provided", () => {
      const defaultServer = TCPServer.createServer();
      assert.ok(defaultServer, "Server should be created with default config");
    });
  });

  describe("Connection Handling", () => {
    it("should accept client connections", async () => {
      const client = await createClient();
      assert.strictEqual(
        client.connecting,
        false,
        "Client should be connected"
      );
      client.end();
    });

    
   
  });

  describe("Error Handling", () => {
    it("should handle server start on occupied port", async () => {
      const secondServer = TCPServer.createServer({
        port: TEST_PORT,
        host: TEST_HOST,
      });

      await assert.rejects(
        async () => {
          await secondServer.start();
        },
        Error,
        "Should reject when starting server on occupied port"
      );
    });
  });

  describe("Server Lifecycle", () => {
    it("should start and stop correctly", async () => {
      await server.stop();

      // Try to connect - should fail
      await assert.rejects(
        async () => {
          await createClient();
        },
        Error,
        "Should reject connection to stopped server"
      );

      // Restart server
      await server.start();

      // Should connect successfully now
      const client = await createClient();
      assert.strictEqual(
        client.connecting,
        false,
        "Client should connect to restarted server"
      );
      client.end();
    });
  });
});
