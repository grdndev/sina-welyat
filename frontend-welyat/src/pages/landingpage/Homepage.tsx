'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, CreditCard, Clock, ShieldCheck, Gift, 
  CircleCheck, Activity, Phone, DoorOpen, DollarSign, 
  Hash, Bell, Heart, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';
import { router } from '../../router';

import background from '../../assets/bg/homePage.png';
import backgroubndMobile from '../../assets/bg/mb_homePage.png';

export default function HomePage() {
  const [talk, setTalk] = useState<boolean>(false);

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const cardVars = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <Layout home={true} backgroundImage={background} backgroundImageMobile={backgroubndMobile}>
      <AnimatePresence mode="wait">
        {!talk ? (
          /* ─── PAGE 1 : Landing ─── */
          <motion.div 
            key="landing"
            variants={containerVars}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -20 }}
            className="relative z-10 flex justify-center p-4 md:p-8 min-h-[80vh] items-center"
          >
            <div className="w-full max-w-5xl flex flex-col items-center gap-8">
              
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F8CD8B] text-xs font-medium mb-4"
                >
                  <Sparkles size={14} /> 24/7 Human Support
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                  You don't have to <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F8CD8B] to-[#DEB99D]">
                    be alone tonight.
                  </span>
                </h1>
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
                  Talk to someone who truly listens. <br className="hidden md:block"/>
                  Connect with a verified human in seconds.
                </p>
              </div>

              {/* Main CTA */}
              <div className="flex flex-col items-center gap-6 w-full">
                <button
                  onClick={() => setTalk(true)}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-[#7D2DEC] to-[#3F0DE0] p-1 rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(125,45,236,0.4)]"
                >
                  <span className="bg-transparent px-8 py-3 text-white font-bold text-lg flex items-center gap-2">
                    Talk to someone now
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <Link
                  to="/becomeListener"
                  className="flex items-center gap-2 text-white/70 hover:text-[#F8CD8B] transition-colors text-sm"
                >
                  Want to earn by listening? <span className="underline decoration-[#DEB99D]/50 underline-offset-4 font-semibold text-[#DEB99D]">Become a Listener</span>
                </Link>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8">
                <FeatureCard 
                  icon={<Clock className="text-[#F8CD8B]" size={24} />}
                  title="Your Free Time"
                  items={[
                    { text: "15 minutes free to talk", highlight: true },
                    { text: "First 3 calls < 2 min are free" },
                    { text: "Stay in total control" }
                  ]}
                />
                <FeatureCard 
                  icon={<CreditCard className="text-[#F8CD8B]" size={24} />}
                  title="Simple Pricing"
                  items={[
                    { text: "No hidden subscription" },
                    { text: "Pay per minute after free time" },
                    { text: "Stop whenever you want" }
                  ]}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          /* ─── PAGE 2 : Onboarding ─── */
          <motion.div 
            key="onboarding"
            variants={containerVars}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex justify-center p-4 md:p-8"
          >
            <div className="w-full max-w-5xl space-y-8 bg-black/40 backdrop-blur-xl p-6 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Before you start</h2>
                <p className="text-white/50 flex items-center justify-center gap-2">
                  <Clock size={16} /> Takes 10 seconds to read.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Time Highlight */}
                <div className="md:col-span-2 bg-gradient-to-br from-purple-900/40 to-black/40 p-6 rounded-3xl border border-purple-500/30">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-500/20 rounded-2xl">
                        <Gift className="text-[#F8CD8B]" />
                      </div>
                      <h3 className="font-bold text-xl uppercase tracking-tight text-white">Your Benefits</h3>
                    </div>
                    <span className="bg-[#F8CD8B] text-black px-4 py-1 rounded-full font-black text-sm">
                      15 MINUTES FREE
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-white/80">
                    <p className="flex items-center gap-2"><CircleCheck size={16} className="text-green-400" /> First 3 calls under 2 min don't count</p>
                    <p className="flex items-center gap-2"><CircleCheck size={16} className="text-green-400" /> Control everything from your dashboard</p>
                  </div>
                </div>

                {/* Pricing Details */}
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="text-[#F8CD8B]" />
                      <h3 className="font-bold text-lg uppercase text-white">Pricing</h3>
                    </div>
                    <div className="text-center py-6 bg-white/5 rounded-2xl">
                      <div className="text-3xl font-black text-white">$0.33<span className="text-sm font-normal text-white/50">/min</span></div>
                      <div className="text-xs text-white/40 mt-1">Applied after free minutes</div>
                    </div>
                  </div>
                </div>

                {/* Infrastructure Fees */}
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="text-[#F8CD8B]" />
                    <h3 className="font-bold text-lg uppercase text-white">Tech Fees</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex justify-between text-sm text-white/70 border-b border-white/5 pb-2">
                      <span>Call Start</span>
                      <span className="font-bold text-white">$0.10</span>
                    </li>
                    <li className="flex justify-between text-sm text-white/70">
                      <span>Every 10 mins</span>
                      <span className="font-bold text-white">$0.10</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-[10px] text-white/30 italic">Covers secure VOIP infrastructure</p>
                </div>

                {/* Timeline Call */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-center font-bold text-white uppercase tracking-widest text-sm">Call Process</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TimelineStep time="T=0" label="Connected" sub="Instant human voice" icon={<Phone size={20}/>} color="bg-green-500/20" />
                    <TimelineStep time="T=13" label="Alert" sub="Audio notification" icon={<Bell size={20}/>} color="bg-amber-500/20" />
                    <TimelineStep time="T=15" label="Option" sub="Press # to continue" icon={<Hash size={20}/>} color="bg-purple-500/20" />
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="flex flex-col items-center gap-4 pt-6">
                 <button
                  onClick={() => router.navigate('/register')}
                  className="w-full max-w-md group bg-gradient-to-r from-[#7D2DEC] to-[#3F0DE0] py-4 rounded-full text-white font-bold shadow-xl hover:shadow-purple-500/20 transition-all"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Phone size={20} className="fill-current" />
                    <span>START MY CALL NOW</span>
                  </div>
                  <div className="text-[10px] opacity-70 font-normal uppercase tracking-widest mt-1">Connected in ~15 seconds</div>
                </button>
                
                <div className="flex flex-wrap justify-center gap-6 text-[11px] text-white/40 uppercase tracking-tighter">
                  <span className="flex items-center gap-1"><Heart size={12}/> 100% Private</span>
                  <span className="flex items-center gap-1"><DoorOpen size={12}/> Hang up anytime</span>
                  <span className="flex items-center gap-1"><Activity size={12}/> Real Humans</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

// Helper Components
function FeatureCard({ icon, title, items }: { icon: any, title: string, items: {text: string, highlight?: boolean}[] }) {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
      className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
        <div className="space-y-2">
          <h3 className="text-white font-bold uppercase tracking-wider text-sm">{title}</h3>
          <ul className="space-y-1.5">
            {items.map((item, i) => (
              <li key={i} className={`text-sm flex items-center gap-2 ${item.highlight ? 'text-[#F8CD8B] font-semibold' : 'text-white/60'}`}>
                <div className={`w-1 h-1 rounded-full ${item.highlight ? 'bg-[#F8CD8B]' : 'bg-white/30'}`} />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function TimelineStep({ time, label, sub, icon, color }: { time: string, label: string, sub: string, icon: any, color: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-2xl border border-white/5">
      <div className={`p-3 rounded-full mb-3 ${color} text-white`}>
        {icon}
      </div>
      <div className="text-[#F8CD8B] font-black text-lg">{time}</div>
      <div className="text-white font-bold text-sm">{label}</div>
      <div className="text-white/40 text-[11px] leading-tight">{sub}</div>
    </div>
  );
}