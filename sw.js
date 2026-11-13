// Adds the headers that make the page "cross-origin isolated". Browsers only allow multi-threaded
// WebAssembly on isolated pages, and a static host such as GitHub Pages cannot send these headers itself.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.cache === "only-if-cached" && req.mode !== "same-origin") return;
  e.respondWith(fetch(req).then(res => {
    if (res.status === 0) return res;                       // opaque response: leave untouched
    const h = new Headers(res.headers);
    h.delete("Content-Encoding");                           // the body here is already decompressed,
    h.delete("Content-Length");                             // so the compressed length no longer applies
    h.set("Cross-Origin-Embedder-Policy", "require-corp");
    h.set("Cross-Origin-Opener-Policy", "same-origin");
    h.set("Cross-Origin-Resource-Policy", "cross-origin");
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  }));
});
