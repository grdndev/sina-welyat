import { useEffect, useState, useCallback } from "react";
import Layout from "./Layout";
import Loading from "../Loading";
import { adminApi, type AdminSession } from "../../api/admin";

const STATUS_FILTERS = ["all", "waiting", "active_free", "alerted", "active_paid", "ended", "cancelled"] as const;

const statusColor: Record<string, string> = {
    waiting: "text-yellow-400",
    active_free: "text-blue-400",
    alerted: "text-orange-400",
    active_paid: "text-green-400",
    ended: "text-text-secondary",
    cancelled: "text-red-400",
};

function fmt(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
}

function userName(u: AdminSession["talker"]) {
    if (!u) return "—";
    const name = [u.firstname, u.lastname].filter(Boolean).join(" ");
    return name || u.email;
}

const PAGE_SIZE = 20;

export default function Sessions() {
    const [sessions, setSessions] = useState<AdminSession[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    const load = useCallback(async (status: string, pageIdx: number) => {
        setLoading(true);
        try {
            const res = await adminApi.getSessions({
                status: status === "all" ? undefined : status,
                limit: PAGE_SIZE,
                offset: pageIdx * PAGE_SIZE,
            });
            setSessions(res.data);
            setTotal(res.pagination.total);
        } catch {
            setSessions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load(statusFilter, page);
    }, [statusFilter, page, load]);

    const onStatusChange = (s: string) => {
        setStatusFilter(s);
        setPage(0);
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <Layout>
            <div className="flex flex-col gap-6 p-6 md:p-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Sessions</h2>
                    <span className="text-sm text-text-secondary">{total} total</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map(s => (
                        <button
                            key={s}
                            onClick={() => onStatusChange(s)}
                            className={`rounded-full px-3 py-1 text-sm border transition ${statusFilter === s ? "border-primary bg-primary/10 text-text-primary" : "border-primary/20 text-text-secondary hover:border-primary/40"}`}>
                            {s}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <Loading />
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-primary/10">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-primary/10 text-text-secondary text-left">
                                    <th className="px-4 py-3 font-medium">ID</th>
                                    <th className="px-4 py-3 font-medium">Talker</th>
                                    <th className="px-4 py-3 font-medium">Listener</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Mode</th>
                                    <th className="px-4 py-3 font-medium">Free</th>
                                    <th className="px-4 py-3 font-medium">Paid</th>
                                    <th className="px-4 py-3 font-medium">Cost</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-8 text-center text-text-secondary">No sessions found.</td>
                                    </tr>
                                )}
                                {sessions.map(s => (
                                    <tr key={s.id} className="border-b border-primary/5 hover:bg-primary/5 transition">
                                        <td className="px-4 py-3 font-mono text-xs text-text-secondary">{s.id.slice(0, 8)}…</td>
                                        <td className="px-4 py-3">{userName(s.talker)}</td>
                                        <td className="px-4 py-3">{userName(s.listener)}</td>
                                        <td className={`px-4 py-3 font-medium ${statusColor[s.status] ?? ""}`}>{s.status}</td>
                                        <td className="px-4 py-3 text-text-secondary">{s.BusinessMode?.mode_name ?? "—"}</td>
                                        <td className="px-4 py-3 text-text-secondary">{fmt(s.duration_free_seconds)}</td>
                                        <td className="px-4 py-3 text-text-secondary">{fmt(s.duration_paid_seconds)}</td>
                                        <td className="px-4 py-3">${Number(s.total_cost_client).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-text-secondary text-xs">{new Date(s.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center gap-3 justify-end">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                            className="px-3 py-1 rounded border border-primary/20 text-sm disabled:opacity-40 hover:border-primary/40">
                            ← Prev
                        </button>
                        <span className="text-sm text-text-secondary">{page + 1} / {totalPages}</span>
                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1 rounded border border-primary/20 text-sm disabled:opacity-40 hover:border-primary/40">
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}
