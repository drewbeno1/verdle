import { serve } from "https://deno.land/std/http/server.ts";

const clients: Set<Response> = new Set();

async function startServer() {
  try {
    async function handler(req: Request): Promise<Response> {
      const url = new URL(req.url);
      
      if (url.pathname === "/live-reload") {
        const stream = new ReadableStream({
          start(controller) {
            const response = new Response(stream);
            clients.add(response);
            
            response.body?.pipeTo(new WritableStream()).catch(() => {
              clients.delete(response);
            });
          }
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      }

      if (url.pathname === "/main.js") {
        const js = await Deno.readTextFile("./main.js");
        return new Response(js, {
          headers: { "content-type": "application/javascript" },
        });
      }

      if (url.pathname === "/") {
        let html = await Deno.readTextFile("./index.html");
        
        // Inject live reload script before closing body tag
        const liveReloadScript = `
          <script>
            const events = new EventSource('/live-reload');
            events.onmessage = () => location.reload();
          </script>
        </body>`;
        
        html = html.replace("</body>", liveReloadScript);
        
        return new Response(html, {
          headers: { "content-type": "text/html" },
        });
      }

      return new Response("Not Found", { status: 404 });
    }

    const watcher = Deno.watchFs(["./index.html", "./main.js"]);
    
    (async () => {
      for await (const event of watcher) {
        if (event.kind === "modify") {
          console.log(`\x1b[33m${new Date().toLocaleTimeString()} - ${event.paths[0]} changed, reloading...\x1b[0m`);
          for (const client of clients) {
            const encoder = new TextEncoder();
            const stream = client.body?.getWriter();
            await stream?.write(encoder.encode("data: reload\n\n"));
          }
        }
      }
    })();

    console.clear();
    console.log("\x1b[32m%s\x1b[0m", "Server running! 🚀");
    console.log(`Visit http://localhost:8000`);
    console.log("Watching for file changes in index.html and main.js...");
    
    await serve(handler, { port: 8000 });
  } catch (error) {
    console.error("Server error:", error);
  }
}

await startServer();
