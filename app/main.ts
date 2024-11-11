import * as net from "net";

//types

// type HttpHeader = { [key: string]: string };
// type HttpBody = { [key: string]: string };
interface HttpRequest {
  method: string;
  target: string;
}
interface HttpReponse {
  status: string;
  contentType: string;
  contentLength: string;
  body: string;
}
// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (buffer: Buffer) => {
    socket.write(NewRouter(buffer));
    socket.end();
  });

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");

function response200(): string {
  return "HTTP/1.1 200 OK";
}

function response404(): string {
  return "HTTP/1.1 404 Not Found";
}

function HttpBufferToHttpRequest(buffer: Buffer): HttpRequest {
  let bufferString = buffer.toString();
  console.log(bufferString);
  let bufferStringArrayWithSpace = bufferString.split(" ");
  let bufferStringArray = bufferStringArrayWithSpace.filter(
    (str) => str.length > 0
  );

  let req: HttpRequest = {
    method: bufferStringArray[0],
    target: bufferStringArray[1],
  };

  return req;
}

function CreateHttpReponse(
  status: string,
  contentType: string,
  contentLength: string,
  body: string
) {
  const res: HttpReponse = {
    status,
    contentType,
    contentLength,
    body,
  };
  return res;
}

function HttpResponseObjToString(res: HttpReponse): string {
  const resString =
    `${res.status}\r\n` +
    `Content-Type: ${res.contentType}\r\n` +
    `Content-Length: ${res.contentLength}\r\n` +
    `Connection: close\r\n\r\n` +
    `${res.body}`;

  console.log(resString);
  return resString;
}

function Router(route: string): string {
  switch (true) {
    case route === "GET /":
      return response200() + "\r\n\r\n";

    case route.startsWith("GET /echo/"):
      return echoHandler(route);

    default:
      return response404() + "\r\n\r\n";
  }
}

function echoHandler(route: string): string {
  let substringToRemove = "GET /echo/";

  let query = route.replace(substringToRemove, "");
  if (query.includes("/")) return response404() + "\r\n\r\n";
  const resObj = CreateHttpReponse(
    response200(),
    "text/plain",
    query.length.toString(),
    query
  );

  return HttpResponseObjToString(resObj);
}

export function NewRouter(buffer: Buffer): string {
  const req = HttpBufferToHttpRequest(buffer);
  return Router(`${req.method} ${req.target}`);
}
