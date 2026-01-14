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
  - [🖼️ Images](#️-images)
  - [🔢 Message Control \& Cleanup](#-message-control--cleanup)
  - [🧪 Usage \& API](#-usage--api)
    - [Installation](#installation)
    - [Functions](#functions)
      - [`createTranscript(channel, options)`](#createtranscriptchannel-options)
      - [`renderHTMLFromJSON(jsonString, options)`](#renderhtmlfromjsonjsonstring-options)
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
- Optional image embedding for long-term storage
- Markdown rendering with syntax highlighting
- No external services or remote storage
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

## 🖼️ Images

By default, transcripts reference Discord CDN URLs for images.

When image embedding is enabled:
- Images are embedded as Base64
- Output file size increases
- Images in the transcript remain available even if Discord CDN links expire

When image embedding is **not** enabled:
- The transcript will still function normally
- Images are loaded via their original Discord CDN URLs
- Image-related features may stop working if those URLs expire

This option is useful for long-term archiving and audit purposes.

---

## 🔢 Message Control & Cleanup

- The number of exported messages can be customized
- Empty messages can be automatically removed
  - Messages that become empty after filtering content
  - Messages with unsupported or removed elements

This ensures clean and readable transcripts.

---

## 🧪 Usage & API

This project provides two packages: `discord-message-transcript` and `discord-message-transcript-base`.

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

Fetches messages from a Discord channel and generates a transcript. This function is only available in the `discord-message-transcript` package.

-   **`channel`**: The Discord channel to fetch messages from.
-   **`options`**: An object with the following properties:
    -   `fileName`: The name of the file to be generated. (Default: `Transcript-{channel-name}-{channel-id}`)
    -   `includeAttachments`: Whether to include message attachments. (Default: `true`)
    -   `includeButtons`: Whether to include message buttons. (Default: `true`)
    -   `includeComponents`: Whether to include message components. (Default: `true`)
    -   `includeEmpty`: Whether to include empty messages. (Default: `false`)
    -   `includeEmbeds`: Whether to include message embeds. (Default: `true`)
    -   `includePolls`: Whether to include message polls. (Default: `true`)
    -   `includeReactions`: Whether to include message reactions. (Default: `true`)
    -   `includeV2Components`: Whether to include V2 message components. (Default: `true`)
    -   `localDate`: The locale to use for dates. (Default: `'en-GB'`)
    -   `quantity`: The maximum number of messages to fetch. (Default: `0` - all messages)
    -   `returnFormat`: The format of the transcript.
        -   `ReturnFormat.HTML`: (Default) Returns an HTML transcript.
        -   `ReturnFormat.JSON`: Returns a JSON transcript.
    -   `returnType`: The format to return the transcript in.
        -   `ReturnType.Attachment`: (Default) Returns a `AttachmentBuilder` object.
        -   `ReturnType.String`: Returns a string.
        -   `ReturnType.Buffer`: Returns a `Buffer`.
        -   `ReturnType.Stream`: Returns a `Stream`.
        -   `ReturnType.Uploadable`: Returns an `Uploadable` object.
    -   `saveImages`: Whether to save images locally. (Default: `false`)
    -   `selfContained`: Whether to include all assets in a single file. (Default: `false`)
    -   `timeZone`: The timezone to use for dates. (Default: `'UTC'`)
    -   `watermark`: Include watermark. (Default: `true`)

#### `renderHTMLFromJSON(jsonString, options)`

Converts a JSON transcript string to an HTML transcript. This function is available in both packages.

-   **`jsonString`**: The JSON transcript string.
-   **`options`**: An object with the following properties:
    -   `returnType`: The format to return the transcript in.
        -   **`discord-message-transcript`**:
            -   `ReturnType.Attachment`: (Default) Returns a `AttachmentBuilder` object.
            -   `ReturnType.String`: Returns a string.
            -   `ReturnType.Buffer`: Returns a `Buffer`.
            -   `ReturnType.Stream`: Returns a `Stream`.
            -   `ReturnType.Uploadable`: Returns an `Uploadable` object.
        -   **`discord-message-transcript-base`**:
            -   `ReturnType.String`: (Default) Returns a string.
            -   `ReturnType.Buffer`: Returns a `Buffer`.
            -   `ReturnType.Stream`: Returns a `Stream`.
            -   `ReturnType.Uploadable`: Returns an `Uploadable` object.
    -   `selfContained`: Whether to include all assets in a single file. (Default: `false`)
    -   `watermark`: Include watermark. (Default: `true`)

---

## 🔐 Permissions & Access

- The bot must be logged in
- No privileged intents are required.
- Required intents by context:
  - **Direct Messages (DMs / Group DMs):**
    - `DirectMessages`
  - **Guild channels:**
    - `Guilds`
    - `GuildMessages`
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

This project is **not affiliated with, endorsed by, or maintained by Discord Inc.**

Discord is a trademark of Discord Inc.

The visual appearance of generated transcripts is **independently implemented** and **inspired by Discord’s user interface**, with the goal of providing familiarity and readability.

This library accesses message data **exclusively through the official Discord API**, and only from servers and channels where the bot has explicit permission to read messages.

### Important Notice

- This library **does not automatically redistribute, publish, or share** any content
- All transcripts are generated **only at the explicit request of the user**
- Exported message content is obtained **solely from channels where the bot has permission to read message history**
- Any storage, sharing, publication, or redistribution of generated transcripts is **entirely the responsibility of the user**

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

The maintainers of this project are **not responsible** for how generated transcripts are stored, shared, published, or otherwise used.

---

## 🛡️ Privacy & Data Handling

- No data is stored remotely by this project
- No data is transmitted to third parties
- No scraping outside the Discord API
- No user tracking or analytics

All generated transcripts exist solely under the control of the end user.

---

## 📜 License

Licensed under the **Apache License 2.0**.  
See the `LICENSE` file for more information.

---

## 💬 Support, Contact & Contributions

If you need help, have questions, or want to report a problem, you have a few options:

### Support & Questions
- You can open a **GitHub Issue** for:
  - Bug reports
  - Questions about usage
  - Clarifications about behavior or limitations
- You can also reach out directly on **Discord** for support and discussion:  
  👉 **Discord:** https://discord.gg/4ACFdtRQMy

### Feature Requests
- Feature ideas and improvement suggestions are welcome
- Please submit them via **GitHub Issues** or discuss them on Discord
- All requests will be evaluated based on scope, feasibility, and project goals

### Contributions
At this time, this project is **not open for external code contributions**.

This helps ensure:
- Consistent architecture
- Stable public APIs
- Predictable behavior and outputs

However, feedback, ideas, and feature requests are always welcome and appreciated.

---

Thank you for your interest in this project and for respecting its development direction.