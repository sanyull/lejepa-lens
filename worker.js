// Runs the model on the CPU (WebAssembly) off the main thread, so the camera preview stays smooth.
import * as ort from "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.1/dist/ort.wasm.min.mjs";
ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.1/dist/";

let session = null;
onmessage = async e => {
  const m = e.data;
  try {
    if (m.type === "init") {
      ort.env.wasm.numThreads = m.threads;
      session = await ort.InferenceSession.create(m.bytes, { executionProviders: ["wasm"] });
      postMessage({ type: "ready" });
    } else {
      const out = await session.run({ image: new ort.Tensor("float32", m.input, [1, 3, m.size, m.size]) });
      const feat = Float32Array.from(out.feat.data), attn = Float32Array.from(out.attn.data);
      postMessage({ type: "out", feat, attn }, [feat.buffer, attn.buffer]);
    }
  } catch (err) {
    postMessage({ type: "error", message: String(err && err.message || err) });
  }
};
