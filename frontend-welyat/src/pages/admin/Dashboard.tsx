import { useEffect, useMemo, useState } from "react";
import Layout from "./Layout";

import { ChevronRight } from "lucide-react";
import Loading from "../Loading";
import HealthIndicator from "../../components/HealthIndicator";
import { maxDecimals } from "../../utils";
import HealthDependentBackground from "../../components/HealthDependentBackground";
import { adminApi, type AdminMetrics, type BusinessMode } from "../../api/admin";

type AdminData = {
    margin: number;
    paid_hours: number;
    net_amount: number;
    net_delta: number;
    health_balance: number;
    average_cost: number;
    paid_free_ratio: number;
    average_hourly_yield: number;

    // new requested KPIs
    net_profit_per_paid_minute_month: number;
    paid_minutes_today: number;
    paid_minutes_week: number;
    paid_minutes_month: number;

    // audit
    revenue_month: number;
    costs_month: number;
}

const BalanceHealth = ({healthBalance}: {healthBalance: number}) => {
    const messages = [
        "Good balance",
        "Refine balance",
        "Danger"
    ];

    return <HealthIndicator value={healthBalance} tiers={[90,30]} message={messages} bgColor={true} />
}

const AverageCostHealth = ({averageCost}: {averageCost: number}) => {
    const messages = [
        "Healthy",
        "Caution",
        "Danger"
    ];

    return <HealthIndicator value={averageCost} tiers={[0.2, 0.5]} message={messages} reverse={true} textColor={true} />
}

const PaidFreeHealth = ({averageCost}: {averageCost: number}) => {
    const messages = [
        "Healthy",
        "Average",
        "Danger"
    ];

    return <HealthIndicator value={averageCost} tiers={[0.3, 0.7]} message={messages} reverse={true} textColor={true} />
}

const AverageHourlyHealth = ({averageCost}: {averageCost: number}) => {
    const messages = [
        "Strong",
        "Average",
        "Weak",
    ];

    return <HealthIndicator value={averageCost} tiers={[5, 10]} message={messages} textColor={true} />
}

