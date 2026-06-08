const WebSocket = require("ws");

// Use Render/Railway port if deployed, or 8080 locally
const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: PORT });

let esp32 = null;
let minecraft = null;

console.log("WebSocket server running on port " + PORT);

wss.on("connection", ws => {
  ws.on("message", msg => {
    const data = JSON.parse(msg);

    // Identify sender
    if (data.type === "esp32") {
      esp32 = ws;
      console.log("ESP32 connected");
      if (minecraft) minecraft.send(msg);
    }

    if (data.type === "minecraft") {
      minecraft = ws;
      console.log("Minecraft connected");
      if (esp32) esp32.send(msg);
    }
  });

  ws.on("close", () => {
    if (ws === esp32) esp32 = null;
    if (ws === minecraft) minecraft = null;
  });
});
