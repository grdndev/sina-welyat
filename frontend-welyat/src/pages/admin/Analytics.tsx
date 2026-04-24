import { useEffect, useState } from "react";
import Layout from "./Layout";
import Loading from "../Loading";
import { adminApi, type AdminAnalytics } from "../../api/admin";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid,
} from "recharts";

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex flex-col border border-primary/10 rounded-lg p-4 bg-background">
            <div className="text-sm text-text-secondary">{label}</div>
            <div className="text-3xl font-extrabold mt-1">{value}</div>
        </div>
    );
}

function shortDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function Analytics() {
    const [data, setData] = useState<AdminAnalytics | null>(null);

    useEffect(() => {
        let mounted = true;
        adminApi.getAnalytics()
            .then(res => { if (mounted) setData(res.data); })
            .catch(() => { if (mounted) setData(null); });
        return () => { mounted = false; };
    }, []);

    if (!data) return <Layout><Loading /></Layout>;

    const callsData = data.callsPerDay.map(d => ({ ...d, date: shortDate(d.date) }));
    const revenueData = data.revenuePerDay.map(d => ({ ...d, date: shortDate(d.date) }));

    return (
        <Layout>
            <div className="flex flex-col gap-8 p-6 md:p-10">
                <h2 className="text-2xl font-semibold">Analytics</h2>

                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard label="Total users" value={data.totalUsers} />
                    <StatCard label="Total calls" value={data.totalCalls} />
                    <StatCard label="Active listeners" value={data.activeListeners} />
                    <StatCard label="Active talkers" value={data.activeTalkers} />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="text-lg font-medium">Calls per day (last 30 days)</div>
                    <div className="border border-primary/10 rounded-lg p-4 bg-background">
                        {callsData.length === 0 ? (
                            <div className="text-text-secondary text-sm py-8 text-center">No data yet.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={callsData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--color-text-secondary, #888)" }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--color-text-secondary, #888)" }} />
                                    <Tooltip
                                        contentStyle={{ background: "var(--color-background, #111)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                                        labelStyle={{ color: "var(--color-text-primary, #fff)", fontSize: 12 }}
                                        itemStyle={{ color: "var(--color-text-secondary, #888)", fontSize: 12 }}
                                    />
                                    <Bar dataKey="count" name="Calls" fill="#6366f1" radius={[3, 3, 0, 0]} />
                                    <Bar dataKey="paidMinutes" name="Paid min" fill="#10b981" radius={[3, 3, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="text-lg font-medium">Revenue per day (last 30 days)</div>
                    <div className="border border-primary/10 rounded-lg p-4 bg-background">
                        {revenueData.length === 0 ? (
                            <div className="text-text-secondary text-sm py-8 text-center">No data yet.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={revenueData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--color-text-secondary, #888)" }} />
                                    <YAxis tick={{ fontSize: 11, fill: "var(--color-text-secondary, #888)" }} />
                                    <Tooltip
                                        contentStyle={{ background: "var(--color-background, #111)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                                        labelStyle={{ color: "var(--color-text-primary, #fff)", fontSize: 12 }}
                                        itemStyle={{ color: "var(--color-text-secondary, #888)", fontSize: 12 }}
                                        formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
