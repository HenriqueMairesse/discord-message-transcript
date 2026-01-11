# discord-message-transcript

🌍 Read this document in:
- 🇧🇷 [Português](README.pt-BR.md)

A modular and privacy-focused library for exporting Discord messages into **JSON** or **HTML** transcripts, with high visual fidelity and long-term archival support.

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
  - [🖼️ Images \& Attachments](#️-images--attachments)
  - [🔢 Message Control \& Cleanup](#-message-control--cleanup)
  - [🧪 Usage \& API](#-usage--api)
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
  - Channel backups

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

- Fidelity Discord-like rendering
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
- Message components (v1)
- Components v2
- Polls
- Attachments
- Reactions

---

## 🔦 Syntax Highlighting

The generated HTML uses **highlight.js** to provide syntax highlighting for code blocks.

- This is the **only external resource** used
- Included via a CDN link in the generated HTML
- Loaded **only at render time**
- Not required for JSON generation

---

## 🖼️ Images & Attachments

By default, transcripts reference Discord CDN URLs.

When image embedding is enabled:
- Images and media are embedded as Base64
- Output file size increases
- Transcripts remain valid even if Discord CDN links expire

This is useful for long-term archiving and audit purposes.

---

## 🔢 Message Control & Cleanup

- The number of exported messages can be customized
- Empty messages can be automatically removed
  - Messages that become empty after filtering content
  - Messages with unsupported or removed elements

This ensures clean and readable transcripts.

---

## 🧪 Usage & API

> 🚧 **Documentation in progress**

This section will contain:
- Installation instructions
- Usage examples
- API references
- Configuration options

---

## 🔐 Permissions & Access

- The bot must be logged in
- No privileged intents are required
- Supported channels:
  - Guild text channels
  - Threads
  - Private messages
  - Group DMs

Messages are accessed **only** from channels where:
- The bot is explicitly installed
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
  👉 **Discord:** <YOUR_DISCORD_INVITE_LINK>

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