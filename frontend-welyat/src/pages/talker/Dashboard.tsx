import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { Phone, MessageCircleHeart, Clock, Star, ChevronRight, PhoneCall, Gift, DollarSign, TrendingUp, Zap } from "lucide-react";
import { PolarAngleAxis, RadialBar, RadialBarChart, AreaChart, Area, CartesianGrid } from "recharts";
import Loading from "../Loading";
import { maxDecimals } from "../../utils";
import { subscriptionsApi, type UserSubscription } from "../../api/subscriptions";

type TalkerData = {
    reputation: number;
    total_talk_minutes: number;
    session_duration: number;
    last_calls: LastCall[];
    weekly_activity: { value: number }[];
    free_minutes_remaining: number;
    price_per_minute: number;
    spend_today: number;
    spend_month: number;
};

type LastCall = {
    duration_total: number;
    rating?: number;
    date: string;
};

function toHoursAndMinutes(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}


export default function Dashboard() {
    const [data, setData] = useState<TalkerData | null>(null);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        subscriptionsApi.getCurrent()
            .then((res) => setSubscription(res.data.subscription))
            .catch(() => setSubscription(null));
    }, []);

    if (!data) {
        setData({
            reputation: maxDecimals(Math.random() * 100, 2),
            total_talk_minutes: Math.floor(Math.random() * 1200),
            session_duration: Math.floor(Math.random() * 120),
            last_calls: [
                { duration_total: Math.floor(Math.random() * 45) + 5, rating: Math.floor(Math.random() * 2) + 4, date: new Date(Date.now() - 86400000).toISOString() },
                { duration_total: Math.floor(Math.random() * 45) + 5, rating: Math.floor(Math.random() * 2) + 4, date: new Date(Date.now() - 2 * 86400000).toISOString() },
                { duration_total: Math.floor(Math.random() * 45) + 5, date: new Date(Date.now() - 3 * 86400000).toISOString() },
            ],
            weekly_activity: Array.from({ length: 7 }, () => ({ value: Math.floor(Math.random() * 60) })),
        free_minutes_remaining: 15,
        price_per_minute: 0.33,
        spend_today: parseFloat((Math.random() * 5).toFixed(2)),
        spend_month: parseFloat((Math.random() * 40).toFixed(2)),
        });
        return <Loading />;
    }


    return (
        <Layout>
            <div className="px-3 py-6">
                <div className="flex md:flex-row flex-col gap-4">

                    {/* ---- LEFT: Stats ---- */}
                    <div className="md:w-5/18 flex flex-col gap-2 rounded-2xl border border-primary/10 bg-gradient-to-br from-background-from to-background-to p-4">
                        <div className="text-xl font-bold uppercase tracking-wider">My stats</div>

                        {/* Reputation */}
                        <div className="flex flex-col rounded-xl border border-primary/10 bg-background p-3 aspect-square overflow-hidden">
                            <div className="text-lg font-medium tracking-wide uppercase">Reputation score</div>
                            <div className="grow flex flex-col items-center justify-center relative">
                                <div className="text-4xl font-bold">{data.reputation}%</div>
                                <div className="text-xs text-text-secondary">Quality</div>
                                <div className="absolute h-full">
                                    <RadialBarChart
                                        style={{ width: "100%", height: "100%" }}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="80%"
                                        outerRadius="100%"
                                        startAngle={240}
                                        endAngle={-60}
                                        data={[{ value: data.reputation }]}
                                    >
                                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                                        <RadialBar dataKey="value" cornerRadius={10} fill="#8e5cff" background />
                                    </RadialBarChart>
                                </div>
                            </div>
                        </div>

                        {/* Total talk time */}
                        <div className="rounded-xl border border-primary/10 bg-background p-3">
                            <div className="text-lg font-medium tracking-wide uppercase">Speaking time</div>
                            <div className="mt-2 flex items-center justify-between py-4 gap-2">
                                <div className="text-4xl font-bold tracking-wide">
                                    {toHoursAndMinutes(data.total_talk_minutes)}
                                </div>
                                <MessageCircleHeart size={70} className="text-primary opacity-80" />
                            </div>
                            <div className="border-t border-primary/10 pt-3 mt-2 text-sm text-text-secondary">
                                <div className="flex gap-2 items-center">
                                    <div className="rounded-full w-3 h-3 bg-accent" />
                                    <div>Total cumulative</div>
                                    <div className="ml-auto">{toHoursAndMinutes(data.total_talk_minutes)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Session today */}
                        <div className="flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-green-500/30 p-3">
                            <span className="h-4 w-4 rounded-full bg-emerald-400 animate-pulse ring-2 ring-emerald-400 shrink-0"></span>
                            <div className="grow pl-1">
                                <div className="font-bold tracking-wider uppercase text-sm">Active today</div>
                                <div className="text-text-secondary text-xs">
                                    Session: {toHoursAndMinutes(data.session_duration)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---- CENTER: Call Button + History ---- */}
                    <div className="flex flex-col gap-4 grow">
                        {/* Call card */}
                        <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-background-from to-background-to p-6 flex flex-col items-center gap-6">
                            <div className="text-xl font-bold uppercase tracking-wider self-start">Start a call</div>

                            {/* Big call button */}
                            <div className="flex flex-col items-center gap-4 py-6 w-full">
                                <button
                                    onClick={() => navigate("/call")}
                                    className="relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105"
                                    style={{
                                        background: "linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)",
                                        boxShadow: "0 8px 30px rgba(122, 76, 255, 0.45)",
                                    }}
                                >
                                    <PhoneCall size={52} color="white" />
                                </button>

                                <div className="text-center">
                                    <div className="font-bold text-lg text-text-primary">Talk to someone</div>
                                    <div className="text-sm text-text-secondary mt-1">Find an available listener</div>
                                </div>

                                <div className="flex items-center gap-6 text-xs text-text-secondary mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={13} />
                                        <span>Connection &lt; 20s</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Star size={13} className="text-accent" fill="currentColor" />
                                        <span>Verified listeners</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Billing info */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-background-from to-background-to p-4 flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-xs text-text-secondary uppercase tracking-wider font-semibold">
                                    <Gift size={13} className="text-primary" /> Free left
                                </div>
                                <div className="text-2xl font-extrabold text-text-primary">
                                    {subscription?.Subscription?.free_minutes_per_month ?? data.free_minutes_remaining}
                                    <span className="text-sm font-normal text-text-secondary ml-1">min</span>
                                </div>
                                <div className="text-[11px] text-text-secondary">
                                    {subscription?.Subscription?.name
                                        ? `${subscription.Subscription.name} plan · resets monthly`
                                        : 'Resets monthly'}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-background-from to-background-to p-4 flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-xs text-text-secondary uppercase tracking-wider font-semibold">
                                    <DollarSign size={13} className="text-primary" /> Rate
                                </div>
                                <div className="text-2xl font-extrabold text-text-primary">${data.price_per_minute}<span className="text-sm font-normal text-text-secondary ml-1">/min</span></div>
                                <div className="text-[11px] text-text-secondary">After free time</div>
                            </div>
                            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-background-from to-background-to p-4 flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-xs text-text-secondary uppercase tracking-wider font-semibold">
                                    <TrendingUp size={13} className="text-primary" /> Spent
                                </div>
                                <div className="text-2xl font-extrabold text-text-primary">${data.spend_today}</div>
                                <div className="text-[11px] text-text-secondary">${data.spend_month} this month</div>
                            </div>
                        </div>

                        {/* Subscription upsell / plan link */}
                        <button
                            onClick={() => navigate('/subscriptions')}
                            className="w-full flex items-center justify-between rounded-2xl border border-primary/10 bg-gradient-to-br from-background-from to-background-to p-4 hover:border-primary/30 transition"
                        >
                            <div className="flex items-center gap-3">
                                <Zap size={16} className="text-primary" />
                                <div className="text-left">
                                    <div className="text-sm font-bold text-text-primary">
                                        {subscription?.Subscription ? subscription.Subscription.name + ' plan' : 'No active plan'}
                                    </div>
                                    <div className="text-[11px] text-text-secondary">
                                        {subscription?.Subscription
                                            ? 'Manage or upgrade your subscription'
                                            : 'Subscribe to get more free minutes & filters'}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-text-secondary shrink-0" />
                        </button>

                        {/* Weekly activity */}
                        <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-background-from to-background-to p-4">
                            <div className="text-xl font-bold uppercase tracking-wider mb-2">Weekly activity</div>
                            <div className="text-sm text-text-secondary mb-3">Speaking minutes per day</div>
                            <AreaChart style={{ width: "100%" }} height={100} data={data.weekly_activity}>
                                <Area type="monotone" stroke="#8e5cff" strokeWidth={2} dataKey="value" dot={false} fill="#8e5cff" fillOpacity={0.08} />
                                <CartesianGrid stroke="#cccccc30" vertical={false} />
                            </AreaChart>
                        </div>
                    </div>

                    {/* ---- RIGHT: Last calls ---- */}
                    <div className="flex flex-col gap-2 md:w-5/18 rounded-2xl border border-primary/10 bg-gradient-to-br from-background-from to-background-to p-4">
                        <div className="text-xl font-bold uppercase tracking-wider">Last calls</div>

                        {data.last_calls.length === 0 ? (
                            <div className="grow flex flex-col items-center justify-center text-center text-text-secondary text-sm gap-3 py-10">
                                <Phone size={40} className="opacity-30" />
                                <p>No calls yet.<br />Start your first call!</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {data.last_calls.map((call, i) => (
                                    <div key={i} className="rounded-xl border border-primary/10 bg-background p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                                {formatDate(call.date)}
                                            </span>
                                            {call.rating && (
                                                <div className="flex items-center gap-1 text-xs font-bold" style={{ color: "#FFD700" }}>
                                                    <Star size={12} fill="currentColor" />
                                                    {call.rating}/5
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-primary" />
                                                <span className="font-semibold text-sm">{toHoursAndMinutes(call.duration_total)}</span>
                                            </div>
                                            <ChevronRight size={16} className="text-text-secondary" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Quick stats */}
                        <div className="mt-auto rounded-xl border border-primary/10 bg-background p-3">
                            <div className="text-sm font-bold uppercase tracking-wider mb-3">This week</div>
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Calls</span>
                                    <span className="font-bold">{data.last_calls.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Total duration</span>
                                    <span className="font-bold">
                                        {toHoursAndMinutes(data.last_calls.reduce((acc, c) => acc + c.duration_total, 0))}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Avg. rating</span>
                                    <span className="font-bold flex items-center gap-1">
                                        <Star size={12} fill="#FFD700" color="#FFD700" />
                                        {data.last_calls.filter(c => c.rating).length > 0
                                            ? maxDecimals(
                                                data.last_calls.filter(c => c.rating).reduce((acc, c) => acc + (c.rating || 0), 0)
                                                / data.last_calls.filter(c => c.rating).length,
                                                1
                                            )
                                            : "—"
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
