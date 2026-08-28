# Requirements traceability matrix

Product: Fault Ticket v1.0  
Maps SRS IDs → implementation → test case.

| Req ID | Summary | Code | Test |
|---|---|---|---|
| UI-01 | Create form fields | `app/index.html` form `#ticket-form` | TC-01 |
| UI-02 | List columns | `renderList()` in `app/app.js` | TC-02 |
| UI-03 | Filter controls | `#filter-severity`, `#filter-status` | TC-06 |
| UI-04 | Inline validation, no alert | `showErrors()` | TC-03, TC-04 |
| UI-05 | Severity text label | `.sev` badge text | TC-02 |
| UI-06 | Narrow viewport stacks | `app/styles.css` media query | TC-14 |
| UI-07 | Resolve only on open rows | `renderList()` action cell | TC-07 |
| SI-01 | Storage key `fault-ticket.v1` | `STORAGE_KEY` | TC-09 |
| SI-02 | Bad JSON does not crash | `loadAll()` | TC-13 |
| FR-01 | Create with four fields | `onSubmit()` | TC-01 |
| FR-02 | Title required | `validate()` | TC-03 |
| FR-03 | Station required | `validate()` | TC-03 |
| FR-04 | Severity enum | `validate()` | TC-04 |
| FR-05 | Notes max 500 | `validate()` | TC-04 |
| FR-06 | Title max 80 | `validate()` | TC-04 |
| FR-07 | Station max 40 | `validate()` | TC-04 |
| FR-08 | id + createdAt + status open | `makeTicket()` | TC-01 |
| FR-09 | Clear form, prepend list | `onSubmit()` | TC-01 |
| FR-10 | Newest first | `sortTickets()` | TC-02 |
| FR-11 | Severity filter | `visibleTickets()` | TC-06 |
| FR-12 | Status filter | `visibleTickets()` | TC-06 |
| FR-13 | Filters AND | `visibleTickets()` | TC-06 |
| FR-14 | Resolve sets status + resolvedAt | `resolveTicket()` | TC-07 |
| FR-15 | Resolve idempotent | `resolveTicket()` | TC-08 |
| FR-16 | Shown / total count | `#list-meta` | TC-06 |
| FR-17 | Persist after mutate | `persist()` | TC-09 |
| FR-18 | Load on boot | `boot()` | TC-09 |
| FR-19 | First-visit seed (3 tickets) | `seedIfNeeded()` | TC-10 |
| FR-20 | Clear does not re-seed | `clearAll()` + `seedIfNeeded()` | TC-12 |
| FR-21 | Export filtered CSV | `exportCsv()` | TC-11 |
| FR-22 | CSV columns | `toCsv()` | TC-11 |
| FR-23 | CSV escaping | `csvCell()` | TC-11 |
| FR-24 | Clear confirm / cancel | `clearAll()` | TC-12 |
| FR-25 | Confirmed clear empties store | `clearAll()` | TC-12 |
| NFR-01 | 200-ticket snappiness | in-memory array, no network | TC-15 |
| NFR-02 | Severity not color-only | badge text | TC-02 |
| NFR-03 | Keyboard reachability | native controls | TC-14 |
| NFR-04 | Label `for`/`id` | `app/index.html` | TC-14 |
| NFR-05 | Contrast AA (should) | `app/styles.css` | TC-14 |
| NFR-06 | No data leaves browser | no `fetch` in `app.js` | TC-16 |
| NFR-07 | Grep-able req IDs | comments in `app.js` | — |
| ER-01 | Invalid create does not persist | `onSubmit()` | TC-03 |
| ER-02 | Multiple errors at once | `validate()` | TC-03 |
| ER-03 | Corrupt store → empty array | `loadAll()` | TC-13 |
