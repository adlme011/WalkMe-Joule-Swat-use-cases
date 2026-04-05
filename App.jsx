import { useState } from "react";

const DEPT_OPTIONS = ["IT", "Digital Transformation", "HR", "Finance", "Operations", "Procurement", "C-Suite", "Product", "Engineering", "Sales", "Customer Success", "Other"];
const ROLE_OPTIONS = ["VP", "Director", "Manager", "Architect", "Admin", "Analyst", "Executive Sponsor", "End User Champion", "Other"];

const PHASE_TEMPLATES = [
  { name: "Customer Selection", description: "Finalize customer list with Sales & CSM leadership", target: "Week 1–2" },
  { name: "Engagement Planning", description: "Build structured plans with timelines, touchpoints & success criteria", target: "Week 3–4" },
  { name: "Resource Alignment", description: "Secure Product & R&D resources for proof-of-feasibility", target: "Week 3–5" },
  { name: "Use Case Discovery", description: "Identify high-impact AI use cases per account", target: "Week 5–8" },
  { name: "Proof of Feasibility", description: "Deliver PoF with Product & R&D support", target: "Week 8–12" },
  { name: "Productization & Scale", description: "Capture use cases for GTM library & product roadmap", target: "Week 12–16" },
];

const ACTION_TEMPLATES = [
  { action: "Confirm account selection & alignment", owner: "Sales & CSM", due: "Week 2" },
  { action: "Build engagement plan (timelines, touchpoints, success criteria)", owner: "Regional Lead", due: "Week 4" },
  { action: "Kick off use case discovery workshop", owner: "Tiger Team", due: "Week 5" },
  { action: "Showcase future tech capabilities", owner: "Product & R&D", due: "Week 8" },
  { action: "Capture real-world use cases from customer", owner: "Tiger Team", due: "Week 10" },
  { action: "Deliver proof-of-feasibility", owner: "Product & R&D", due: "Week 12" },
  { action: "Document use case for GTM library", owner: "Marketing", due: "Week 14" },
];

const makeAccounts = () => {
  const base = (id, region, leads) => ({
    id, name: `Account slot ${id <= 5 ? id : id - 5}`, region, leads,
    jouleStatus: "Active", walkmeStatus: "Active",
    engagementPlan: false, useCaseIdentified: false, pocStarted: false,
    contacts: [], customFields: {}, expanded: false, expandedSection: "contacts",
    phases: PHASE_TEMPLATES.map((p, i) => ({ id: i + 1, ...p, status: i === 0 ? "in-progress" : "upcoming", notes: "" })),
    actions: ACTION_TEMPLATES.map((a, i) => ({ id: i + 1, ...a, done: false, notes: "" })),
    accountNotes: "",
  });
  return [
    ...[1,2,3,4,5].map(i => base(i, "US", "Alex & Olga")),
    ...[6,7,8,9,10].map(i => base(i, "Europe", "Steven & Mark")),
  ];
};

const statusColor = (s) => {
  if (s === "complete") return { bg: "#0a2e1a", text: "#34d399", dot: "#34d399" };
  if (s === "in-progress") return { bg: "#1a1a0a", text: "#fbbf24", dot: "#fbbf24" };
  return { bg: "#1a1a2e", text: "#818cf8", dot: "#818cf8" };
};

