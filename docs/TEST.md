# Test cases — Fault Ticket v1.0

Run these by hand against `app/index.html`.  
Record Pass / Fail in the last column when you demo the pack.

Reset notes:

- **Fresh profile:** use a private window, or DevTools → Application → Local Storage → delete `fault-ticket.v1`, then reload.
- Times are local display; stored values are ISO-8601.

| ID | Covers | Steps | Expected | Result |
|---|---|---|---|---|
| TC-01 | FR-01, FR-08, FR-09, UI-01 | Fresh profile. Submit Title=`Solder bridge`, Station=`Bench A`, Severity=`high`, Notes=`pin 4 to 5`. | Form clears. New row at top, status `open`, severity `HIGH`, id present. | |
| TC-02 | UI-02, UI-05, FR-10, NFR-02 | After TC-01, look at the list. | Columns show title, station, severity text, status, created time, action. Newest on top. | |
| TC-03 | FR-02, FR-03, ER-01, ER-02, UI-04 | Submit with Title and Station blank. | Two inline errors. No `alert()`. List unchanged. | |
| TC-04 | FR-04–FR-07 | Paste 81-char title; 41-char station; 501-char notes. | Each field reports its limit. Nothing saved. | |
| TC-06 | FR-11–FR-13, FR-16, UI-03 | On seeded data: severity=`high`, status=`open`. | Only tickets matching both remain. Meta shows `N shown / M total`. | |
| TC-07 | FR-14, UI-07 | Resolve one open ticket. | Status becomes `resolved`. Resolve button disappears. `resolvedAt` set. | |
| TC-08 | FR-15 | In DevTools, call `resolveTicket(id)` twice on the same id (or resolve, then re-run the function from console). | `resolvedAt` stays the first timestamp. | |
| TC-09 | SI-01, FR-17, FR-18 | Create a ticket. Reload the page. | Same tickets return. Storage key is `fault-ticket.v1`. | |
| TC-10 | FR-19 | Fresh profile, first load. | Three seeds: low, med, high; mixed status (two open, one resolved). | |
| TC-11 | FR-21–FR-23 | Filter to `high`. Export CSV. Open the file. | Filename `fault-tickets.csv`. Header matches SRS. Only filtered rows. A title with a comma is quoted. | |
| TC-12 | FR-20, FR-24, FR-25 | Clear all → Cancel. Then Clear all → OK. Reload. | Cancel leaves data. OK empties list. Reload stays empty (no re-seed). | |
| TC-13 | SI-02, ER-03 | In DevTools set `fault-ticket.v1` to `not-json`. Reload. | Page still renders. List empty. Console has no uncaught exception. | |
| TC-14 | UI-06, NFR-03, NFR-04, NFR-05 | Narrow the window to ~360px. Tab through controls. | Form stacks above list. Every control is labeled and reachable. Text stays readable. | |
| TC-15 | NFR-01 | In console use `window.__seedMany(200)`. Filter and resolve one. | UI stays responsive; no freeze. | |
| TC-16 | NFR-06 | DevTools Network while creating, filtering, exporting. | No app-initiated HTTP requests. | |

Helper for TC-15 is documented in `app.js` as `window.__seedMany`.
