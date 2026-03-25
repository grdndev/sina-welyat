import { Clock10, DollarSign, HandCoins, Plus, ShieldCheck, Star } from "lucide-react";
import Layout from "../../components/Layout";
import image from "../../assets/dashboard.png";
import { Link } from "react-router-dom";
import background from '../../assets/bg/HomeListener.png';

export default function Listener() {
    return <Layout home={true}  backgroundImage={background}>
        <div className="text-xl p-5 z-10">
            <div className="flex flex-col items-center justify-center gap-3 p-10">
                <h1 className="text-4xl flex flex-col items-center justify-center font-bold tracking-wider">
                    <div>Your empathy is a superpower.</div>
                    <div>Turn it into a career.</div>
                </h1>
                <div className="flex flex-col items-center justify-center text-text-secondary">
                    <div>In a world flooded with AI chatbots and scripted responses,</div>
                    <div>genuine human empathy is invaluable.</div>
                    <div>Start earning by listening anonymously.</div>
                </div>
                <Link to="/register" className="rounded-full bg-linear-to-r from-button-from to-button-to py-2 px-8 text-white">Apply to Listen</Link>
                <div className="text-text-secondary">No resume needed. Simple sign-up. Voice test required.</div>
            </div>
            <div className="grid grid-cols-5 gap-5">
                <div className="col-span-3">
                    <h1 className="text-4xl font-semibold tracking-wide">Fair Earnings, Transparent & Easy</h1>
                    <div className="flex flex-col gap-4 py-5">
                        <div className="flex gap-4 bg-background/80 p-6 rounded-lg">
                            <Clock10 size={60} className="text-accent-soft rounded-full bg-white/50 border-3 border-gray-300/50 p-2" />
                            <div className="flex flex-col gap-2">
                                <div className="font-semibold text-2xl">XP System: Every minute = 1XP</div>
                                <div>Every second listening earns you XP,</div>
                                <div>turning empathy into experience</div>
                            </div>
                            <Plus size={30} className="ml-auto" />
                        </div>
                        <div className="flex gap-4 bg-background/80 p-6 rounded-lg">
                            <HandCoins size={60} className="text-accent-soft rounded-full bg-white/50 border-3 border-gray-300/50 p-2" />
                            <div className="flex flex-col gap-2">
                                <div className="font-semibold text-2xl">15min Free Bonus: 1.5x Multiplier</div>
                                <div>Turn free sessions into paid ones and your</div>
                                <div>15 free minutes are multiplied by 1.5x</div>
                            </div>
                            <Plus size={30} className="ml-auto" />
                        </div>
                        <div className="flex gap-4 bg-background/80 p-6 rounded-lg">
                            <DollarSign size={60} className="text-accent-soft rounded-full bg-white/50 border-3 border-gray-300/50 p-2" />
                            <div className="flex flex-col gap-2">
                                <div className="font-semibold text-2xl">Earn $14-16/hour</div>
                                <div>On average, after small fees. Clear, honest</div>
                                <div>redistribution of our profits to you.</div>
                            </div>
                            <Plus size={30} className="ml-auto" />
                        </div>
                    </div>
                </div>
                <div className="pt-40 col-span-2 relative">
                    <h1 className="text-4xl font-semibold tracking-wide">The Listener Dashboard</h1>
                    <div>Get a realtime overview of your listening stats.</div>
                    <div className="absolute flex flex-col gap-5 items-center justify-center">
                        <img src={image} />
                        <Link to="/register" className="rounded-full bg-linear-to-r from-button-from to-button-to py-2 px-8 text-white">Apply to Listen</Link>
                        <div>Quick application, voice test required.</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 bg-linear-to-b from-background to-transparent rounded-lg p-6">
                <div className="flex gap-4">
                    <ShieldCheck size={60} className="text-accent-soft rounded-full bg-white/50 border-3 border-gray-300/50 p-2" />
                    <div className="flex flex-col gap-2 max-w-2/3">
                        <div className="font-semibold text-2xl">Total Anonymity</div>
                        <div>You remain anonymous,
                            no personal info shared
                            with callers.
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Star size={60} className="text-accent-soft rounded-full bg-white/50 border-3 border-gray-300/50 p-2" />
                    <div className="flex flex-col gap-2 max-w-2/3">
                        <div className="font-semibold text-2xl">Quality Ratings</div>
                        <div>Build a reputation of excellent listening.
                            Your empthy is rated anonymously by users.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
}