export default function Dashboard() {
    const [data, setData] = useState<AdminData | null>(null);
    const [modes, setModes] = useState<BusinessMode[]>([]);
    const [showModePicker, setShowModePicker] = useState(false);
    const [showFinancial, setShowFinancial] = useState(false);
    const [busyAction, setBusyAction] = useState<string | null>(null);

    const activeMode = useMemo(() => modes.find(m => m.is_active), [modes]);

    useEffect(() => {
        let mounted = true;
        adminApi.getMetrics()
            .then((res) => {
                if (!mounted) return;
                const m: AdminMetrics = res.data;

                // Keep existing UI fields but replace with something coherent.
                // If you later add proper backend fields for these, remove the placeholders.
                const paidHoursMonth = m.paidMinutesMonth / 60;
                const netMonth = m.revenueMonth - m.costsMonth;

                setData({
                    margin: m.revenueMonth > 0 ? (netMonth / m.revenueMonth) * 100 : 0,
                    paid_hours: paidHoursMonth,
                    net_amount: netMonth,
                    net_delta: 0,
                    health_balance: 100,
                    average_cost: 0,
                    paid_free_ratio: 0,
                    average_hourly_yield: paidHoursMonth > 0 ? netMonth / paidHoursMonth : 0,

                    net_profit_per_paid_minute_month: m.netProfitPerPaidMinuteMonth,
                    paid_minutes_today: m.paidMinutesToday,
                    paid_minutes_week: m.paidMinutesWeek,
                    paid_minutes_month: m.paidMinutesMonth,

                    revenue_month: m.revenueMonth,
                    costs_month: m.costsMonth,
                });
            })
            .catch(() => {
                if (!mounted) return;
                setData(null);
            });

        adminApi.getBusinessModes()
            .then((res) => {
                if (!mounted) return;
                setModes(res.data?.modes ?? []);
            })
            .catch(() => {
                if (!mounted) return;
                setModes([]);
            });

        return () => { mounted = false; };
    }, []);

    const refreshModes = async () => {
        const res = await adminApi.getBusinessModes();
        setModes(res.data?.modes ?? []);
    };

    const onActivateMode = async (id: number) => {
        try {
            setBusyAction("activate_mode");
            await adminApi.activateBusinessMode(id);
            await refreshModes();
            setShowModePicker(false);
        } finally {
            setBusyAction(null);
        }
    };

    const onExecuteRedistribution = async () => {
        const raw = window.prompt("Redistribute Cloud XP: percentage (1-100)", "10");
        if (raw == null) return;
        const percentage = Number(raw);
        if (!Number.isFinite(percentage) || percentage < 1 || percentage > 100) {
            window.alert("Percentage should be between 1 and 100");
            return;
        }

        try {
            setBusyAction("redistribute_xp");
            await adminApi.executeRedistribution(percentage);
            window.alert("Cloud XP redistribution executed.");
        } catch (e: any) {
            window.alert(e?.message || "Redistribution failed");
        } finally {
            setBusyAction(null);
        }
    };

    if (!data) {
        return <Loading />;
    }

    return <Layout>
        <div className="flex flex-col gap-6 p-10">
            {/* Requested KPIs */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col border border-primary/10 rounded-lg p-4 bg-background">
                    <div className="text-sm text-text-secondary">Net profit / paid minute (month)</div>
                    <div className="text-3xl font-extrabold">${maxDecimals(data.net_profit_per_paid_minute_month, 4)}</div>
                    <div className="text-xs text-text-secondary mt-1">(Revenue − Costs) / Paid minutes · paid minutes only</div>
                </div>

                <div className="flex flex-col border border-primary/10 rounded-lg p-4 bg-background">
                    <div className="text-sm text-text-secondary">Paid minutes (activity)</div>
                    <div className="mt-2 grid grid-cols-3 gap-3">
                        <div className="rounded-lg border border-primary/10 p-3">
                            <div className="text-[11px] text-text-secondary uppercase tracking-wider">Today</div>
                            <div className="text-xl font-bold">{data.paid_minutes_today}</div>
                        </div>
                        <div className="rounded-lg border border-primary/10 p-3">
                            <div className="text-[11px] text-text-secondary uppercase tracking-wider">Week</div>
                            <div className="text-xl font-bold">{data.paid_minutes_week}</div>
                        </div>
                        <div className="rounded-lg border border-primary/10 p-3">
                            <div className="text-[11px] text-text-secondary uppercase tracking-wider">Month</div>
                            <div className="text-xl font-bold">{data.paid_minutes_month}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5 border-t border-primary/10">
                <div className="flex flex-col gap-4 grow border-r border-primary/10 py-5 pr-5">
                    <div className="text-2xl tracking-wide">Platform state</div>
                    <div className="border rounded-lg border-primary/10 bg-background">
                        <HealthDependentBackground
                            value={data.health_balance}
                            tiers={[90,30]}
                            className="flex flex-col gap-2 p-5">
                                <div className="text-4xl tracking-tight">{maxDecimals(data.health_balance,2)} %</div>
                                <BalanceHealth healthBalance={data.health_balance} />
                                <div>
                                    Slight adjustments are needed to improve stability.<br />
                                    Refine Mode recommended.
                                </div>
                        </HealthDependentBackground>
                    </div>
                </div>
                <div className="flex flex-col gap-3 md:w-1/4 md:p-5">
                    <div className="text-2xl tracking-wide">Admin actions</div>
                    <button
                        onClick={() => setShowModePicker(v => !v)}
                        disabled={busyAction != null}
                        className="flex items-center justify-center rounded-lg p-3 bg-linear-to-r from-green-300/40 hover:from-green-300/50 to-emerald-400/50 hover:to-emerald-400/60 cursor-pointer disabled:opacity-60">
                        {activeMode ? `Select mode (current: ${activeMode.mode_name})` : "Select mode"}
                    </button>

                    {showModePicker && (
                        <div className="rounded-lg border border-primary/10 bg-background p-3">
                            <div className="text-xs text-text-secondary mb-2">Choose the active business mode:</div>
                            <div className="flex flex-col gap-2">
                                {modes.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => onActivateMode(m.id)}
                                        disabled={busyAction === "activate_mode"}
                                        className={`flex items-center justify-between rounded-md border border-primary/10 px-3 py-2 hover:bg-background/80 disabled:opacity-60 ${m.is_active ? "bg-background/70" : "bg-background"}`}
                                    >
                                        <span className="text-sm">{m.mode_name}</span>
                                        <span className="text-xs text-text-secondary">{m.is_active ? "Active" : ""}</span>
                                    </button>
                                ))}
                                {modes.length === 0 && (
                                    <div className="text-xs text-text-secondary">No modes found.</div>
                                )}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onExecuteRedistribution}
                        disabled={busyAction != null}
                        className="flex items-center justify-center rounded-lg p-3 bg-linear-to-r from-red-300/40 hover:from-red-300/50 to-red-400/50 hover:to-red-400/60 cursor-pointer disabled:opacity-60">
                        {busyAction === "redistribute_xp" ? "Distributing..." : "Distribute Cloud XP"}
                    </button>

                    <button
                        onClick={() => setShowFinancial(v => !v)}
                        className="flex items-center justify-center rounded-lg p-3 bg-linear-to-r from-gray-300/40 hover:from-gray-300/50 to-slate-400/50 hover:to-slate-400/60 cursor-pointer">
                        Financial details
                    </button>
                </div>
            </div>

            {showFinancial && (
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col border border-primary/10 rounded-lg p-4 bg-background">
                        <div className="text-sm text-text-secondary">Revenue (month)</div>
                        <div className="text-2xl font-bold">${maxDecimals(data.revenue_month, 2)}</div>
                    </div>
                    <div className="flex flex-col border border-primary/10 rounded-lg p-4 bg-background">
                        <div className="text-sm text-text-secondary">Costs (month)</div>
                        <div className="text-2xl font-bold">${maxDecimals(data.costs_month, 2)}</div>
                    </div>
                    <div className="flex flex-col border border-primary/10 rounded-lg p-4 bg-background">
                        <div className="text-sm text-text-secondary">Net (month)</div>
                        <div className="text-2xl font-bold">${maxDecimals(data.revenue_month - data.costs_month, 2)}</div>
                    </div>

                    <div className="md:col-span-3 rounded-lg border border-primary/10 bg-background p-4">
                        <div className="text-sm text-text-secondary mb-2">Costs definition (currently from DB + env):</div>
                        <ul className="text-sm grid gap-1 md:grid-cols-2">
                            <li>Payouts listeners (DB): included</li>
                            <li>Twilio costs (env): included</li>
                            <li>Stripe fees (env): included</li>
                            <li>Infra costs (env): included</li>
                        </ul>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
                <div className="flex flex-col border border-primary/10 rounded-lg p-4 bg-background">
                    <div>Average cost / minute</div>
                    <div className="flex text-3xl items-center gap-2">
                        <div>{data.average_cost.toFixed(2)} $</div>
                        <div className="text-xl">
                            <AverageCostHealth averageCost={data.average_cost} />
                        </div>
                    </div>
                </div>
                <div className="border border-primary/10 rounded-lg bg-background">
                    <HealthDependentBackground
                        value={data.paid_free_ratio}
                        tiers={[0.3, 0.7]}
                        reverse={true}
                        className="flex flex-col p-4">
                            <div>Balance paid / free</div>
                            <div className="flex text-3xl items-center gap-2">
                                <div>{data.paid_free_ratio.toFixed(2)}</div>
                                <div className="text-xl">
                                    <PaidFreeHealth averageCost={data.paid_free_ratio} />
                                </div>
                            </div>
                    </HealthDependentBackground>
                </div>
                <div className="flex flex-col border border-primary/10 rounded-lg p-4 bg-background">
                    <div>Yield / active hour</div>
                    <div className="flex text-3xl items-center gap-2">
                        <div>{maxDecimals(data.average_hourly_yield,2)} $</div>
                        <div className="text-xl">
                            <AverageHourlyHealth averageCost={data.average_hourly_yield} />
                        </div>
                    </div>
                </div>
            </div>
            {/* <button className="mx-auto flex border border-primary/10 rounded-full bg-background hover:bg-background/80 py-2 px-6 cursor-pointer">
                <span>Financial details</span>
                <ChevronRight />
            </button> */}
        </div>
    </Layout>
}