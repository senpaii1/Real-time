const Websocket = require("ws");
const wss = new Websocket.Server({ port: 8000 });
const jwt = require("jsonwebtoken");

const chatrooms = new Map();
const userPresence = {};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      console.log("Invalid token");
    } else {
      console.log("Error verifying token:", error);
    }
    return null;
  }
};

wss.on("connection", (ws, req) => {
  console.log("Client connected");
  const token = req.url.split("?token=")[1];
  if (!token) {
    console.log("No authorization token available");
    ws.close();
    return;
  }

  // Verify JWT token and extract userId
  const tokenData = verifyToken(token);
  if (!tokenData) {
    console.log("Invalid or expired token. Closing connection.");
    ws.close();
    return;
  }
  const userId = tokenData.userId;
  if (!userId) {
    console.log("User ID not found in token. Closing connection.");
    ws.close();
    return;
  }
  // Set user online status
  userPresence[userId] = true;

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    try {
      const { room, text } = JSON.parse(message);
      const clients = chatrooms.get(room);
      clients.forEach((client) => {
        if (client !== ws) {
          client.send(JSON.stringify({ text }));
        }
      });
    } catch (error) {
      const messageBuffer = Buffer.from(message);
      const messageString = messageBuffer.toString().replace(/\n/g, "");
      console.log("Received plain text message:", messageString);
      // Handle plain text message
      // Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(messageString);
        }
      });
    }

    ws.on("close", () => {
      console.log("Client disconnected !");
      userPresence[userId] = false;
    });
  });
});
