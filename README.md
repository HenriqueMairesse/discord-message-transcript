# discord-message-transcript

🌍 Read this document in:
- 🇧🇷 [Português](README.pt-BR.md)

A modular library for exporting Discord messages into **JSON** or **HTML** transcripts, with visual fidelity and long-term archival support.

---

## 📖 Table of Contents
> Click any section to jump directly to it.

- [discord-message-transcript](#discord-message-transcript)
  - [📖 Table of Contents](#-table-of-contents)
  - [📦 Project Structure](#-project-structure)
    - [`discord-message-transcript` (main package)](#discord-message-transcript-main-package)
    - [`discord-message-transcript-base` (renderer-only)](#discord-message-transcript-base-renderer-only)
  - [✨ Features](#-features)
  - [🧩 Supported Content](#-supported-content)
  - [🔦 Syntax Highlighting](#-syntax-highlighting)
  - [🖼️ Files \& Long-Term Archival](#️-files--long-term-archival)
    - [`saveImages`](#saveimages)
    - [`cdnOptions`](#cdnoptions)
  - [🔢 Message Control \& Cleanup](#-message-control--cleanup)
  - [🧪 Usage \& API](#-usage--api)
    - [Installation](#installation)
    - [Functions](#functions)
      - [`createTranscript(channel, options)`](#createtranscriptchannel-options)
      - [`renderHTMLFromJSON(jsonString, options)`](#renderhtmlfromjsonjsonstring-options)
  - [⚙️ Performance \& Parallel Processing (Advanced)](#️-performance--parallel-processing-advanced)
  - [🔐 Permissions \& Access](#-permissions--access)
  - [⚠️ Legal Notice, Discord Policies \& User Responsibility](#️-legal-notice-discord-policies--user-responsibility)
    - [Important Notice](#important-notice)
    - [User Responsibility \& Compliance](#user-responsibility--compliance)
  - [🛡️ Privacy \& Data Handling](#️-privacy--data-handling)
  - [📜 License](#-license)
  - [💬 Support, Contact \& Contributions](#-support-contact--contributions)
    - [Support \& Questions](#support--questions)
    - [Feature Requests](#feature-requests)
    - [Contributions](#contributions)


## 📦 Project Structure

This repository is a **pnpm monorepo** containing two npm packages:

### `discord-message-transcript` (main package)

- Depends on `discord.js`
- Uses `discord-message-transcript-base`
- Fetches messages directly from Discord channels
- Converts messages into a structured **JSON transcript**
- Can export transcripts as:
  - **JSON**
  - **HTML**
- Intended for:
  - Bots
  - Ticket systems
  - Moderation logs
  - Channel message backups

---

### `discord-message-transcript-base` (renderer-only)

- ❌ No dependency on `discord.js`
- Converts transcript **JSON → HTML**
- Designed for environments without Discord access:
  - Websites
  - Frontend applications
  - Static hosting
- Ideal for storing lightweight `.json` files and rendering them later

This separation keeps Discord data collection and rendering fully decoupled.

---

## ✨ Features

- Discord-like rendering
- Single-file HTML output (HTML + CSS + JS)
- Lightweight intermediate JSON format
- Fully customizable export options
- Optional image embedding or CDN upload for long-term storage
- Markdown rendering with syntax highlighting
- No external services
- No tracking, telemetry, or analytics

---

## 🧩 Supported Content

Transcripts can include:

- Discord Markdown (bold, italic, underline, headings, block quotes, code blocks, etc.)
- Embeds
- Components v1
- Components v2
- Polls
- Attachments
- Reactions

---

## 🔦 Syntax Highlighting

The generated HTML uses **[highlight.js](https://highlightjs.org/)** to provide syntax highlighting for code blocks.

- This is the **only external resource** used
- Included via a CDN link in the generated HTML
- Loaded **only at render time**
- Not required for JSON generation
- Syntax highlighting is performed **entirely client-side**

---

## 🖼️ Files & Long-Term Archival

By default, transcripts reference Discord CDN URLs for assets like images, avatars, and attachments. These URLs can expire over time, causing assets to break. To ensure long-term archival, the package provides two solutions: `saveImages` and `cdnOptions`.

### `saveImages`
When `saveImages: true`, all images (excluding GIFs) are downloaded and embedded directly into the HTML file as Base64 data.
- ✅ **Pros:** Guarantees images will always load, fully self-contained.
- ❌ **Cons:** Significantly increases the final file size.

### `cdnOptions`
This allows you to automatically upload all assets (images, videos, audio, etc.) to your own Content Delivery Network (CDN), replacing the Discord URLs with your own.
- ✅ **Pros:** Guarantees long-term availability without bloating the file size. The most robust solution for archival.
- ❌ **Cons:** Requires configuration of a third-party CDN service.

If neither option is used, transcripts will still function correctly but will rely on Discord's original URLs, which may not be suitable for permanent storage.

Note: When cdnOptions exists, saveImages will be ignored!

---

## 🔢 Message Control & Cleanup

- The number of exported messages can be customized with the `quantity` option.
- Empty messages can be automatically removed by setting `includeEmpty: false` (Default). This removes:
  - Messages that become empty after filtering content (e.g., removing attachments).
  - Messages with unsupported or removed elements.

This ensures clean and readable transcripts.

---

## 🧪 Usage & API

### Installation

```bash
# For the main package (requires discord.js)
npm install discord-message-transcript
yarn add discord-message-transcript
pnpm add discord-message-transcript

# For the base package (renderer-only)
npm install discord-message-transcript-base
yarn add discord-message-transcript-base
pnpm add discord-message-transcript-base
```

### Functions

#### `createTranscript(channel, options)`

Fetches messages from a Discord channel and generates a transcript. This is the main function of the library.

-   **`channel`**: The Discord channel to fetch messages from.
-   **`options`**: An object to customize the transcript generation. All properties are optional.

**Basic Example:**
```javascript
const { createTranscript } = require('discord-message-transcript');

const channel = // your discord.js channel object
const attachment = await createTranscript(channel);

channel.send({
    files: [attachment],
});
```

**Options Reference:**

- `fileName`: The name of the file to be generated. (Default: `Transcript-{channel-name}-{channel-id}`)
- `quantity`: The maximum number of messages to fetch. (Default: `0` - all messages)
- `returnFormat`: The format of the transcript (`ReturnFormat.HTML` or `ReturnFormat.JSON`). (Default: `ReturnFormat.HTML`)
- `returnType`: The format to return the transcript in (`ReturnType.Attachment`, `String`, `Buffer`, etc.). (Default: `Attachment`)
- `saveImages`: Whether to embed images as Base64. (Default: `false`)
- `selfContained`: Whether to include all assets (CSS, JS) in a single HTML file. (Default: `false`)
- `watermark`: Whether to include the "Transcript generated by..." watermark. (Default: `true`)
- `localDate` / `timeZone`: For date and time formatting.
- `include...`: A set of boolean flags (`includeAttachments`, `includeEmbeds`, etc.) to control which message elements are included. (Default: `true` for all)
- `cdnOptions`: An object for configuring CDN uploads. See below for details.

---

**`cdnOptions` Examples**

The `cdnOptions` object allows you to automatically upload assets to a CDN.

**Common Properties:**
These booleans control which file types are uploaded. If omitted, they default to `true`.
- `includeImage`: Upload standard images (PNG, JPEG, WEBP).
- `includeVideo`: Upload videos and GIFs.
- `includeAudio`: Upload audio files.
- `includeOthers`: Upload any other file type.

**Provider: Cloudinary**
```javascript
const options = {
    cdnOptions: {
        provider: 'CLOUDINARY',
        includeImage: true,
        cloudName: 'your-cloud-name',
        apiKey: 'your-api-key',
        apiSecret: 'your-api-secret',
    }
};
```

**Provider: Uploadcare**
```javascript
const options = {
    cdnOptions: {
        provider: 'UPLOADCARE',
        includeImage: true,
        includeVideo: true,
        publicKey: 'your-public-key',
    }
};
```

**Provider: Custom**
You can provide your own asynchronous upload function.
```javascript
// Your custom upload function
async function myUploader(url, contentType, customData) {
    console.log(`Uploading ${url} of type ${contentType}`);
    console.log(`Custom data received: ${customData.welcomeWorld}`);

    // ... your upload logic here ...
    const newUrl = `https://my.cdn.com/path/to/new/asset`;

    return newUrl;
}

const options = {
    cdnOptions: {
        provider: 'CUSTOM',
        includeImage: true,
        resolver: myUploader,
        customData: { welcomeWorld: 'Hi!' } // Optional: pass any data to your resolver
    }
};
```

---

#### `renderHTMLFromJSON(jsonString, options)`

Converts a JSON transcript string to an HTML transcript. This function is available in both `discord-message-transcript` and the lighter `discord-message-transcript-base` package.

-   **`jsonString`**: The JSON transcript string.
-   **`options`**: An object to customize rendering (`returnType`, `selfContained`, `watermark`).

---

## ⚙️ Performance & Parallel Processing (Advanced)

To generate transcripts quickly, this library performs network-intensive operations in parallel. This includes:
- Uploading assets to a CDN.
- Downloading images to convert to Base64 (`saveImages`).

By default, the library will perform up to **12 CDN operations** and **6 Base64 conversions** simultaneously. While this is fast, it can be resource-intensive. You can control this behavior to reduce network/CPU load or avoid rate limits.

**How to Control Concurrency:**

Import and call `setCDNConcurrency` or `setBase64Concurrency` at the start of your application.

```javascript
import { createTranscript, setCDNConcurrency, setBase64Concurrency } from 'discord-message-transcript';

// Set the maximum number of concurrent CDN uploads to 5
setCDNConcurrency(5);

// Set the maximum number of concurrent Base64 conversions to 3
setBase64Concurrency(3);

// Now, when you call createTranscript, it will respect these limits.
async function generate(channel) {
    const transcript = await createTranscript(channel, {
        saveImages: true,
        // ... other options
    });

    // ...
}
```

---

## 🔐 Permissions & Access

- The bot must be logged in.
- No privileged intents are required.
- **Required Intents by Context:**
  - Direct Messages (DMs / Group DMs): `DirectMessages`
  - Guild Channels: `Guilds`, `GuildMessages`

- Supported channels:
  - Guild text channels
  - Threads
  - Private messages
  - Group DMs

Messages are accessed **only** from channels where:
- The bot has explicit access, such as Direct Messages or Group DMs where it is a participant
- The bot has permission to:
  - `ViewChannel`
  - `ReadMessageHistory`

---

## ⚠️ Legal Notice, Discord Policies & User Responsibility

This project is **not affiliated with, endorsed by, or maintained by Discord Inc.** Discord is a trademark of Discord Inc.

The visual appearance of generated transcripts is **independently implemented** and **inspired by Discord’s user interface**, with the goal of providing familiarity and readability.

This library accesses message data **exclusively through the official Discord API**.

### Important Notice

- This library **does not automatically redistribute, publish, or share** any content.
- All transcripts are generated **only at the explicit request of the user**.
- Exported message content is obtained **solely from channels where the bot has permission to read message history**
- Any storage, sharing, publication, or redistribution of generated transcripts, this includes any file that was uploaded to your configured CDN if used, is **entirely the responsibility of the user**

### User Responsibility & Compliance

While this project is designed to operate using the official Discord API and to respect Discord’s published rules, **it does not guarantee that every possible use case is compliant with Discord’s policies**.

By using this project, you acknowledge that you are responsible for ensuring compliance with:
1. **Discord Developer Policy**  
   https://support-dev.discord.com/hc/en-us/articles/8563934450327-Discord-Developer-Policy

2. **Discord Developer Terms of Service**  
   https://support-dev.discord.com/hc/en-us/articles/8562894815383-Discord-Developer-Terms-of-Service

3. **Discord Privacy Policy**  
   https://discord.com/privacy

4. Applicable local laws and regulations  

5. Server-specific rules and user consent requirements, where applicable
The maintainers of this project are **not responsible** for how generated transcripts and files uploaded to the CDN are stored, shared, published, or otherwise used.

---

## 🛡️ Privacy & Data Handling

- No data is stored remotely by this project.
- No data is transmitted to third parties (except for your configured CDN, if used).
- No scraping outside the Discord API.
- No user tracking or analytics.

All generated transcripts exist solely under the control of the end user.

---

## 📜 License

Licensed under the **Apache License 2.0**.  
See the `LICENSE` file for more information.

---

## 💬 Support, Contact & Contributions

If you need help, have questions, or want to report a problem, you have a few options:

### Support & Questions
- **GitHub Issues:** For bug reports, questions, and clarifications.
- **Discord:** For support and discussion at https://discord.gg/4ACFdtRQMy

### Feature Requests
- Please submit ideas via **GitHub Issues** or discuss them on Discord.

### Contributions
At this time, this project is **not open for external code contributions** to ensure stability and consistent architecture. However, feedback and ideas are always welcome.

---

Thank you for your interest in this project and for respecting its development direction.