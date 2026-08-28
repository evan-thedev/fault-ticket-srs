# Software Requirements Specification

**Product:** Fault Ticket  
**Version:** 1.0  
**Date:** 28 August 2026  
**Author:** Evan Parrott  
**Status:** Baseline for implementation v1.0

This document follows the shape of IEEE 830 / ISO/IEC/IEEE 29148 without pretending to be a certified artifact. It is the contract for the code in `/app`.

---

## 1. Introduction

### 1.1 Purpose

Specify the functional and non-functional requirements for Fault Ticket, a single-user web application used to log defects found during electronics lab work or user-acceptance testing (UAT).

Intended readers: the developer implementing v1.0, a reviewer or instructor evaluating the pack, and a future maintainer who needs to know what is in vs out of scope.

### 1.2 Scope

Fault Ticket lets one person:

- record a defect against a station
- review open and resolved tickets
- filter by severity and status
- export the current list as CSV

The product runs entirely in the browser. Persistence is `localStorage` on that browser profile. There is no backend.

The product does **not** replace a team defect tracker (Jira, Azure DevOps, etc.).

### 1.3 Definitions

| Term | Meaning |
|---|---|
| Ticket | One logged defect |
| Station | Named bench, fixture, or test environment (free text) |
| Severity | `low`, `med`, or `high` |
| Status | `open` or `resolved` |
| Session | One visit to the page in one browser profile |
| SRS | This document |

### 1.4 References

- IEEE 830-1998, *IEEE Recommended Practice for Software Requirements Specifications* (structure only)
- ISO/IEC/IEEE 29148:2018 (requirement quality guidance)
- Related portfolio tools: `fault-log`, `uat-summarizer`, `serial-bench-logger`

### 1.5 Overview

Section 2 describes the product and users.  
Section 3 lists numbered requirements.  
Section 4 lists open points that v1.0 will not solve.

---

## 2. Overall description

### 2.1 Product perspective

Standalone static web page. No install, no account. Opens from disk or any static host (GitHub Pages).

```
[Browser]
   ├── index.html   presentation
   ├── styles.css
   └── app.js       domain + storage
          └── localStorage key: fault-ticket.v1
```

### 2.2 Product functions

1. Create a ticket with validation.
2. List tickets, newest first.
3. Filter by severity and by status.
4. Mark an open ticket resolved.
5. Persist across reloads in the same browser.
6. Seed three sample tickets on first launch so the list is not empty.
7. Export the **filtered** list as CSV.
8. Clear all tickets after a confirm dialog.

### 2.3 User classes

| Class | Description | v1.0 support |
|---|---|---|
| Bench / UAT operator | Logs defects while testing | Primary |
| Instructor / reviewer | Reads SRS and clicks through tests | Secondary |
| Team lead | Wants multi-user history | **Not supported** |

### 2.4 Operating environment

- Current Chrome, Firefox, Safari, or Edge
- JavaScript enabled
- `localStorage` available
- Viewport 360px and up (usable on a phone; not a native app)

### 2.5 Constraints

- C1. No network calls in v1.0 except optional font/CDN-free local files.
- C2. No frameworks. Vanilla HTML, CSS, JS so the mapping from requirement → function stays obvious.
- C3. Storage quota of the host browser applies (~5 MB). Tickets are small text records; this is not expected to bind.
- C4. English UI only.

### 2.6 Assumptions

- A1. One operator per browser profile.
- A2. Station names are typed, not chosen from a company catalog.
- A3. The operator can use a confirm dialog and download a file.

### 2.7 Dependencies

None beyond a standards-compliant browser.

---

## 3. Specific requirements

Requirement IDs are stable. Implementation comments and the RTM use the same IDs.

Priority: **M** = must for v1.0, **S** = should, **C** = could (not in v1.0).

### 3.1 External interface requirements

#### 3.1.1 User interface

| ID | Pri | Statement |
|---|---|---|
| UI-01 | M | The page shall show a create form with fields Title, Station, Severity, Notes, and a Submit control. |
| UI-02 | M | The page shall show a ticket list with title, station, severity, status, created time, and actions. |
| UI-03 | M | The page shall show filter controls for severity (`all` / `low` / `med` / `high`) and status (`all` / `open` / `resolved`). |
| UI-04 | M | Validation errors shall appear next to the form, in plain language, without using `alert()`. |
| UI-05 | M | Severity shall be visible as a short label (`LOW` / `MED` / `HIGH`), not only as color. |
| UI-06 | S | The page shall remain usable at a viewport width of 360px (stack form above list). |
| UI-07 | M | Every ticket row shall expose a control to mark the ticket resolved when its status is `open`. Resolved rows shall not show that control. |

#### 3.1.2 Hardware interfaces

None.

#### 3.1.3 Software interfaces

| ID | Pri | Statement |
|---|---|---|
| SI-01 | M | Tickets shall be stored under the `localStorage` key `fault-ticket.v1` as a JSON array. |
| SI-02 | M | If stored JSON is missing or unparsable, the app shall treat the store as empty and continue, without crashing. |

#### 3.1.4 Communication interfaces

None. v1.0 makes no HTTP requests.

### 3.2 Functional requirements

#### 3.2.1 Create ticket

