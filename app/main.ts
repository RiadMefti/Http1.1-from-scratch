import { StatusCodes } from "@/response-handler/ResponseHandler";
import { TCPServer } from "@/server/server";

const server = TCPServer.createServer({ port: 3000 });
const router = server.getRouter();

// Register routes
router.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

router.get("/users", (req, res) => {
  const users = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ];
  res.json(users);
});

router.post("/users", (req, res) => {
  console.log("Creating a new user:", req.body);
  res.status(StatusCodes.CREATED).json({ message: "User created" });
});

// Start the server
server.start().catch(console.error);
