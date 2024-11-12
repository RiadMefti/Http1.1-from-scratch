import {
  createResponse,
  StatusCodes,
  StatusMessages,
} from "@/response-handler/ResponseHandler";
import { HTTPRequest } from "@/types/types";
import { Socket } from "net";

// Types
type RouteHandler = (req: HTTPRequest, res: Response) => void | Promise<void>;
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

// Route interface
interface Route {
  method: HTTPMethod;
  path: string;
  handler: RouteHandler;
}

// Simple Response class
class Response {
  constructor(private socket: Socket) {}

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  send(body: string) {
    const response = createResponse(
      this.statusCode,
      StatusMessages[this.statusCode as keyof typeof StatusMessages],
      { "Content-Type": "text/plain" },
      body
    );
    this.socket.end(response.toString());
  }

  json(data: any) {
    const response = createResponse(
      this.statusCode,
      StatusMessages[this.statusCode as keyof typeof StatusMessages],
      { "Content-Type": "application/json" },
      JSON.stringify(data)
    );
    this.socket.end(response.toString());
  }

  private statusCode: number = StatusCodes.OK;
}

// Router class
export class Router {
  private routes: Route[] = [];

  // Register routes
  get(path: string, handler: RouteHandler): void {
    this.routes.push({ method: "GET", path, handler });
  }

  post(path: string, handler: RouteHandler): void {
    this.routes.push({ method: "POST", path, handler });
  }

  put(path: string, handler: RouteHandler): void {
    this.routes.push({ method: "PUT", path, handler });
  }

  delete(path: string, handler: RouteHandler): void {
    this.routes.push({ method: "DELETE", path, handler });
  }

  // Handle incoming request
  async handleRequest(request: HTTPRequest, socket: Socket): Promise<void> {
    const response = new Response(socket);

    // Find matching route
    const route = this.findRoute(request.method, request.url);

    if (!route) {
      response.status(StatusCodes.NOT_FOUND).send("Not Found");
      return;
    }

    try {
      await route.handler(request, response);
    } catch (error) {
      console.error("Route handler error:", error);
      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Internal Server Error");
    }
  }

  // Find matching route
  private findRoute(method: string, path: string): Route | undefined {
    return this.routes.find(
      (route) => route.method === method && this.matchPath(route.path, path)
    );
  }

  // Simple path matching
  private matchPath(routePath: string, requestPath: string): boolean {
    return routePath === requestPath;
  }
}
