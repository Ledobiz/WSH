# CLAUDE.md

This file orients Claude Code inside this repository. Read it fully before making changes.


## What this project is

This is the **Womenskillshub** e-commerce project, currently mid-redesign. The live store runs on Next.js, and the goal is to move it to a more modern design with better usability. The redesign is already in progress, and the main job here is to **continue building out the new design and its new features** in the redesign codebase.

There are three separate codebases in this repo, each with a distinct and non-interchangeable role. Understanding which is which is the single most important thing to get right.

## Repository structure


| Folder | Role | Stack | Do I edit it? |
|---|---|---|---|
| `wsh (Located here: C:\Users\HP\Desktop\React Projects\wsh)` | The current **production** store — what's live today | Next.js | **No** — read-only reference |
| `Working directory (this repo)` | The **new modern design** — active work area | Next.js | **Yes** — all work happens here |
| `wsh-ui (Located here: C:\Users\HP\Desktop\React Projects\wsh-ui)` | A **UI/design reference** for the new design, incl. features not yet in production | React (not Next.js) | **No** — read-only reference |

## Where work happens

**All changes go in this working directory (this repo).** Never edit `wsh/` or `wsh-ui/` — they are reference material only. If something in either of those needs to change, flag it rather than editing it.

## How to use each folder

**`wsh` — source of truth for behavior.**
Read it to understand how a feature *currently works* in production: data models, API routes, checkout flow, auth, payment integration, cart logic, and any business rules. When porting a feature into the redesign, its functional behavior should stay at parity with what's here unless the redesign deliberately changes it.

**`wsh-ui/` — source of truth for design.**
This is the visual and interaction spec for the new look: layout, component structure, styling, spacing, states, and interactions. Several features here don't exist in `wsh/` yet — those are the ones being built out. Because this is plain React (not Next.js), **port the patterns, don't copy files wholesale.** Adapt to Next.js conventions: routing, server vs. client components, data fetching, `next/image`, `next/link`, metadata, etc.

**`working directory (this repository)` — where it comes together.**
Implement features here so they **look like `wsh-ui/`** and **behave like `wsh/`** (plus the new capabilities the reference introduces). Prefer reusing existing redesign components and utilities over introducing new patterns.

## Continuing the work — feature workflow

When asked to build or continue a feature:

1. **Check the redesign first (this working directory).** See what's already been started for this feature and build on it rather than restarting.
2. **Pull the design from `wsh-ui/`.** Match structure, styling, and interaction states.
3. **Pull the behavior from `wsh/`** if the feature already exists in production (data shape, API calls, edge cases). If it's a brand-new feature, base it on the reference and wire up the functionality.
4. **Adapt React → Next.js.** Don't drop reference code in unchanged; convert it to the redesign's conventions.
5. **Keep it consistent** with the redesign's existing components, naming, and styling system.

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

- **Never edit `wsh/` or `wsh-ui/`.** They are read-only references.
- **Don't copy React-only patterns that break in Next.js** (e.g. client-only assumptions, plain `<img>`/`<a>` where Next equivalents are expected, missing `"use client"` where hooks are used).
- **Preserve production parity** for sensitive flows — checkout, payments, auth, cart — unless a change is explicitly requested.
- **Ask before changing** data models, API contracts, or anything that touches the live backend.
- When a feature exists in the reference but not in production, treat the **reference as the design spec** and confirm the intended behavior if it's unclear.