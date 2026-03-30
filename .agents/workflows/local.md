---
description: Switch to local-only mode using Ollama models
---

To use Antigravity entirely locally:

1. **Verify Ollama is Running**:
   Run `ollama ps` to ensure your models are loaded.

2. **Select Local Model**:
   - Open the Antigravity Settings (Cmd + ,).
   - Search for **Model Selection**.
   - Select `qwen2.5-coder:14b` from the local models list.

3. **Disable Cloud Tools**:
   I will prioritize using `mcp_ollama_` tools for reasoning and code generation to ensure performance remains high without an internet connection.

4. **Verify Connectivity**:
   // turbo
   Run `ollama list` in the terminal to confirm the bridge is active.
