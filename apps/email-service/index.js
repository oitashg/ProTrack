import "./src/client.js"
import "./src/queues.js"
import "./src/workers.js"
import http from "http";

// Start a tiny HTTP server just to bind to $PORT
const port = parseInt(process.env.PORT, 10) || 3000;
const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("OK");
  }
  res.writeHead(404).end();
});

server.listen(port, () => {
  console.log(`Email‑service listening on port ${port}`);
});