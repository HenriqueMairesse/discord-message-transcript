# Security Policy

## Overview

This project is a client-side and API-based utility for exporting and rendering Discord messages.
It does not provide hosting, data storage, or server-side processing of user content.

---

## Supported Versions

Only the latest released version of this project is supported with security updates.

---

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

---

## What Is NOT Considered a Security Issue

The following are **not** considered security vulnerabilities:

- User misuse of generated transcripts
- Sharing or publishing exported content by the end user
- Discord permission misconfiguration
- Use of public CDNs (such as highlight.js) for client-side rendering
- Security risks caused by opening generated HTML files in untrusted environments

---

## Scope and Limitations

- This project does not operate servers or remote services
- No data is collected, stored, or processed by the maintainers
- All Discord data access occurs exclusively through the official Discord API
- All rendering is performed locally or in the end user’s environment

---

## Responsible Disclosure

Please allow a reasonable amount of time for investigation and remediation before public disclosure.
