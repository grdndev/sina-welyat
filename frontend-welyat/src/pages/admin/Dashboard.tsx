import { useState } from "react";
import Layout from "./Layout";

import { ArrowBigDown, ArrowBigUp, ChevronRight } from "lucide-react";
import Loading from "../Loading";
import HealthIndicator from "../../components/HealthIndicator";
import { maxDecimals } from "../../utils";
import HealthDependentBackground from "../../components/HealthDependentBackground";

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
        {positive ? <ArrowBigUp size={15} fill="currentColor" className='text-green-500' /> : <ArrowBigDown size={15} fill="currentColor" className='text-red-500' />}
        <div className={`tracking-tight text-lg ${positive ? 'text-green-500' : 'text-red-500'}`}>{positive ? "+" : ""}{netDelta} $</div>
    </>
}

const BalanceHealth = ({healthBalance}: {healthBalance: number}) => {
    const messages = [
        "Perfect balance",
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

    if (!data) {
        setData({
            margin: Math.floor(Math.random() * 100),
            paid_hours: Math.floor(Math.random() * 1000),
            net_amount: Math.floor(Math.random() * 2000),
            net_delta: Math.floor(Math.random() * 100) - 50,
            health_balance: Math.random() * 100,
            average_cost: Math.random() * 2,
            paid_free_ratio: Math.random() * 2,
            average_hourly_yield: Math.random() * 50,
        });
        return <Loading />;
    }

    return <Layout>
        <div className="flex flex-col gap-6 p-10 text-slate-100">
            <div className="flex flex-col md:flex-row gap-5 border border-white/5 bg-slate-700/60 shadow-md rounded-lg text-2xl tracking-wide">
                <HealthDependentBackground
                    value={data.margin}
                    tiers={[90,30]}
                    className="md:w-1/5 flex flex-col items p-5 border-b md:border-r md:border-b-0 border-white/5">
                    <div>Real margin</div>
                    <div className="text-4xl">{data.margin} %</div>
                </HealthDependentBackground>
                <div className="md:w-1/5 flex flex-col items bg-radial-[at_50%_150%] from-sky-600/60 to-transparent to-60% p-5 border-b md:border-r md:border-b-0 border-white/5">
                    <div>Paid hours</div>
                    <div className="text-4xl">{data.paid_hours}h</div>
                </div>
                <HealthDependentBackground
                    value={data.net_delta}
                    tiers={[1,0]}
                    className="md:w-3/5 flex flex-col items p-5">
                    <div>Net platform</div>
                    <div className="flex items-center text-4xl">
                        <div>{data.net_amount}$</div>
                        <NetDeltaDisplay netDelta={data.net_delta} />
                    </div>
                </HealthDependentBackground>
            </div>
            <div className="flex flex-col md:flex-row gap-5 border-t border-white/5">
                <div className="flex flex-col gap-4 grow border-r border-white/5 py-5 pr-5">
                    <div className="text-2xl tracking-wide">Platform state</div>
                        <HealthDependentBackground
                            value={data.health_balance}
                            tiers={[90,30]}>
                            <div className="flex flex-col gap-2 border rounded-lg border-white/5 p-5 bg-slate-700/60">
                                <div className="text-4xl tracking-tight">{maxDecimals(data.health_balance,2)} %</div>
                                <BalanceHealth healthBalance={data.health_balance} />
                                <div>
                                    Slight adjustments are needed to improve stability.<br />
                                    Refine Mode recommended.
                                </div>
                            </div>
                        </HealthDependentBackground>
                </div>
                <div className="flex flex-col gap-3 md:w-1/4 md:p-5">
                    <div className="text-2xl tracking-wide">Admin actions</div>
                    <button className="flex items-center justify-center rounded-lg p-3 bg-linear-to-r from-green-300/40 hover:from-green-300/50 to-emerald-400/50 hover:to-emerald-400/60 cursor-pointer">Select mode</button>
                    <button className="flex items-center justify-center rounded-lg p-3 bg-linear-to-r from-red-300/40 hover:from-red-300/50 to-red-400/50 hover:to-red-400/60 cursor-pointer">Distribute Cloud XP</button>
                    <button className="flex items-center justify-center rounded-lg p-3 bg-linear-to-r from-gray-300/40 hover:from-gray-300/50 to-slate-400/50 hover:to-slate-400/60 cursor-pointer">Financial details</button>
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="flex flex-col border border-white/5 rounded-lg p-4 bg-slate-700/60">
                    <div>Average cost / minute</div>
                    <div className="flex text-3xl items-center gap-2">
                        <div>{data.average_cost.toFixed(2)} $</div>
                        <div className="text-xl">
                            <AverageCostHealth averageCost={data.average_cost} />
                        </div>
                    </div>
                </div>
                    <HealthDependentBackground
                        value={data.paid_free_ratio}
                        tiers={[0.3, 0.7]}
                        reverse={true}>
                        <div className="flex flex-col border border-white/5 rounded-lg p-4 bg-slate-700/60">
                            <div>Balance paid / free</div>
                            <div className="flex text-3xl items-center gap-2">
                                <div>{data.paid_free_ratio.toFixed(2)}</div>
                                <div className="text-xl">
                                    <PaidFreeHealth averageCost={data.paid_free_ratio} />
                                </div>
                            </div>
                        </div>
                    </HealthDependentBackground>
                <div className="flex flex-col border border-white/5 rounded-lg p-4 bg-slate-700/60">
                    <div>Yield / active hour</div>
                    <div className="flex text-3xl items-center gap-2">
                        <div>{maxDecimals(data.average_hourly_yield,2)} $</div>
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