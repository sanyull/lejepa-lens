# LeJEPA Lens

Point your phone camera at the world and see, live, what a self-supervised vision model makes of it.

**Demo:** https://sanyull.github.io/lejepa-lens/

- **Colors** – the top three principal components of the patch features, shown as RGB. Patches with the same color are ones the model treats as the same kind of thing.
- **Touch** – tap anything; every patch the model finds similar stays lit.
- **Focus** – the attention of the model's summary token over the image.

Everything runs in the browser on your device (WebGPU, or WebAssembly as a fallback). No image leaves it.
The first visit downloads the model (about 43 MB with WebGPU, 23 MB otherwise).

## Credits

- Method: Balestriero and LeCun, "LeJEPA: Provable and Scalable Self-Supervised Learning Without the Heuristics", arXiv:2511.08544.
- Weights: [`OK-AI/lejepa-vits16-pretrain-in1k`](https://huggingface.co/OK-AI/lejepa-vits16-pretrain-in1k), a third-party ViT-S/16 reproduction trained on ImageNet-1k, released under Apache-2.0 (see `LICENSE-MODEL.txt`).
- Changes made to the weights: the backbone was exported to ONNX at 224 px and 160 px input with the input normalization folded in and the projector head dropped; `model_<size>.onnx` stores the weights as 16-bit floats (the arithmetic stays 32-bit), `model_q8_<size>.onnx` has its MatMul weights quantized to 8 bits.
- Runtime: [ONNX Runtime Web](https://onnxruntime.ai/), loaded from jsDelivr.
