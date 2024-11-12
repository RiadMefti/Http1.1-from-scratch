import { parseRequest } from "@/request-handler/RequestHandler";
import { Router } from "@/route/router";
import { createServer, Server, Socket } from "net";

interface ServerConfig {
  port?: number;
  host?: string;
}

export class TCPServer {
  private static instance: TCPServer;
  private server: Server;
  private config: ServerConfig;
  private router: Router;

  private constructor(config: ServerConfig = {}) {
    this.config = {
      port: config.port || 3000,
      host: config.host || "localhost",
    };

    this.router = new Router();
    this.server = createServer((socket: Socket) => {
      this.handleConnection(socket);
    });
  }

  public static createServer(config: ServerConfig = {}): TCPServer {
    if (!TCPServer.instance) {
      TCPServer.instance = new TCPServer(config);
    }
    return TCPServer.instance;
  }

  // Get router instance for registering routes
  public getRouter(): Router {
    return this.router;
  }

  private handleConnection(socket: Socket): void {
    socket.on("data", async (buffer: Buffer) => {
      try {
        const request = parseRequest(buffer);
        await this.router.handleRequest(request, socket);
      } catch (error) {
        console.error("Request handling error:", error);
        socket.destroy(new Error("Invalid request"));
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      socket.destroy(error);
    });

    socket.on("close", () => {

    });

    socket.on("error", (error) => {
      // Log the error and destroy the socket
      console.error("Socket error:", error);
      socket.destroy(error);
    });
  }

  //Starting the server listening on the specified port and host
  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.config.port, this.config.host, () => {
        console.log(
          `Server listening on ${this.config.host}:${this.config.port}`
        );
        resolve();
      });

      this.server.on("error", (error) => {
        reject(error);
      });
    });
  }

  //Stop the server
  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}
