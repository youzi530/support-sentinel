import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createSupportAgent } from "./agent.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const agent = createSupportAgent();
const contentTypes = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

const server = createServer(async (request, response) => {
  if (request.method === "POST" && request.url === "/api/chat") {
    let raw = "";
    for await (const chunk of request) raw += chunk;
    try {
      const { message, pendingAction, modelConfig } = JSON.parse(raw);
      if (typeof message !== "string" || !message.trim()) return sendJson(response, 400, { error: "message is required" });
      return sendJson(response, 200, await agent.respond({ message, pendingAction, modelConfig }));
    } catch {
      return sendJson(response, 400, { error: "invalid request" });
    }
  }

  const requestedPath = request.url === "/" ? "/index.html" : request.url;
  if (!requestedPath.startsWith("/") || requestedPath.includes("..")) return sendJson(response, 404, { error: "not found" });
  try {
    const file = join(root, "public", requestedPath);
    const content = await readFile(file);
    response.writeHead(200, { "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream" });
    response.end(content);
  } catch {
    sendJson(response, 404, { error: "not found" });
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Support Sentinel running at http://localhost:${port}`));
