/* Fault Ticket v1.0 — requirement IDs from docs/SRS.md */

const STORAGE_KEY = "fault-ticket.v1"; // SI-01
const SEVERITIES = ["low", "med", "high"];
const STATUSES = ["open", "resolved"];

const els = {
  form: document.getElementById("ticket-form"),
  title: document.getElementById("title"),
  station: document.getElementById("station"),
  severity: document.getElementById("severity"),
  notes: document.getElementById("notes"),
  errors: document.getElementById("form-errors"),
  listRoot: document.getElementById("list-root"),
  filterSeverity: document.getElementById("filter-severity"),
  filterStatus: document.getElementById("filter-status"),
  listMeta: document.getElementById("list-meta"),
  exportBtn: document.getElementById("export-btn"),
  clearBtn: document.getElementById("clear-btn"),
};

let tickets = [];

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return "t-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

function loadAll() {
  // SI-02, ER-03
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return { missing: true, items: [] };
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("not-array");
    return { missing: false, items: parsed };
  } catch (err) {
    localStorage.setItem(STORAGE_KEY, "[]");
    return { missing: false, items: [] };
  }
}

function persist(items) {
  // FR-17
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function seedIfNeeded(loaded) {
  // FR-19, FR-20 — only when the key is absent
  if (!loaded.missing) return loaded.items;
  const seeded = [
    {
      id: uid(),
      title: "Fixture clamp slips under load",
      station: "Bench A",
      severity: "high",
      status: "open",
      notes: "Seed ticket. Reproduces on third cycle.",
      createdAt: nowIso(),
      resolvedAt: null,
    },
    {
      id: uid(),
      title: "CSV export drops last row in UAT sheet",
      station: "UAT-2",
      severity: "med",
      status: "open",
      notes: "Seed ticket.",
      createdAt: new Date(Date.now() - 3600_000).toISOString(),
      resolvedAt: null,
    },
    {
      id: uid(),
      title: "Label printer offline after sleep",
      station: "Receiving",
      severity: "low",
      status: "resolved",
      notes: "Seed ticket. Power-cycled.",
      createdAt: new Date(Date.now() - 86400_000).toISOString(),
      resolvedAt: nowIso(),
    },
  ];
  persist(seeded);
  return seeded;
}

function validate(input) {
  // FR-02..FR-07, ER-02
  const errors = [];
  const title = (input.title || "").trim();
  const station = (input.station || "").trim();
  const notes = input.notes || "";
  const severity = input.severity;

  if (!title) errors.push("Title is required.");
  else if (title.length > 80) errors.push("Title must be 80 characters or fewer.");

  if (!station) errors.push("Station is required.");
  else if (station.length > 40) errors.push("Station must be 40 characters or fewer.");

  if (!SEVERITIES.includes(severity)) errors.push("Severity must be low, med, or high.");

  if (notes.length > 500) errors.push("Notes must be 500 characters or fewer.");

  return { ok: errors.length === 0, errors, title, station, notes, severity };
}

function makeTicket(fields) {
  // FR-08
  return {
    id: uid(),
    title: fields.title,
    station: fields.station,
    severity: fields.severity,
    status: "open",
    notes: fields.notes,
    createdAt: nowIso(),
    resolvedAt: null,
  };
}

function showErrors(messages) {
  // UI-04 — no alert()
  els.errors.textContent = messages.join(" ");
}

function sortTickets(list) {
  // FR-10
  return [...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function visibleTickets() {
  // FR-11, FR-12, FR-13
  const sev = els.filterSeverity.value;
  const status = els.filterStatus.value;
  return sortTickets(tickets).filter((t) => {
    const sevOk = sev === "all" || t.severity === sev;
    const statusOk = status === "all" || t.status === status;
    return sevOk && statusOk;
  });
}

function fmtTime(iso) {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function renderList() {
  const shown = visibleTickets();
  els.listMeta.textContent = `${shown.length} shown / ${tickets.length} total`; // FR-16

  if (shown.length === 0) {
    els.listRoot.innerHTML = `<p class="empty">No tickets match the filters.</p>`;
    return;
  }

  const rows = shown
    .map((t) => {
      const action =
        t.status === "open"
          ? `<button type="button" class="secondary" data-resolve="${t.id}">Resolve</button>`
          : ""; // UI-07
      const notes = t.notes ? `<div class="notes">${escapeHtml(t.notes)}</div>` : "";
      return `<tr>
        <td>
          <strong>${escapeHtml(t.title)}</strong>
          ${notes}
        </td>
        <td>${escapeHtml(t.station)}</td>
        <td><span class="sev ${t.severity}">${t.severity.toUpperCase()}</span></td>
        <td class="status">${t.status}${t.resolvedAt ? `<br><span>${fmtTime(t.resolvedAt)}</span>` : ""}</td>
        <td>${fmtTime(t.createdAt)}</td>
        <td>${action}</td>
      </tr>`;
    })
    .join("");

  els.listRoot.innerHTML = `<table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Station</th>
        <th>Severity</th>
        <th>Status</th>
        <th>Created</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

function onSubmit(event) {
  event.preventDefault();
  const checked = validate({
    title: els.title.value,
    station: els.station.value,
    severity: els.severity.value,
    notes: els.notes.value,
  });
  if (!checked.ok) {
    showErrors(checked.errors); // ER-01
    return;
  }
  showErrors([]);
  const ticket = makeTicket(checked);
  tickets = [ticket, ...tickets];
  persist(tickets);
  els.form.reset();
  els.severity.value = "med";
  renderList(); // FR-09
}

function resolveTicket(id) {
  // FR-14, FR-15
  tickets = tickets.map((t) => {
    if (t.id !== id) return t;
    if (t.status === "resolved") return t;
    return { ...t, status: "resolved", resolvedAt: nowIso() };
  });
  persist(tickets);
  renderList();
}

function csvCell(value) {
  // FR-23
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows) {
  // FR-22
  const header = ["id", "title", "station", "severity", "status", "createdAt", "resolvedAt", "notes"];
  const lines = [header.join(",")];
  for (const t of rows) {
    lines.push(
      [
        csvCell(t.id),
        csvCell(t.title),
        csvCell(t.station),
        csvCell(t.severity),
        csvCell(t.status),
        csvCell(t.createdAt),
        csvCell(t.resolvedAt),
        csvCell(t.notes),
      ].join(",")
    );
  }
  return lines.join("\n");
}

function exportCsv() {
  // FR-21
  const csv = toCsv(visibleTickets());
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "fault-tickets.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function clearAll() {
  // FR-24, FR-25
  const ok = window.confirm("Clear every ticket in this browser? This cannot be undone.");
  if (!ok) return;
  tickets = [];
  persist(tickets);
  renderList();
}

function boot() {
  // FR-18
  const loaded = loadAll();
  tickets = seedIfNeeded(loaded);
  renderList();
}

els.form.addEventListener("submit", onSubmit);
els.filterSeverity.addEventListener("change", renderList);
els.filterStatus.addEventListener("change", renderList);
els.exportBtn.addEventListener("click", exportCsv);
els.clearBtn.addEventListener("click", clearAll);
els.listRoot.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-resolve]");
  if (!btn) return;
  resolveTicket(btn.getAttribute("data-resolve"));
});

// TC-15 helper
window.__seedMany = function seedMany(n) {
  const extra = [];
  for (let i = 0; i < n; i += 1) {
    extra.push(
      makeTicket({
        title: `Generated ticket ${i + 1}`,
        station: `Cell ${i % 8}`,
        severity: SEVERITIES[i % 3],
        notes: "",
      })
    );
  }
  tickets = extra.concat(tickets);
  persist(tickets);
  renderList();
};

window.resolveTicket = resolveTicket;

boot();
