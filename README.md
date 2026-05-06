# Summer '26 · Apex Security Learning Hub

A self-contained, single-page learning guide for Salesforce developers covering the two breaking Apex security changes introduced in **API version 67.0 (Summer '26)**.

## What This Covers

Summer '26 ships two breaking changes that affect any Apex class bumped to API 67.0:

| Change | Impact |
|--------|--------|
| **Database operations now default to User Mode** | All SOQL, SOSL, DML, and `Database`/`Search` method calls enforce the running user's FLS, OLS, and sharing rules by default |
| **`WITH SECURITY_ENFORCED` removed from the compiler** | Any class on API 67.0+ that still uses this clause will **fail to compile** — not a warning, a hard error |

The one-line fix for both: replace `WITH SECURITY_ENFORCED` with `WITH USER_MODE`.

## Project Structure

```
summer-26-apex-security/
├── index.html          # Full single-page app (all content inline)
├── assets/
│   ├── css/styles.css  # Design system — tokens, components, responsive layout
│   └── js/main.js      # Canvas background, scroll reveal, tabs, accordion,
│                       #   quiz logic, migration checklist (localStorage)
└── README.md
```

## Running Locally

No build step required. Open `index.html` directly in a browser:

```bash
open index.html
# or
python3 -m http.server 8080   # then visit http://localhost:8080
```

## Page Sections

| # | Section | What's Inside |
|---|---------|---------------|
| 01 | Overview | Summary of both changes, comparison table (API ≤ 66 vs 67+), impact bars, release timeline |
| 02 | User Mode Default | Code diffs for SOQL/SOSL, DML (`as user` / `as system`), and `Database`/`Search` method overloads; gotcha accordion |
| 03 | WITH SECURITY_ENFORCED Removed | Compile-error explanation, keyword comparison table, `getInaccessibleFields()` example, grep/VSCode audit commands |
| 04 | Migration Checklist | 8-step interactive checklist; progress saved per-browser via `localStorage` |
| 05 | Knowledge Check | 5-question quiz with immediate feedback and scoring |
| 06 | Resources | Official release notes, Apex Developer Guide pages, Trailhead modules, PMD static analysis |

## Key Technical Details

- **Versioned change** — classes staying on API ≤ 66.0 are completely unaffected. Upgrade each class intentionally.
- **`WITH USER_MODE`** overrides a class-level `without sharing` declaration — the operation respects the running user's sharing rules regardless.
- **`WITH SYSTEM_MODE`** bypasses FLS/OLS but still defers record visibility to the class's `with sharing` / `without sharing` / `inherited sharing` declaration.
- **`Database`/`Search` methods** take an `AccessLevel` enum: `AccessLevel.USER_MODE` or `AccessLevel.SYSTEM_MODE`.
- **`getInaccessibleFields()`** on `QueryException` returns *all* blocked fields at once — unlike `WITH SECURITY_ENFORCED` which only surfaced the first.

## Tech Stack

- Vanilla HTML/CSS/JS — zero dependencies, zero build tooling
- [Inter](https://rsms.me/inter/) + [JetBrains Mono](https://www.jetbrains.com/lp/mono/) via Google Fonts
- Canvas API for the animated particle background
- `IntersectionObserver` for scroll-reveal animations
- `localStorage` for persistent checklist state

## Disclaimer

Unofficial learning material. Not affiliated with Salesforce, Inc. Always verify against the [official release notes](https://help.salesforce.com/s/articleView?id=release-notes.rn_apex_default_user_mode.htm&release=262&type=5).
