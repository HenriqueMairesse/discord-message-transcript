# discord-message-transcript

Generate **JSON** or **HTML** transcripts from Discord channels with visual fidelity.

Designed for bots and backend services that need reliable message exports.

---

## 🧠 Use cases

This package is ideal for:

- 🎫 Ticket systems
- 🛡️ Moderation logs
- 🧾 Audit trails
- 💾 Channel backups

---

## 📦 Packages

This project provides two packages:

### `discord-message-transcript` (this package)

- Fetches messages directly from Discord
- Requires `discord.js`
- Outputs **HTML** or **JSON** transcripts
- Handles permissions, pagination, and message formatting

👉 **Most users should only install this package.**

---

### `discord-message-transcript-base`

- Renderer-only
- ❌ No `discord.js` dependency
- Converts transcript **JSON → HTML**
- Intended for:
  - Frontend rendering
  - Static sites
  - Post-processing stored transcripts

---

## ✨ Key features

- Discord-like rendering
- Single-file HTML output
- Lightweight JSON format
- Optional image embedding
- Optional CDN Upload (Can be custom)
- Markdown + syntax highlighting
- No tracking or telemetry

---

## 🔐 Permissions

The bot must have access to the channel and the following permissions:

- `ViewChannel`
- `ReadMessageHistory`

Required intents depend on context:
- DMs: `DirectMessages`
- Guild channels: `Guilds`, `GuildMessages`

---

## 🧪 Usage & API

### Installation

```bash
npm install discord-message-transcript
yarn add discord-message-transcript
pnpm add discord-message-transcript
```

### Functions

#### `createTranscript(channel, options)`
```ts
import { createTranscript } from "discord-message-transcript";

const transcript = await createTranscript(channel, {
  returnType: "attachment",
  returnFormat: "HTML"
});

await interaction.reply({ files: [transcript] });
```

#### `renderHTMLFromJSON(jsonString, options)`

```ts
import { renderHTMLFromJSON } from "discord-message-transcript";

const html = await renderHTMLFromJSON(jsonTranscriptString, {
  returnType: "string",
  selfContained: true
});
```

## ⚠️ Legal Notice

This project is not affiliated with Discord Inc.

You are responsible for ensuring compliance with:
- (Discord Developer Policy)[https://support-dev.discord.com/hc/en-us/articles/8563934450327-Discord-Developer-Policy]
- (Discord Terms of Service)[https://support-dev.discord.com/hc/en-us/articles/8562894815383-Discord-Developer-Terms-of-Service]
- (Discord Privacy Policy)[https://discord.com/privacy]
- Applicable laws and server rules

---

## 📜 License

Licensed under the **Apache License 2.0**.  
See the `LICENSE` file for more information.

---

## 🔗 Links

- GitHub: https://github.com/HenriqueMairesse/discord-message-transcript
- Issues: https://github.com/HenriqueMairesse/discord-message-transcript/issues
- Discord: https://discord.gg/4ACFdtRQMy