| ID | Pri | Statement |
|---|---|---|
| FR-01 | M | The operator shall create a ticket by submitting Title, Station, Severity, and optional Notes. |
| FR-02 | M | Title shall be required after trim. Empty or whitespace-only title shall be rejected. |
| FR-03 | M | Station shall be required after trim. Empty or whitespace-only station shall be rejected. |
| FR-04 | M | Severity shall be one of `low`, `med`, `high`. Any other value shall be rejected. |
| FR-05 | M | Notes may be empty. Notes longer than 500 characters shall be rejected. |
| FR-06 | M | Title longer than 80 characters shall be rejected. |
| FR-07 | M | Station longer than 40 characters shall be rejected. |
| FR-08 | M | A accepted ticket shall receive a unique `id` (UUID or equivalent unique string) and an ISO-8601 `createdAt` timestamp. Status shall start as `open`. |
| FR-09 | M | After a successful create, the form shall clear and the new ticket shall appear at the top of the list. |

#### 3.2.2 List, filter, resolve

| ID | Pri | Statement |
|---|---|---|
| FR-10 | M | Tickets shall display newest-first by `createdAt`. |
| FR-11 | M | Severity filter shall hide tickets that do not match, unless `all` is selected. |
| FR-12 | M | Status filter shall hide tickets that do not match, unless `all` is selected. |
| FR-13 | M | Both filters shall combine with AND. |
| FR-14 | M | Choosing Resolve on an open ticket shall set `status` to `resolved` and record `resolvedAt` as an ISO-8601 timestamp. |
| FR-15 | M | Resolve shall be idempotent: applying it to an already-resolved ticket shall not change `resolvedAt`. |
| FR-16 | S | The list heading shall show how many tickets are visible vs total (`N shown / M total`). |

#### 3.2.3 Persistence and seed data

| ID | Pri | Statement |
|---|---|---|
| FR-17 | M | After a create, resolve, or clear, the full ticket array shall be written to `localStorage` before the next paint of the list. |
| FR-18 | M | On load, the app shall read `fault-ticket.v1` and render those tickets. |
| FR-19 | M | If the key is absent (first visit), the app shall insert three seed tickets — one of each severity, two `open` and one `resolved` — then persist them. |
| FR-20 | M | Seed insertion shall run only when the store is absent, not when the operator has an empty list after Clear. |

#### 3.2.4 Export and clear

| ID | Pri | Statement |
|---|---|---|
| FR-21 | M | Export CSV shall download a file named `fault-tickets.csv` containing the **currently filtered** tickets. |
| FR-22 | M | CSV columns shall be: `id,title,station,severity,status,createdAt,resolvedAt,notes`. |
| FR-23 | M | CSV values shall escape embedded quotes by doubling them, and wrap fields that contain commas, quotes, or newlines. |
| FR-24 | M | Clear all shall ask for confirmation. Cancel shall leave data unchanged. |
| FR-25 | M | Confirmed Clear all shall remove every ticket from memory and `localStorage`, leaving an empty list (not re-seeded). |

### 3.3 Non-functional requirements

| ID | Pri | Statement |
|---|---|---|
| NFR-01 | M | Create, filter, and resolve shall complete without a noticeable wait on a list of 200 tickets (target under 100 ms on a mid-range laptop). |
| NFR-02 | M | The UI shall not require color vision alone to read severity (see UI-05). |
| NFR-03 | M | Interactive controls shall be reachable by keyboard (tab order through form, filters, export, clear, and row actions). |
| NFR-04 | M | Form labels shall be programmatically associated with their inputs (`for` / `id`). |
| NFR-05 | S | Contrast of body text on the background shall meet WCAG 2.2 AA for normal text. |
| NFR-06 | M | No personal data shall leave the browser in v1.0. |
| NFR-07 | M | Source shall remain framework-free so a reviewer can grep a requirement ID and land in `app.js`. |

### 3.4 Data model

Ticket record:

| Field | Type | Rules |
|---|---|---|
| id | string | unique, non-empty |
| title | string | 1–80 chars after trim |
| station | string | 1–40 chars after trim |
| severity | enum | `low` \| `med` \| `high` |
| status | enum | `open` \| `resolved` |
| notes | string | 0–500 chars |
| createdAt | string | ISO-8601 |
| resolvedAt | string \| null | ISO-8601 when resolved |

### 3.5 Error handling

| ID | Pri | Statement |
|---|---|---|
| ER-01 | M | Validation failures shall block persist and list update. |
| ER-02 | M | Multiple field errors may be shown at once (title and station both empty). |
| ER-03 | M | Corrupt `localStorage` JSON shall reset in-memory state to `[]` and rewrite a valid empty array, without seed data. |

---

## 4. Future requirements (not v1.0)

- Multi-user or shared store
- Edit title / notes after create
- Delete a single ticket
- Attach a photo
- Serial-port ingest
- Auth

These are listed so they are not mistaken for missing v1.0 bugs.

---

## 5. Acceptance snapshot

v1.0 is accepted when:

1. Every **M** requirement in section 3 has a row in `docs/RTM.md` pointing at code.
2. Every test in `docs/TEST.md` marked v1.0 has a recorded result of Pass.
3. The app runs from `app/index.html` with no build step.