const inputStyle = {
  background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 6,
  padding: "6px 10px", color: "#e4e4e7", fontSize: 12, fontFamily: "'DM Sans', sans-serif",
  outline: "none", width: "100%", boxSizing: "border-box",
};
const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer", paddingRight: 24, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b7280'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" };
const btnSmall = { background: "none", border: "1px solid #2a2a3e", borderRadius: 6, padding: "5px 12px", color: "#9ca3af", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all .15s" };
const textareaStyle = { ...inputStyle, minHeight: 60, resize: "vertical", lineHeight: 1.5 };

let contactIdCounter = 100;
let actionIdCounter = 200;

export default function TigerTeamProgram() {
  const [activeTab, setActiveTab] = useState("overview");
  const [accounts, setAccounts] = useState(makeAccounts);
  const [editingAccount, setEditingAccount] = useState(null);
  const [editName, setEditName] = useState("");
  const [customColumns, setCustomColumns] = useState([]);
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");

  // Account helpers
  const updateAccount = (id, updater) => setAccounts(prev => prev.map(a => a.id === id ? updater(a) : a));
  const toggleAccountField = (id, field) => updateAccount(id, a => ({ ...a, [field]: !a[field] }));
  const toggleExpand = (id) => updateAccount(id, a => ({ ...a, expanded: !a.expanded }));
  const setExpandedSection = (id, section) => updateAccount(id, a => ({ ...a, expandedSection: section }));
  const startEdit = (acc) => { setEditingAccount(acc.id); setEditName(acc.name); };
  const saveEdit = (id) => { updateAccount(id, a => ({ ...a, name: editName })); setEditingAccount(null); };

  // Per-account phase
  const cycleAccountPhase = (accId, phaseId) => {
    const order = ["upcoming", "in-progress", "complete"];
    updateAccount(accId, a => ({
      ...a, phases: a.phases.map(p => p.id === phaseId ? { ...p, status: order[(order.indexOf(p.status) + 1) % order.length] } : p)
    }));
  };
  const updatePhaseNotes = (accId, phaseId, notes) => {
    updateAccount(accId, a => ({ ...a, phases: a.phases.map(p => p.id === phaseId ? { ...p, notes } : p) }));
  };

  // Per-account actions
  const toggleAccountAction = (accId, actionId) => {
    updateAccount(accId, a => ({ ...a, actions: a.actions.map(x => x.id === actionId ? { ...x, done: !x.done } : x) }));
  };
  const updateActionNotes = (accId, actionId, notes) => {
    updateAccount(accId, a => ({ ...a, actions: a.actions.map(x => x.id === actionId ? { ...x, notes } : x) }));
  };
  const addAccountAction = (accId) => {
    actionIdCounter++;
    updateAccount(accId, a => ({ ...a, actions: [...a.actions, { id: actionIdCounter, action: "", owner: "", due: "", done: false, notes: "" }] }));
  };
  const removeAccountAction = (accId, actionId) => {
    updateAccount(accId, a => ({ ...a, actions: a.actions.filter(x => x.id !== actionId) }));
  };
  const updateActionField = (accId, actionId, field, value) => {
    updateAccount(accId, a => ({ ...a, actions: a.actions.map(x => x.id === actionId ? { ...x, [field]: value } : x) }));
  };

  // Account notes
  const updateAccountNotes = (accId, notes) => updateAccount(accId, a => ({ ...a, accountNotes: notes }));

  // Contacts
  const addContact = (accId) => { contactIdCounter++; updateAccount(accId, a => ({ ...a, contacts: [...a.contacts, { id: contactIdCounter, name: "", role: "", department: "", email: "", notes: "" }] })); };
  const updateContact = (accId, cId, field, value) => { updateAccount(accId, a => ({ ...a, contacts: a.contacts.map(c => c.id === cId ? { ...c, [field]: value } : c) })); };
  const removeContact = (accId, cId) => { updateAccount(accId, a => ({ ...a, contacts: a.contacts.filter(c => c.id !== cId) })); };

  // Custom fields
  const addCustomColumn = () => {
    if (!newFieldName.trim()) return;
    const key = newFieldName.trim().toLowerCase().replace(/\s+/g, "_");
    if (customColumns.find(c => c.key === key)) return;
    setCustomColumns(prev => [...prev, { key, label: newFieldName.trim(), type: newFieldType }]);
    setAccounts(prev => prev.map(a => ({ ...a, customFields: { ...a.customFields, [key]: newFieldType === "checkbox" ? false : "" } })));
    setNewFieldName(""); setNewFieldType("text"); setShowAddField(false);
  };
  const removeCustomColumn = (key) => {
    setCustomColumns(prev => prev.filter(c => c.key !== key));
    setAccounts(prev => prev.map(a => { const cf = { ...a.customFields }; delete cf[key]; return { ...a, customFields: cf }; }));
  };
  const updateCustomField = (accId, key, value) => updateAccount(accId, a => ({ ...a, customFields: { ...a.customFields, [key]: value } }));

  // Stats
  const totalContacts = accounts.reduce((sum, a) => sum + a.contacts.length, 0);
  const accountProgress = accounts.map(a => {
    const pc = a.phases.filter(p => p.status === "complete").length;
    const ac = a.actions.filter(x => x.done).length;
    return { ...a, phasesComplete: pc, actionsComplete: ac };
  });
  const totalPhasesComplete = accountProgress.reduce((sum, a) => sum + a.phasesComplete, 0);
  const totalPhases = accounts.length * 6;
  const totalActionsComplete = accountProgress.reduce((sum, a) => sum + a.actionsComplete, 0);
  const totalActions = accounts.reduce((sum, a) => sum + a.actions.length, 0);

  const tabs = [
    { id: "overview", label: "Program Overview" },
    { id: "accounts", label: "Account Tracker" },
  ];

  const sectionTabs = [
    { id: "contacts", label: "👤 Contacts", icon: "" },
    { id: "phases", label: "📅 Phases", icon: "" },
    { id: "actions", label: "✅ Actions", icon: "" },
    { id: "notes", label: "📝 Notes", icon: "" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0b0b0f", color: "#e4e4e7", minHeight: "100vh", padding: 0 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0a1a2e 100%)", borderBottom: "1px solid #2a2a3e", padding: "32px 40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg, #818cf8, #c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#0b0b0f", fontFamily: "'Space Mono', monospace" }}>⚡</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#818cf8", fontFamily: "'Space Mono', monospace" }}>AI SWAT / Tiger Team</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Joule + WalkMe Use Case Initiative</h1>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "#9ca3af", margin: "12px 0 0 56px", maxWidth: 700, lineHeight: 1.6 }}>
          Identifying high-impact AI use cases across 10 joint Joule + WalkMe accounts to deepen strategic relationships, validate the AI roadmap, and build a proven use case library.
        </p>
        <div style={{ display: "flex", gap: 20, marginTop: 24, marginLeft: 56, flexWrap: "wrap" }}>
          {[
            { label: "Target Accounts", value: "10", sub: "5 US · 5 EU" },
            { label: "Contacts Mapped", value: String(totalContacts), sub: `across ${accounts.filter(a => a.contacts.length > 0).length} accounts` },
            { label: "Phases Complete", value: `${totalPhasesComplete}/${totalPhases}`, sub: `${Math.round(totalPhasesComplete / totalPhases * 100)}% across all accounts` },
            { label: "Actions Done", value: `${totalActionsComplete}/${totalActions}`, sub: `${totalActions - totalActionsComplete} remaining` },
          ].map((stat, i) => (
            <div key={i} style={{ background: "#ffffff08", borderRadius: 10, padding: "14px 20px", minWidth: 145, border: "1px solid #ffffff0a" }}>
              <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#f4f4f5" }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "#818cf8", marginTop: 2 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 2, padding: "0 40px", background: "#0e0e14", borderBottom: "1px solid #1f1f2e" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: "14px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
            borderBottom: activeTab === tab.id ? "2px solid #818cf8" : "2px solid transparent",
            background: "none", color: activeTab === tab.id ? "#e4e4e7" : "#6b7280",
            fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3, transition: "all .2s"
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ padding: "28px 40px 60px" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <Card title="Objective">
              <p style={{ color: "#d1d5db", lineHeight: 1.7, fontSize: 14 }}>Identify compelling AI use cases within our joint Joule + WalkMe customer base that demonstrate the combined value of both platforms — deepening strategic relationships, validating the AI roadmap, and building a library of proven use cases for broader GTM efforts.</p>
            </Card>
            <Card title="Team Structure">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <RegionCard region="United States" leads="Alex & Olga" count={5} color="#60a5fa" />
                <RegionCard region="Europe" leads="Steven & Mark" count={5} color="#c084fc" />
              </div>
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#ffffff06", borderRadius: 8, border: "1px solid #ffffff0a" }}>
                <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>Resources</div>
                <div style={{ fontSize: 13, color: "#d1d5db" }}>Dedicated Product & R&D teams for proof-of-feasibility support</div>
              </div>
            </Card>
            <Card title="Strategic Value" span={2}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { icon: "🤝", title: "Deepen Relationships", desc: "Strategic engagement with key joint accounts" },
                  { icon: "🧭", title: "Validate AI Roadmap", desc: "Real customer input shaping future technology" },
                  { icon: "📚", title: "Use Case Library", desc: "Proven cases for broader go-to-market efforts" },
                ].map((v, i) => (
                  <div key={i} style={{ background: "#ffffff06", borderRadius: 10, padding: "20px", border: "1px solid #ffffff08" }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{v.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{v.title}</div>
                    <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.5 }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ACCOUNTS TAB */}
        {activeTab === "accounts" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, gap: 8 }}>
              {!showAddField ? (
                <button onClick={() => setShowAddField(true)} style={{ ...btnSmall, background: "#818cf820", color: "#818cf8", border: "1px solid #818cf840" }}>+ Add Custom Field</button>
              ) : (
                <div style={{ display: "flex", gap: 8, alignItems: "center", background: "#12121a", border: "1px solid #2a2a3e", borderRadius: 10, padding: "10px 16px" }}>
                  <input placeholder="Field name" value={newFieldName} onChange={e => setNewFieldName(e.target.value)} onKeyDown={e => e.key === "Enter" && addCustomColumn()} style={{ ...inputStyle, width: 150 }} />
                  <select value={newFieldType} onChange={e => setNewFieldType(e.target.value)} style={{ ...selectStyle, width: 110 }}>
                    <option value="text">Text</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                  <button onClick={addCustomColumn} style={{ ...btnSmall, background: "#818cf8", color: "#0b0b0f", border: "none" }}>Add</button>
                  <button onClick={() => { setShowAddField(false); setNewFieldName(""); }} style={btnSmall}>Cancel</button>
                </div>
              )}
            </div>
            {customColumns.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "#6b7280", alignSelf: "center", fontFamily: "'Space Mono', monospace" }}>CUSTOM FIELDS:</span>
                {customColumns.map(col => (
                  <span key={col.key} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 6, fontSize: 11, background: "#1a1a28", border: "1px solid #2a2a3e", color: "#c084fc" }}>
                    {col.label} <span style={{ fontSize: 9, color: "#6b7280" }}>({col.type})</span>
                    <span onClick={() => removeCustomColumn(col.key)} style={{ cursor: "pointer", color: "#ef444480", marginLeft: 2, fontSize: 13 }}>×</span>
                  </span>
                ))}
              </div>
            )}

            {["US", "Europe"].map(region => (
              <div key={region} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: region === "US" ? "#60a5fa" : "#c084fc", fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>{region === "US" ? "🇺🇸 UNITED STATES" : "🇪🇺 EUROPE"}</span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Led by {region === "US" ? "Alex & Olga" : "Steven & Mark"}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {accounts.filter(a => a.region === region).map(acc => {
                    const ap = accountProgress.find(x => x.id === acc.id);
                    return (
                      <div key={acc.id} style={{ background: "#12121a", borderRadius: 12, border: acc.expanded ? "1px solid #2a2a3e" : "1px solid #1f1f2e", overflow: "hidden", marginBottom: 8 }}>
                        {/* Account row */}
                        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 12, cursor: "pointer" }} onClick={() => toggleExpand(acc.id)}>
                          <span style={{ fontSize: 12, color: "#6b7280", transition: "transform .2s", display: "inline-block", transform: acc.expanded ? "rotate(90deg)" : "rotate(0deg)", userSelect: "none", flexShrink: 0 }}>▶</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {editingAccount === acc.id ? (
                              <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                                <input value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEdit(acc.id)} style={{ ...inputStyle, width: 160 }} autoFocus />
                                <button onClick={() => saveEdit(acc.id)} style={{ background: "#818cf8", border: "none", borderRadius: 6, padding: "4px 12px", color: "#0b0b0f", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✓</button>
                              </div>
                            ) : (
                              <span onClick={e => { e.stopPropagation(); startEdit(acc); }} style={{ cursor: "text", borderBottom: "1px dashed #3a3a4e", paddingBottom: 1, fontWeight: 600, fontSize: 14 }} title="Click to rename">{acc.name}</span>
                            )}
                          </div>
                          <StatusPill status="Joule" color="#34d399" />
                          <StatusPill status="WalkMe" color="#34d399" />
                          <div style={{ display: "flex", gap: 6, fontSize: 11, color: "#6b7280", fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>
                            <span style={{ color: "#c084fc" }}>{acc.contacts.length}p</span>
                            <span>·</span>
                            <span style={{ color: ap?.phasesComplete === 6 ? "#34d399" : "#fbbf24" }}>{ap?.phasesComplete}/6</span>
                            <span>·</span>
                            <span style={{ color: ap?.actionsComplete === acc.actions.length ? "#34d399" : "#818cf8" }}>{ap?.actionsComplete}/{acc.actions.length}</span>
                          </div>
                          {["engagementPlan", "useCaseIdentified", "pocStarted"].map(field => (
                            <div key={field} onClick={e => e.stopPropagation()} style={{ flexShrink: 0 }}>
                              <Checkbox checked={acc[field]} onChange={() => toggleAccountField(acc.id, field)} />
                            </div>
                          ))}
                          {customColumns.map(col => (
                            <div key={col.key} onClick={e => e.stopPropagation()} style={{ flexShrink: 0 }}>
                              {col.type === "checkbox" ? (
                                <Checkbox checked={!!acc.customFields[col.key]} onChange={() => updateCustomField(acc.id, col.key, !acc.customFields[col.key])} />
                              ) : (
                                <input value={acc.customFields[col.key] || ""} onChange={e => updateCustomField(acc.id, col.key, e.target.value)} style={{ ...inputStyle, width: 90 }} placeholder="—" />
                              )}
                            </div>
                          ))}
                        </div>
                        {/* Column labels on first row */}
                        {acc === accounts.filter(a => a.region === region)[0] && !acc.expanded && (
                          <div style={{ display: "flex", padding: "0 16px 8px", gap: 12, marginLeft: 28 }}>
                            <div style={{ flex: 1 }} />
                            <LabelChip>Joule</LabelChip><LabelChip>WalkMe</LabelChip>
                            <LabelChip>Ppl · Phases · Actions</LabelChip>
                            <LabelChip>Eng.</LabelChip><LabelChip>UC</LabelChip><LabelChip>PoC</LabelChip>
                            {customColumns.map(c => <LabelChip key={c.key}>{c.label}</LabelChip>)}
                          </div>
                        )}

                        {/* Expanded panel */}
                        {acc.expanded && (
                          <div style={{ borderTop: "1px solid #1a1a28" }}>
                            {/* Section tabs */}
                            <div style={{ display: "flex", gap: 0, padding: "0 16px", background: "#0c0c14", borderBottom: "1px solid #1a1a28" }}>
                              {sectionTabs.map(st => (
                                <button key={st.id} onClick={() => setExpandedSection(acc.id, st.id)} style={{
                                  padding: "10px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                                  borderBottom: acc.expandedSection === st.id ? "2px solid #c084fc" : "2px solid transparent",
                                  background: "none", color: acc.expandedSection === st.id ? "#e4e4e7" : "#6b7280",
                                  fontFamily: "'DM Sans', sans-serif", transition: "all .15s"
                                }}>{st.label}</button>
                              ))}
                            </div>

                            <div style={{ padding: "16px 20px 20px 20px", background: "#0e0e16" }}>

                              {/* CONTACTS SECTION */}
                              {acc.expandedSection === "contacts" && (
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#c084fc", fontFamily: "'Space Mono', monospace" }}>Contacts & Personas</span>
                                    <button onClick={() => addContact(acc.id)} style={{ ...btnSmall, background: "#c084fc20", color: "#c084fc", border: "1px solid #c084fc40" }}>+ Add Contact</button>
                                  </div>
                                  {acc.contacts.length === 0 ? (
                                    <div style={{ fontSize: 12, color: "#4b5563", padding: "8px 0", fontStyle: "italic" }}>No contacts yet — click "+ Add Contact" to map personas.</div>
                                  ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1.2fr 1.3fr 28px", gap: 8, paddingBottom: 4 }}>
                                        {["Name", "Role / Title", "Department", "Email", "Notes", ""].map(h => (
                                          <span key={h} style={{ fontSize: 10, color: "#4b5563", textTransform: "uppercase", letterSpacing: 1.2, fontFamily: "'Space Mono', monospace", fontWeight: 600 }}>{h}</span>
                                        ))}
                                      </div>
                                      {acc.contacts.map(contact => (
                                        <div key={contact.id} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1.2fr 1.3fr 28px", gap: 8, alignItems: "center" }}>
                                          <input value={contact.name} onChange={e => updateContact(acc.id, contact.id, "name", e.target.value)} placeholder="Full name" style={inputStyle} />
                                          <select value={contact.role} onChange={e => updateContact(acc.id, contact.id, "role", e.target.value)} style={selectStyle}>
                                            <option value="">Select role…</option>
                                            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                          </select>
                                          <select value={contact.department} onChange={e => updateContact(acc.id, contact.id, "department", e.target.value)} style={selectStyle}>
                                            <option value="">Select dept…</option>
                                            {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                          </select>
                                          <input value={contact.email} onChange={e => updateContact(acc.id, contact.id, "email", e.target.value)} placeholder="email@company.com" style={inputStyle} />
                                          <input value={contact.notes} onChange={e => updateContact(acc.id, contact.id, "notes", e.target.value)} placeholder="e.g. champion, blocker…" style={inputStyle} />
                                          <span onClick={() => removeContact(acc.id, contact.id)} style={{ cursor: "pointer", color: "#ef444480", fontSize: 16, textAlign: "center" }} title="Remove">×</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* PHASES SECTION */}
                              {acc.expandedSection === "phases" && (
                                <div>
                                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#c084fc", fontFamily: "'Space Mono', monospace", marginBottom: 12 }}>Account Phase Timeline</div>
                                  <p style={{ fontSize: 11, color: "#4b5563", marginBottom: 12 }}>Click a phase to cycle status. Add notes per phase for account-specific context.</p>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {acc.phases.map((phase, i) => {
                                      const sc = statusColor(phase.status);
                                      return (
                                        <div key={phase.id} style={{ background: "#12121a", borderRadius: 10, border: `1px solid ${sc.dot}25`, overflow: "hidden" }}>
                                          <div onClick={() => cycleAccountPhase(acc.id, phase.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", cursor: "pointer" }}>
                                            <div style={{ width: 30, height: 30, borderRadius: 8, background: sc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, color: sc.text, border: `1px solid ${sc.dot}40`, flexShrink: 0 }}>{i + 1}</div>
                                            <div style={{ flex: 1 }}>
                                              <div style={{ fontWeight: 600, fontSize: 13 }}>{phase.name}</div>
                                              <div style={{ fontSize: 11, color: "#6b7280" }}>{phase.description}</div>
                                            </div>
                                            <div style={{ fontSize: 11, color: "#4b5563", fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>{phase.target}</div>
                                            <div style={{ padding: "3px 10px", borderRadius: 16, fontSize: 10, fontWeight: 600, background: sc.bg, color: sc.text, border: `1px solid ${sc.dot}40`, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>{phase.status}</div>
                                          </div>
                                          <div style={{ padding: "0 16px 12px 60px" }}>
                                            <textarea value={phase.notes} onChange={e => updatePhaseNotes(acc.id, phase.id, e.target.value)} placeholder="Phase notes for this account…" style={{ ...textareaStyle, minHeight: 36, fontSize: 11 }} />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* ACTIONS SECTION */}
                              {acc.expandedSection === "actions" && (
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#c084fc", fontFamily: "'Space Mono', monospace" }}>Account Action Items</span>
                                    <button onClick={() => addAccountAction(acc.id)} style={{ ...btnSmall, background: "#c084fc20", color: "#c084fc", border: "1px solid #c084fc40" }}>+ Add Action</button>
                                  </div>
                                  {/* progress */}
                                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                    <span style={{ fontSize: 11, color: "#fbbf24", fontFamily: "'Space Mono', monospace", fontWeight: 600 }}>{acc.actions.filter(x => x.done).length}/{acc.actions.length}</span>
                                    <div style={{ flex: 1, height: 4, background: "#1f1f2e", borderRadius: 2, overflow: "hidden" }}>
                                      <div style={{ height: "100%", width: acc.actions.length ? `${(acc.actions.filter(x => x.done).length / acc.actions.length) * 100}%` : "0%", background: "linear-gradient(90deg, #818cf8, #c084fc)", borderRadius: 2, transition: "width .3s" }} />
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    {acc.actions.map(act => (
                                      <div key={act.id} style={{ background: "#12121a", borderRadius: 10, border: act.done ? "1px solid #34d39920" : "1px solid #1f1f2e", opacity: act.done ? 0.6 : 1, overflow: "hidden" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px" }}>
                                          <Checkbox checked={act.done} onChange={() => toggleAccountAction(acc.id, act.id)} />
                                          <div style={{ flex: 1, minWidth: 0 }}>
                                            <input value={act.action} onChange={e => updateActionField(acc.id, act.id, "action", e.target.value)} placeholder="Action item…" style={{ ...inputStyle, fontWeight: 600, background: "transparent", border: "none", padding: "2px 0", textDecoration: act.done ? "line-through" : "none" }} />
                                          </div>
                                          <input value={act.owner} onChange={e => updateActionField(acc.id, act.id, "owner", e.target.value)} placeholder="Owner" style={{ ...inputStyle, width: 110, fontSize: 11 }} />
                                          <input value={act.due} onChange={e => updateActionField(acc.id, act.id, "due", e.target.value)} placeholder="Due" style={{ ...inputStyle, width: 80, fontSize: 11, fontFamily: "'Space Mono', monospace" }} />
                                          <span onClick={() => removeAccountAction(acc.id, act.id)} style={{ cursor: "pointer", color: "#ef444480", fontSize: 14 }} title="Remove">×</span>
                                        </div>
                                        <div style={{ padding: "0 14px 10px 46px" }}>
                                          <textarea value={act.notes} onChange={e => updateActionNotes(acc.id, act.id, e.target.value)} placeholder="Notes / description…" style={{ ...textareaStyle, minHeight: 30, fontSize: 11 }} />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* NOTES SECTION */}
                              {acc.expandedSection === "notes" && (
                                <div>
                                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#c084fc", fontFamily: "'Space Mono', monospace", marginBottom: 12 }}>Account Notes & Description</div>
                                  <textarea value={acc.accountNotes} onChange={e => updateAccountNotes(acc.id, e.target.value)} placeholder={"General notes about this account…\n\nUse this space for:\n• Account strategy & objectives\n• Key decisions & outcomes\n• Risks & blockers\n• Meeting summaries\n• Any other account-level context"} style={{ ...textareaStyle, minHeight: 180, fontSize: 13, lineHeight: 1.7 }} />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function Card({ title, children, span }) {
  return (
    <div style={{ background: "#12121a", borderRadius: 12, border: "1px solid #1f1f2e", padding: "24px", gridColumn: span ? `span ${span}` : undefined }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#818cf8", fontFamily: "'Space Mono', monospace", marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}
function RegionCard({ region, leads, count, color }) {
  return (
    <div style={{ background: "#ffffff06", borderRadius: 10, padding: "16px", borderLeft: `3px solid ${color}` }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{region}</div>
      <div style={{ fontSize: 12, color: "#9ca3af" }}>{count} accounts · {leads}</div>
    </div>
  );
}
function LabelChip({ children }) {
  return <span style={{ fontSize: 9, color: "#4b5563", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Space Mono', monospace" }}>{children}</span>;
}
function StatusPill({ status, color }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 16, fontSize: 10, fontWeight: 600, background: `${color}15`, color, border: `1px solid ${color}30`, flexShrink: 0 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color }} />
      {status}
    </span>
  );
}
function Checkbox({ checked, onChange }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange(); }} style={{
      width: 20, height: 20, borderRadius: 5, border: checked ? "2px solid #818cf8" : "2px solid #3a3a4e",
      background: checked ? "#818cf8" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "all .2s", flexShrink: 0
    }}>
      {checked && <span style={{ color: "#0b0b0f", fontSize: 13, fontWeight: 700 }}>✓</span>}
    </div>
  );
}
