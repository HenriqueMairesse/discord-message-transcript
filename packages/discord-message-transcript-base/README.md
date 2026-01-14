# discord-message-transcript-base

Renderer-only package used by `discord-message-transcript`.

Converts transcript **JSON → HTML**.

⚠️ Not intended for direct use by most users.

### Installation

```bash
npm install discord-message-transcript
yarn add discord-message-transcript
pnpm add discord-message-transcript
```

#### `renderHTMLFromJSON(jsonString, options)`

```ts
import { renderHTMLFromJSON } from "discord-message-transcript";

const html = await renderHTMLFromJSON(jsonTranscriptString, {
  returnType: "string",
  selfContained: true
});
```

---

Apache-2.0
