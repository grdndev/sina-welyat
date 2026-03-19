import { useState } from "react";
import Layout from "./Layout";

import { ArrowBigDown, ArrowBigUp, ArrowDown, ArrowUp, ChevronRight } from "lucide-react";
import Loading from "../Loading";
import HealthIndicator from "../../components/HealthIndicator";

type AdminData = {
    margin: number;
    paid_hours: number;
    net_amount: number;
    net_delta: number;
    health_balance: number;
    average_cost: number;
    paid_free_ratio: number;
    average_hourly_yield: number;
}

const NetDeltaDisplay = ({netDelta}: {netDelta: number}) => {
    const positive = netDelta >= 0;

    return <>
        {positive ? <ArrowBigUp size={15} fill="currentColor" className={positive ? 'text-green-500' : 'text-red-500'} /> : <ArrowBigDown size={15} fill="currentColor" className={positive ? 'text-red-500' : 'text-green-500'} />}
        <div className={`tracking-tight text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>{positive ? "+" : "-"}{netDelta} $</div>
    </>
}

const BalanceHealth = ({healthBalance}: {healthBalance: number}) => {
    const health = [
        {color: "green", message: "Perfect balance"},
        {color: "orange", message: "Refine balance"},
        {color: "red", message: "Danger"}
    ];

    return <HealthIndicator value={healthBalance} tiers={[90,30]} data={health} bgColor={true} />
}

const AverageCostHealth = ({averageCost}: {averageCost: number}) => {
    const health = [
        {color: "green", message: "Healthy"},
        {color: "orange", message: "Caution"},
        {color: "red", message: "Danger"},
    ];

    return <HealthIndicator value={averageCost} tiers={[0.2, 0.5]} data={health} sortAsc={true} textColor={true} />
}

const PaidFreeHealth = ({averageCost}: {averageCost: number}) => {
    const health = [
        {color: "green", message: "Healthy"},
        {color: "orange", message: "Stable"},
        {color: "red", message: "Unstable"},
    ];

    return <HealthIndicator value={averageCost} tiers={[0.3, 0.7]} data={health} sortAsc={true} textColor={true} />
}

const AverageHourlyHealth = ({averageCost}: {averageCost: number}) => {
    const health = [
        {color: "green", message: "Strong"},
        {color: "orange", message: "Average"},
        {color: "red", message: "Weak"},
    ];

    return <HealthIndicator value={averageCost} tiers={[5, 10]} data={health} sortAsc={true} textColor={true} />
}

export default function Dashboard() {
    const [data, setData] = useState<AdminData | null>(null);

    if (!data) {
        setData({
            margin: 1,
            paid_hours: 1,
            net_amount: 1,
            net_delta: 1,
            health_balance: 13,
            average_cost: 1,
            paid_free_ratio: 1,
            average_hourly_yield: 1,
        });
        return <Loading />;
    }

    return <Layout>
        <div className="flex flex-col gap-6 p-10 text-slate-100">
            <div className="flex gap-5 border border-white/5 bg-slate-700/60 shadow-md rounded-lg text-2xl tracking-wide">
                <div className="w-1/5 flex flex-col items bg-radial-[at_50%_150%] from-yellow-600/60 to-transparent to-60% p-5 border-r border-white/5">
                    <div>Actual margin</div>
                    <div className="text-4xl">{data.margin}</div>
                </div>
                <div className="w-1/5 flex flex-col items bg-radial-[at_50%_150%] from-sky-600/60 to-transparent to-60% p-5 border-r border-white/5">
                    <div>Paid hours</div>
                    <div className="text-4xl">{data.paid_hours}</div>
                </div>
                <div className="w-3/5 flex flex-col items bg-radial-[at_50%_150%] from-emerald-600/60 to-transparent to-60% p-5">
                    <div>Net platform</div>
                    <div className="flex items-center text-4xl">
                        <div>{data.net_amount}</div>
                        <NetDeltaDisplay netDelta={data.net_delta} />
                    </div>
                </div>
            </div>
            <div className="flex gap-5 border-t border-white/5">
                <div className="flex flex-col gap-4 grow border-r border-white/5 py-5 pr-5">
                    <div className="text-2xl tracking-wide">Platform state</div>
                    <div className="flex flex-col gap-2 border rounded-lg border-white/5 bg-radial-[at_50%_150%] from-yellow-600/60 to-slate-700/60 to-60% p-5">
                        <div className="text-4xl tracking-tight">{data.health_balance} %</div>
                        <BalanceHealth healthBalance={data.health_balance} />
                        <div>
                            Slight adjustments are needed to improve stability.<br />
                            Refine Mode recommended.
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3 w-1/4 p-5">
                    <div className="text-2xl tracking-wide">Admin actions</div>
                    <button className="flex items-center justify-center rounded-lg p-3 bg-linear-to-r from-green-300/40 hover:from-green-300/50 to-emerald-400/50 hover:to-emerald-400/60 cursor-pointer">Select mode</button>
                    <button className="flex items-center justify-center rounded-lg p-3 bg-linear-to-r from-red-300/40 hover:from-red-300/50 to-red-400/50 hover:to-red-400/60 cursor-pointer">Distribute Cloud XP</button>
                    <button className="flex items-center justify-center rounded-lg p-3 bg-linear-to-r from-gray-300/40 hover:from-gray-300/50 to-slate-400/50 hover:to-slate-400/60 cursor-pointer">Financial details</button>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col border border-white/5 rounded-lg p-4 bg-slate-700/60">
                    <div>Average cost / minute</div>
                    <div className="flex text-3xl items-center gap-2">
                        <div>{data.average_cost} $</div>
                        <div className="text-xl">
                            <AverageCostHealth averageCost={data.average_cost} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col border border-white/5 rounded-lg p-4 bg-radial-[at_50%_150%] from-yellow-600/60 to-slate-700/60 to-60%">
                    <div>Balance paid / free</div>
                    <div className="flex text-3xl items-center gap-2">
                        <div>{data.paid_free_ratio}</div>
                        <div className="text-xl">
                            <PaidFreeHealth averageCost={data.paid_free_ratio} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col border border-white/5 rounded-lg p-4 bg-slate-700/60">
                    <div>Yield / active hour</div>
                    <div className="flex text-3xl items-center gap-2">
                        <div>{data.average_hourly_yield} $</div>
                        <div className="text-xl">
                            <AverageHourlyHealth averageCost={data.average_hourly_yield} />
                        </div>
                    </div>
                </div>
            </div>
            <button className="mx-auto flex border border-white/5 rounded-full bg-slate-700/60 hover:bg-slate-700/80 py-2 px-6 cursor-pointer">
                <span>Financial details</span>
                <ChevronRight />
            </button>
        </div>
    </Layout>
}