# Fault Ticket — SRS pack

School-style software project: a full **Software Requirements Specification** plus a tiny app that implements those requirements.

**Live app (open the file):** [app/index.html](app/index.html)

**Spec:** [docs/SRS.md](docs/SRS.md)  
**Traceability:** [docs/RTM.md](docs/RTM.md)  
**Test cases:** [docs/TEST.md](docs/TEST.md)

## What it is

**Fault Ticket** is a single-user, browser-local logger for lab / UAT defects.

You add a ticket (title, station, severity, notes), filter the list, mark items resolved, and export a CSV. Data stays in `localStorage`. Nothing is uploaded.

This is deliberately small. The point of the repo is the paper trail:

1. Write requirements first (`docs/SRS.md`).
2. Implement only what the SRS allows.
3. Map every requirement to code and a test (`docs/RTM.md`, `docs/TEST.md`).

## Run it

No build step.

```bash
git clone https://github.com/evan-thedev/fault-ticket-srs.git
cd fault-ticket-srs
# open app/index.html in a browser
```

Or from this folder:

```bash
python3 -m http.server 4173
# then visit http://localhost:4173/app/
```

## Repo layout

```
docs/SRS.md      IEEE-inspired Software Requirements Specification
docs/RTM.md      Requirements → code → test matrix
docs/TEST.md     Manual test cases keyed to requirement IDs
app/index.html   UI
app/app.js       Logic (requirement IDs in comments)
app/styles.css   Presentation
```

## Out of scope (on purpose)

- Accounts, login, multi-user
- Server, database, cloud sync
- Live instrument / serial capture
- Mobile-native apps

See SRS section 2.2.

## License

MIT. See [LICENSE](LICENSE).
