# CLAUDE.md

This file orients Claude Code inside this repository. Read it fully before making changes.


## What this project is

This is the **Womenskillshub** e-commerce project, built using NextJs


## Tech stack

- **Framework:** Next.js (App Router, version 16)
- **Language:** [TypeScript]
- **Styling:** [Tailwind]
- **UI components:** [Radix]
- **State/data:** [React Query / SWR / Zustand / Redux / ...]
- **Package manager:** [npm]

## Conventions


- Follow the existing file/folder structure in the the working directory/redesign; match how similar features are already organized.
- Reuse existing components and utilities before writing new ones.
- Keep components small and match the styling system already in use (no ad-hoc styling approaches).
- [Naming conventions, import aliases, formatting rules, etc.]

## Guardrails

- **Don't copy React-only patterns that break in Next.js** (e.g. client-only assumptions, plain `<img>`/`<a>` where Next equivalents are expected, missing `"use client"` where hooks are used).
- **Preserve production parity** for sensitive flows — checkout, payments, auth, cart — unless a change is explicitly requested.
- **Ask before changing** data models, API contracts, or anything that touches the live backend.
- When a feature exists in the reference but not in production, treat the **reference as the design spec** and confirm the intended behavior if it's unclear.