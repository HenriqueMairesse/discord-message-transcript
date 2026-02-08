# Security Policy

## Overview

This project generates HTML transcripts from Discord messages and may optionally forward external asset URLs (images, videos, audio or any other file type) to a user-configured CDN before generating the final HTML output.

By default, assets are not downloaded by this library. When CDN features are enabled, URLs are forwarded directly to the configured provider (for example Cloudinary or Uploadcare), which performs the download independently.

Custom CDN handlers may implement their own download logic, which is fully controlled by the end user.

This project does not provide hosting, persistent data storage, or any remote processing infrastructure operated by the maintainers. All processing occurs within the environment where the library is executed.

---

## Supported Versions

Only the latest released version of this project is supported with security updates.

---

## Default Security Behavior

By default, this library applies multiple safety checks when generating HTML transcripts,
including sanitization of message content and validation of external asset URLs.

These protections are enabled through `safeMode` (enabled by default).

Disabling `safeMode` will bypass URL safety checks and may allow unsafe external content
to be embedded in generated HTML transcripts.

Text content is always escaped and cannot be bypassed.

## Reporting a Vulnerability

If you discover a potential security vulnerability, please **do not open a public issue**.

Instead, report it privately through one of the following channels:
- GitHub Security Advisories
- Direct contact via the official Discord server

We aim to review and respond to reports within a reasonable timeframe.

---

## What Is Considered a Security Issue

The following may be considered security vulnerabilities:

- Remote code execution
- Arbitrary file read or write
- Unauthorized access to Discord messages or channels
- Data leakage beyond explicitly requested transcripts
- Cross-site scripting (XSS) in generated HTML output
- Bypassing Discord permission or access controls
- Server-side request forgery (SSRF) when external assets are downloaded (for example when using base64 embedding or custom CDN handlers)

---

## What Is NOT Considered a Security Issue

The following are **not** considered security vulnerabilities:

- User misuse of generated transcripts
- Sharing or publishing exported content by the end user
- Discord permission misconfiguration
- Use of public CDNs (such as highlight.js) for client-side rendering
- Use of third-party CDNs for client-side rendering
- Security issues caused by explicitly disabling built-in safety features (e.g. `safeMode: false`)
- Risks introduced by modifying the generated HTML manually
- Opening transcripts in environments that intentionally disable browser security protections

---

## Scope and Limitations

- This project does not operate servers or remote services
- No data is collected, stored, or processed by infrastructure operated by the maintainers
- All Discord data access occurs exclusively through the official Discord API
- All rendering is performed locally or in the end user’s environment
- The security of the environment where the generated HTML is opened or hosted (browser, operating system, web server, or third-party infrastructure) is the responsibility of the end user.

---

## Responsible Disclosure

Please allow a reasonable amount of time for investigation and remediation before public disclosure.
