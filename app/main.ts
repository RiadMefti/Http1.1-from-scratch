// import * as net from "net";
import { TCPServer } from "./server/server";

const server = TCPServer.createServer({ port: 8080 });
server.start();
