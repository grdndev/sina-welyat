import { useState } from "react";
import Layout from "./Layout";
import { ChevronRight, ClockFading, Cloud, Headphones, MousePointer2, Target } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import Loading from "../Loading";
import { maxDecimals } from "../../utils";

type ListenerData = {
    earning_day: number;
    available_balance: number;
    cloud_xp_balance: number;
    reputation: number;
    tips: Tip[];
    history: Call[];
    performance: Performance[];
    forecast: Performance[];
    session_duration: number;
}

type Tip = {
    label: string;
    amount: number;
}

type Call = {
    duration_total: number;
    duration_paid?: number;
}

type Performance = {
    value: number;
}

function toHoursAndMinutes(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

export default function Dashboard() {
    const [data, setData] = useState<ListenerData | null>(null);

    if (!data) {
        setData({
            earning_day: Math.random() * 200,
            available_balance: Math.random() * 800,
            cloud_xp_balance: Math.floor(Math.random() * 500),
            reputation: maxDecimals(Math.random() * 100,2),
            session_duration: Math.floor(Math.random() * 300),
            tips: [
                { label: "Tip 1", amount: Math.random() * 50 },
                { label: "Tip 2", amount: Math.random() * 50 },
                { label: "Tip 3", amount: Math.random() * 50 }
            ],
            history: [
                { duration_total: Math.floor(Math.random() * 60) },
                { duration_total: Math.floor(Math.random() * 60) },
                { duration_total: Math.floor(Math.random() * 60) }
            ],
            performance: [
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
            ],
            forecast: [
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
                { value: Math.floor(Math.random() * 100) },
            ]
        });
        return <Loading />;
    }

    return <Layout>
        <div className="px-3 py-6 text-slate-100">
            <div className="flex md:flex-row flex-col gap-4">
                <div className="md:w-5/18 flex flex-col gap-2 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-emerald-700/30 to-sky-950/30 p-4">
                    <div className="text-xl font-bold uppercase tracking-wider">Revenue & Balance</div>
                    <div className="flex flex-col block rounded-xl border border-cyan-400/30 bg-gradient-to-br from-emerald-600/30 to-sky-700/50 p-3">
                        <div className="text-lg font-medium tracking-wide uppercase">Earnings of the day</div>
                        <div className="flex items-center grow text-4xl font-bold py-5 px-2">${data.earning_day.toFixed(2)}</div>
                        <div className="text-sm text-gray-400">
                            Confirmed daily earnings.
                        </div>
                    </div>
                    <div className="flex flex-col block rounded-xl border border-cyan-400/30 bg-slate-800/30 p-3">
                        <div className="text-lg font-medium tracking-wide uppercase">Total balance</div>
                        <div className="grow flex items-center text-4xl font-bold py-5 px-2">${data.available_balance.toFixed(2)}</div>
                    </div>
                    <div className="flex flex-col block rounded-xl border border-cyan-400/30 bg-gradient-to-br from-sky-700/50 to-purple-950/50 p-3">
                        <div className="text-lg font-medium tracking-wide uppercase">Cloud XP balance</div>
                        <div className="grow flex items-center mt-2 flex items-center gap-2 text-4xl font-bold py-5 px-2">
                            <Cloud size={70} className="rounded-full bg-radial-[at_65%_75%] from-indigo-900/20 to-sky-500/80 to-98% p-3" />
                            <span>{data.cloud_xp_balance} XP</span>
                        </div>
                        <div className="text-sm text-gray-400">
                            Your cloud XP balance, these points can be earned by listening to calls.
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 grow rounded-2xl border border-blue-500/20 bg-gradient-to-br from-emerald-700/30 via-sky-950/30 to-slate-600/80 p-4">
                    <div className="text-xl font-bold uppercase tracking-wider">Performance & Goals</div>
                    <div className="flex flex-col md:grid md:grid-rows-2 gap-2">
                        <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
                            <div className="flex flex-col rounded-xl border border-blue-400/30 bg-slate-800/30 p-3 aspect-square overflow-hidden">
                                <div className="text-lg font-medium tracking-wide uppercase">Reputation score</div>
                                <div className="grow flex flex-col items-center justify-center relative">
                                    <div className="text-4xl font-bold">{data.reputation}%</div>
                                    <div className="text-xs text-gray-400">Quality</div>
                                    <div className="absolute h-full">
                                        <RadialBarChart
                                            style={{ width: '100%', height: '100%' }}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius="80%"
                                            outerRadius="100%"
                                            startAngle={240}
                                            endAngle={-60}
                                            data={[{ value: data.reputation }]}>
                                            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                                            <RadialBar dataKey="value" cornerRadius={10} fill="#48df9d" background />
                                        </RadialBarChart>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl border border-blue-400/30 bg-slate-800/30 p-3 aspect-square overflow-hidden">
                                <div className="text-lg font-medium tracking-wide uppercase">Tips received</div>
                                <div className="text-4xl font-bold px-2 py-4">${data.tips.reduce((sum, tip) => sum + tip.amount, 0).toFixed(2)}</div>
                                <div className="text-gray-400 mt-auto border-t border-cyan-400/10 pt-4">
                                    {data.tips.map((tip, i) => <div key={i} className="flex justify-between">
                                        <span>{tip.label}</span>
                                        <span>${tip.amount.toFixed(2)}</span>
                                    </div>)}
                                </div>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 gap-2">
                            <div className="grid grid-rows-2 gap-2">
                                <div className="flex flex-col rounded-xl border border-blue-400/30 bg-slate-800/30 p-3">
                                    <div className="mb-2 text-lg font-medium tracking-wide uppercase">Monthly forecast</div>
                                    <BarChart style={{ width: '100%' }} className="grow" data={data.forecast}>
                                        <Bar dataKey="value" fill="#48df9d" />
                                        <CartesianGrid stroke="#cccccc42" vertical={false} />
                                    </BarChart>
                                </div>
                                <div className="flex flex-col rounded-xl border border-blue-400/30 bg-slate-800/30 p-3">
                                    <div className="mb-2 text-lg font-medium tracking-wide uppercase">Monthly objective</div>
                                    <div className="grow flex flex-col">
                                        <div className="flex grow items-center">
                                            <div className="grow rounded-full bg-gray-400/30 h-8 mr-4">
                                                {/* TODO : Faire autrement, les classes Tailwind ne permettront pas d'être dynamiques */}
                                                <div className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 h-full" style={{width: `${Math.floor(Math.random() * 100)}%`}} />
                                            </div>
                                            <div className="ml-auto relative">
                                                <Target size={40} className="text-emerald-200/60" />
                                                <MousePointer2 size={20} fill="currentColor" className="absolute top-1/2 left-1/2 text-emerald-400" />
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="text-2xl font-bold">$800.00</div>
                                            <div className="ml-auto">Target</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col rounded-xl border border-blue-400/30 bg-slate-800/30 p-3 aspect-square">
                                <div className="text-lg font-medium tracking-wide uppercase">Weekly dynamic</div>
                                <div className="text-sm text-gray-400">Last week's activity</div>
                                <AreaChart style={{ width: '100%' }} className="grow" data={data.performance}>
                                    <Area type="monotone" stroke="#48df9d" strokeWidth={2} dataKey={"value"} dot={false} fill="#48df9d" fillOpacity={0.05} />
                                    <CartesianGrid stroke="#cccccc42" vertical={false} />
                                </AreaChart>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 md:w-5/18 rounded-2xl border rounded-xl border-green-500/20 bg-gradient-to-br from-slate-600/80 to-green-950/50 p-4">
                    <div className="text-xl font-bold uppercase tracking-wider">Live activity</div>
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-green-500/20 p-3">
                        <span className="h-4 w-4 rounded-full bg-emerald-400 animate-pulse ring-2 ring-emerald-400/50"></span>
                        <div className="grow pl-2">
                            <div className="font-bold tracking-wider uppercase">Active today</div>
                            <div className="text-gray-400">Duration {toHoursAndMinutes(data.session_duration)}</div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-emerald-400/20 bg-gradient-to-br from-emerald-600/30 to-sky-700/50 p-3">
                        <div className="text-lg font-medium tracking-wide uppercase">Listening time</div>
                        <div className="mt-2 flex items-center justify-between py-4 gap-2">
                            <div className="text-5xl font-bold tracking-wide">{toHoursAndMinutes(data.history.reduce((acc, call) => acc + call.duration_total, 0))}</div>
                            <Headphones size={80} className="text-cyan-400" />
                        </div>
                        <div className="border-t border-cyan-400/10 pt-4 mt-4 text-sm text-gray-400">
                            <div className="flex gap-2 items-center">
                                <div className="rounded-full w-3 h-3 bg-cyan-400 border-2 border-cyan-400/50" />
                                <div>Temps d'écoute</div>
                                <div className="ml-auto">{toHoursAndMinutes(data.history.reduce((acc, call) => acc + call.duration_total, 0))}</div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-emerald-400/20 bg-slate-800/30 p-3">
                        <div className="text-lg font-medium tracking-wide uppercase">Paid minutes today</div>
                        <div className="mt-2 flex items-center justify-between text-emerald-300 py-4 gap-2">
                            <div className="text-5xl font-bold tracking-wide text-shadow-xs text-shadow-emerald-400/40 ">{data.history.reduce((acc, call) => acc + (call.duration_total || 0), 0)} min</div>
                            <ClockFading size={80} className="bg-gray-400/30 rounded-full p-3" />
                        </div>
                        <div className="flex justify-between border-t border-cyan-400/10 pt-4 mt-4 text-sm text-gray-400">
                            <div className="font-semibold">Live counter</div>
                            <div>
                                <ChevronRight />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
}