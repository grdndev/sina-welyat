import { useEffect, useRef, useState, useCallback } from "react";
import Layout from "./Layout";
import Loading from "../Loading";
import { adminApi, type AdminUser, type BusinessMode } from "../../api/admin";

// ─── Users ───────────────────────────────────────────────────────────────────

const ROLES = ["", "talker", "listener", "both", "admin"] as const;
const PAGE_SIZE = 15;

function UsersSection() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<string | null>(null);

    const load = useCallback(async (s: string, r: string, p: number) => {
        setLoading(true);
        try {
            const res = await adminApi.getUsers({ search: s || undefined, role: r || undefined, limit: PAGE_SIZE, offset: p * PAGE_SIZE });
            setUsers(res.data);
            setTotal(res.pagination.total);
        } catch {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(search, role, page); }, [search, role, page, load]);

    const onSearch = (v: string) => { setSearch(v); setPage(0); };
    const onRole = (v: string) => { setRole(v); setPage(0); };

    const promote = async (id: string) => {
        setBusy(id);
        try {
            await adminApi.promoteUser(id);
            await load(search, role, page);
        } catch (e: any) {
            window.alert(e?.message || "Failed");
        } finally {
            setBusy(null);
        }
    };

    const toggleBan = async (u: AdminUser) => {
        const action = u.is_active ? "ban" : "unban";
        if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${u.email}?`)) return;
        setBusy(u.id + "_ban");
        try {
            await adminApi.banUser(u.id, u.is_active);
            await load(search, role, page);
        } catch (e: any) {
            window.alert(e?.message || "Failed");
        } finally {
            setBusy(null);
        }
    };

    const grantMinutes = async (u: AdminUser) => {
        const raw = window.prompt(`Grant free minutes to ${u.email} (current bonus: ${Math.round((u.bonus_seconds ?? 0) / 60)} min)`, "30");
        if (raw == null) return;
        const minutes = parseInt(raw, 10);
        if (!Number.isFinite(minutes) || minutes < 1) {
            window.alert("Enter a positive integer.");
            return;
        }
        setBusy(u.id + "_grant");
        try {
            await adminApi.grantMinutes(u.id, minutes);
            await load(search, role, page);
        } catch (e: any) {
            window.alert(e?.message || "Failed");
        } finally {
            setBusy(null);
        }
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <section className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Users</h3>
            <div className="flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Search by email or name…"
                    value={search}
                    onChange={e => onSearch(e.target.value)}
                    className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 w-64"
                />
                <select
                    value={role}
                    onChange={e => onRole(e.target.value)}
                    className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50">
                    <option value="">All roles</option>
                    {ROLES.filter(Boolean).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <span className="self-center text-sm text-text-secondary">{total} users</span>
            </div>

            {loading ? <Loading /> : (
                <div className="overflow-x-auto rounded-lg border border-primary/10">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-primary/10 text-text-secondary text-left">
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Phone</th>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Founding</th>
                                <th className="px-4 py-3 font-medium">XP</th>
                                <th className="px-4 py-3 font-medium">Rep</th>
                                <th className="px-4 py-3 font-medium">Bonus min.</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Joined</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && (
                                <tr><td colSpan={11} className="px-4 py-8 text-center text-text-secondary">No users found.</td></tr>
                            )}
                            {users.map(u => (
                                <tr key={u.id} className={`border-b border-primary/5 hover:bg-primary/5 transition ${!u.is_active ? "opacity-50" : ""}`}>
                                    <td className="px-4 py-3">{u.email}</td>
                                    <td className="px-4 py-3 text-text-secondary">{u.phone || "—"}</td>
                                    <td className="px-4 py-3 text-text-secondary">{[u.firstname, u.lastname].filter(Boolean).join(" ") || "—"}</td>
                                    <td className="px-4 py-3">{u.role}</td>
                                    <td className="px-4 py-3">
                                        {u.is_founding ? (
                                            <span className="text-yellow-400">
                                                ✓ {u.founding_end_date ? new Date(u.founding_end_date).toLocaleDateString() : ""}
                                            </span>
                                        ) : "—"}
                                    </td>
                                    <td className="px-4 py-3">{u.total_xp}</td>
                                    <td className="px-4 py-3">{u.reputation_score}</td>
                                    <td className="px-4 py-3">{Math.round((u.bonus_seconds ?? 0) / 60)}</td>
                                    <td className="px-4 py-3">
                                        {u.is_active
                                            ? <span className="text-green-400 text-xs">Active</span>
                                            : <span className="text-red-400 text-xs">Banned</span>}
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        {u.role !== 'admin' && (
                                            <div className="flex flex-wrap gap-1">
                                                <button
                                                    onClick={() => promote(u.id)}
                                                    disabled={busy === u.id}
                                                    className="rounded px-2 py-1 text-xs border border-primary/20 hover:border-primary/50 disabled:opacity-40 cursor-pointer">
                                                    {busy === u.id ? "…" : u.is_founding ? "Reset founding" : "Make founding"}
                                                </button>
                                                <button
                                                    onClick={() => grantMinutes(u)}
                                                    disabled={busy === u.id + "_grant"}
                                                    className="rounded px-2 py-1 text-xs border border-blue-400/40 hover:border-blue-400/70 disabled:opacity-40 cursor-pointer">
                                                    {busy === u.id + "_grant" ? "…" : "+ minutes"}
                                                </button>
                                                <button
                                                    onClick={() => toggleBan(u)}
                                                    disabled={busy === u.id + "_ban"}
                                                    className={`rounded px-2 py-1 text-xs border disabled:opacity-40 cursor-pointer ${u.is_active ? "border-red-400/40 hover:border-red-400/70 text-red-400" : "border-green-400/40 hover:border-green-400/70 text-green-400"}`}>
                                                    {busy === u.id + "_ban" ? "…" : u.is_active ? "Ban" : "Unban"}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center gap-3 justify-end">
                    <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1 rounded border border-primary/20 text-sm disabled:opacity-40 hover:border-primary/40">← Prev</button>
                    <span className="text-sm text-text-secondary">{page + 1} / {totalPages}</span>
                    <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 rounded border border-primary/20 text-sm disabled:opacity-40 hover:border-primary/40">Next →</button>
                </div>
            )}
        </section>
    );
}

// ─── Business Modes ───────────────────────────────────────────────────────────

type EditState = {
    free_duration_minutes: string;
    price_per_minute_client: string;
    earn_per_minute_listener: string;
    xp_per_minutes: string;
    timeout_matching: string;
};

function modeToEdit(m: BusinessMode): EditState {
    return {
        free_duration_minutes: String(m.free_duration_minutes ?? ""),
        price_per_minute_client: String(m.price_per_minute_client ?? ""),
        earn_per_minute_listener: String(m.earn_per_minute_listener ?? ""),
        xp_per_minutes: String(m.xp_per_minutes ?? ""),
        timeout_matching: String(m.timeout_matching ?? ""),
    };
}

function ModesSection() {
    const [modes, setModes] = useState<BusinessMode[]>([]);
    const [edits, setEdits] = useState<Record<number, EditState>>({});
    const [busy, setBusy] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.getBusinessModes()
            .then(res => {
                const m = res.data?.modes ?? [];
                setModes(m);
                const init: Record<number, EditState> = {};
                m.forEach(mode => { init[mode.id] = modeToEdit(mode); });
                setEdits(init);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const onChange = (id: number, field: keyof EditState, value: string) => {
        setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    };

    const save = async (id: number) => {
        const e = edits[id];
        if (!e) return;
        setBusy(id);
        try {
            await adminApi.updateBusinessMode(id, {
                free_duration_minutes: Number(e.free_duration_minutes),
                price_per_minute_client: Number(e.price_per_minute_client),
                earn_per_minute_listener: Number(e.earn_per_minute_listener),
                xp_per_minutes: Number(e.xp_per_minutes),
                timeout_matching: Number(e.timeout_matching),
            } as any);
        } catch (err: any) {
            window.alert(err?.message || "Save failed");
        } finally {
            setBusy(null);
        }
    };

    if (loading) return <Loading />;

    return (
        <section className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Business Modes</h3>
            <div className="grid gap-4 md:grid-cols-3">
                {modes.map(m => (
                    <div key={m.id} className="flex flex-col gap-3 border border-primary/10 rounded-lg p-4 bg-background">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">{m.mode_name}</span>
                            {m.is_active && <span className="text-xs text-green-400 border border-green-400/30 rounded-full px-2 py-0.5">Active</span>}
                        </div>
                        {edits[m.id] && (
                            <div className="flex flex-col gap-2 text-sm">
                                {([
                                    ["Free minutes", "free_duration_minutes"],
                                    ["Price/min client ($)", "price_per_minute_client"],
                                    ["Earn/min listener ($)", "earn_per_minute_listener"],
                                    ["XP/min", "xp_per_minutes"],
                                    ["Match timeout (s)", "timeout_matching"],
                                ] as [string, keyof EditState][]).map(([label, field]) => (
                                    <div key={field} className="flex items-center justify-between gap-2">
                                        <span className="text-text-secondary">{label}</span>
                                        <input
                                            type="number"
                                            value={edits[m.id][field]}
                                            onChange={e => onChange(m.id, field, e.target.value)}
                                            className="w-24 rounded border border-primary/20 bg-background px-2 py-1 text-right outline-none focus:border-primary/50"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => save(m.id)}
                                    disabled={busy === m.id}
                                    className="mt-1 rounded-lg border border-primary/20 px-3 py-2 text-sm hover:border-primary/50 disabled:opacity-40 cursor-pointer">
                                    {busy === m.id ? "Saving…" : "Save"}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

// ─── Tech fees ───────────────────────────────────────────────────────────────

function TechFeesSection() {
    const [fees, setFees] = useState<Record<string, string>>({ twilio: "", infra: "", stripe: "" });
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        adminApi.getFees()
            .then(res => {
                const feeList = res.data?.fees ?? [];
                const feeMap = { twilio: "", infra: "", stripe: "" };
                feeList.forEach(f => {
                    if (f.type === "twilio") feeMap.twilio = String(f.amount_cents / 100);
                    if (f.type === "infra") feeMap.infra = String(f.amount_cents / 100);
                    if (f.type === "stripe") feeMap.stripe = String(f.amount_cents / 100);
                });
                setFees(feeMap);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleFeeChange = (type: string, value: string) => {
        setFees(prev => ({ ...prev, [type]: value }));
    };

    const saveFees = async () => {
        setBusy(true);
        try {
            await adminApi.updateFees({
                twilio: Number(fees.twilio),
                infra: Number(fees.infra),
                stripe: Number(fees.stripe),
            } as any);
            window.alert("Fees updated successfully.");
        } catch (err: any) {
            window.alert(err?.message || "Failed to update fees");
        } finally {
            setBusy(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <section className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Tech Fees</h3>
            <div className="flex flex-col gap-3 border border-primary/10 rounded-lg p-4 bg-background max-w-md">
                {([
                    ["Twilio Fee ($)", "twilio"],
                    ["Infrastructure Fee ($)", "infra"],
                    ["Stripe Fee ($)", "stripe"],
                ] as [string, string][]).map(([label, type]) => (
                    <div key={type} className="flex items-center justify-between gap-2">
                        <span className="text-text-secondary">{label}</span>
                        <input
                            type="number"
                            value={fees[type]}
                            onChange={e => handleFeeChange(type, e.target.value)}
                            className="w-24 rounded border border-primary/20 bg-background px-2 py-1 text-right outline-none focus:border-primary/50"
                            step="0.01"
                        />
                    </div>
                ))}
                <button
                    onClick={saveFees}
                    disabled={busy}
                    className="mt-2 rounded-lg border border-primary/20 px-3 py-2 text-sm hover:border-primary/50 disabled:opacity-40 cursor-pointer">
                    {busy ? "Saving…" : "Save"}
                </button>
            </div>
        </section>
    );
}

// ─── Disclaimer ───────────────────────────────────────────────────────────────

function DisclaimerSection() {
    const [currentVersion, setCurrentVersion] = useState<number | null>(null);
    const [busy, setBusy] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    const loadDisclaimer = useCallback(async () => {
        try {
            const res = await adminApi.getDisclaimer();
            const { version, content } = res.data;
            setCurrentVersion(version);
            if (editorRef.current) {
                editorRef.current.innerHTML = content ?? "";
            }
        } catch {}
    }, []);

    useEffect(() => { loadDisclaimer(); }, [loadDisclaimer]);

    const execFormat = (command: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false);
    };

    const getHTML = () => {
        if (!editorRef.current) return "";
        let html = editorRef.current.innerHTML;
        // Normalize Chrome/Safari div-based line breaks to <br/>
        html = html.replace(/<div><br\s*\/?><\/div>/gi, "<br/>");
        html = html.replace(/<div>/gi, "<br/>");
        html = html.replace(/<\/div>/gi, "");
        // Normalize <br> → <br/>
        html = html.replace(/<br\s*>/gi, "<br/>");
        // Strip leading/trailing <br/>
        html = html.replace(/^(<br\s*\/>)+/, "").replace(/(<br\s*\/>)+$/, "");
        return html.trim();
    };

    const save = async () => {
        const content = getHTML();
        if (!content) {
            window.alert("Content is required.");
            return;
        }
        if (!window.confirm("Update disclaimer? All users will need to re-accept it.")) return;
        setBusy(true);
        try {
            const res = await adminApi.updateDisclaimer(content);
            setCurrentVersion(res.data.version);
            window.alert(`Disclaimer published as v${res.data.version}.`);
        } catch (e: any) {
            window.alert(e?.message || "Failed");
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">Disclaimer</h3>
                {currentVersion && (
                    <span className="text-xs text-text-secondary border border-primary/20 rounded-full px-2 py-0.5">
                        v{currentVersion}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-primary/10 bg-background p-4">
                {/* Toolbar */}
                <div className="flex gap-1 border-b border-primary/10 pb-2">
                    {([
                        ["B", "bold", "font-bold"],
                        ["I", "italic", "italic"],
                        ["U", "underline", "underline"],
                    ] as [string, string, string][]).map(([label, cmd, cls]) => (
                        <button
                            key={cmd}
                            type="button"
                            onMouseDown={e => { e.preventDefault(); execFormat(cmd); }}
                            className={`${cls} w-7 h-7 rounded text-sm border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition cursor-pointer`}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Editable area */}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            document.execCommand("insertHTML", false, "<br/>");
                        }
                    }}
                    className="min-h-48 text-sm outline-none py-2 leading-relaxed"
                />
            </div>

            <button
                onClick={save}
                disabled={busy}
                className="self-end rounded-lg px-4 py-2 text-sm bg-linear-to-r from-red-300/40 to-red-400/50 hover:from-red-300/50 hover:to-red-400/60 disabled:opacity-40 cursor-pointer">
                {busy ? "Publishing…" : "Publish disclaimer"}
            </button>
        </section>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Settings() {
    return (
        <Layout>
            <div className="flex flex-col gap-10 p-6 md:p-10">
                <h2 className="text-2xl font-semibold">Settings</h2>
                <UsersSection />
                <div className="border-t border-primary/10" />
                <ModesSection />
                <div className="border-t border-primary/10" />
                <TechFeesSection />
                <div className="border-t border-primary/10" />
                <DisclaimerSection />
            </div>
        </Layout>
    );
}
