import { Server, Socket, createServer } from "net";

interface ServerConfig {
  port?: number;
  host?: string;
}

export class TCPServer {
  private static instance: TCPServer;
  private server: Server;
  private config: ServerConfig;

  private constructor(config: ServerConfig = {}) {
    this.config = {
      port: config.port || 3000,
      host: config.host || "localhost",
    };

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

  private handleConnection(socket: Socket): void {
    socket.on("data", (buffer: Buffer) => {
      try {
        console.log(buffer.toString());

        socket.end();
      } catch (error) {
        //TODO
        socket.end();
      }
    });

    socket.on("close", () => {
      //TODO
      socket.end();
    });

    socket.on("error", (error) => {
      //TODO
      socket.end();
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
