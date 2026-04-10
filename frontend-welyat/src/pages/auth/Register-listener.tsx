import { Eye, EyeOff, Mic, MicOff, Phone, Play, Square, CheckCircle, Clock } from 'lucide-react';
import Layout from '../../components/Layout';
import React, { useState, useRef, useEffect } from 'react';
import img from '../../assets/img/register-listener.jpg';
import { authApi } from '../../api/auth';

const LANGUAGES = ['French', 'English', 'Arabic', 'Spanish', 'Portuguese', 'Wolof', 'Bambara', 'Malagasy', 'Reunion Creole', 'Other'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOTS = ['Morning (6am–12pm)', 'Afternoon (12pm–6pm)', 'Evening (6pm–12am)', 'Night (12am–6am)'];

const MAX_RECORD_SECONDS = 120;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function RegisterListener() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [formData, setFormData] = useState<any>({ languages: [] as string[], days: [] as string[], slots: [] as string[] });

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function handleFormData(key: string, value: any) {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  }

  function toggleArrayValue(key: string, value: string) {
    setFormData((prev: any) => {
      const arr: string[] = prev[key] || [];
      return { ...prev, [key]: arr.includes(value) ? arr.filter((v: string) => v !== value) : [...arr, value] };
    });
  }

  async function startRecording() {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.start();
      setRecording(true);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORD_SECONDS - 1) { stopRecording(); return MAX_RECORD_SECONDS; }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setError('Unable to access microphone. Please check your permissions.');
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  function playAudio() {
    if (!audioUrl) return;
    if (!audioRef.current) { audioRef.current = new Audio(audioUrl); audioRef.current.onended = () => setPlaying(false); }
    audioRef.current.play();
    setPlaying(true);
  }

  function stopAudio() {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setPlaying(false);
  }

  function validateStep1() {
    if (!formData.firstname?.trim()) throw new Error('First name is required');
    if (!formData.lastname?.trim()) throw new Error('Last name is required');
    if (!formData.phone?.trim()) throw new Error('Phone number is required');
    const age = parseInt(formData.age);
    if (!formData.age || isNaN(age) || age < 18) throw new Error('You must be at least 18 years old');
    if (!formData.gender) throw new Error('Gender is required');
    if (!formData.languages?.length) throw new Error('Select at least one language');
    if (!formData.password) throw new Error('Password is required');
    if (formData.password.length < 8) throw new Error('Password must be at least 8 characters');
    if (formData.password !== formData.confirm) throw new Error('Passwords do not match');
  }

  function validateStep2() {
    if (!formData.days?.length) throw new Error('Select at least one availability day');
    if (!formData.slots?.length) throw new Error('Select at least one time slot');
    if (!audioBlob) throw new Error('Please record your audio introduction');
  }

  function nextStep() {
    setError('');
    try {
      if (step === 1) validateStep1();
      if (step === 2) validateStep2();
      setStep((s) => s + 1);
    } catch (e: any) { setError(e.message); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.registerListener({
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender,
        password: formData.password,
        languages: formData.languages || [],
        days: formData.days || [],
        slots: formData.slots || [],
      });
      setStep(4);
    } catch (e: any) {
      setError(e.message ?? 'An error occurred');
    } finally { setLoading(false); }
  }

  const progressPercent = ((step - 1) / 3) * 100;

  if (step === 4) {
    return (
      <Layout>
        <div className="w-full flex items-center justify-center py-16 px-4">
          <div className="w-full max-w-md text-center bg-white/40 backdrop-blur-md border border-white/30 shadow-lg rounded-3xl p-10">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)' }}>
              <CheckCircle size={40} color="white" />
            </div>
            <h2 className="text-2xl font-extrabold text-text-primary mb-3">Application submitted!</h2>
            <p className="text-sm mb-6" style={{ color: '#6F6F7A' }}>
              Your application is under review. Our team will listen to your introduction and contact you by phone within <strong>48–72 hours</strong>.
            </p>
            <div className="flex items-center gap-3 rounded-2xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, #EFEAF9 0%, #E6DFF7 100%)' }}>
              <Clock size={20} style={{ color: '#8E5CFF' }} />
              <span className="text-sm font-medium text-text-primary">Review within 48–72 hours</span>
            </div>
            <a href="/login" className="block w-full py-3 rounded-xl font-semibold text-white text-center transition"
              style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 4px 15px rgba(142, 92, 255, 0.35)' }}>
              Back to sign in
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full flex items-center justify-center py-8 px-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="flex w-full max-w-5xl bg-white/30 backdrop-blur-md border border-white/30 shadow-lg rounded-3xl overflow-hidden">
          <div className="hidden lg:block w-2/5 min-h-[700px]" style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="h-full w-full flex flex-col justify-end p-8" style={{ background: 'linear-gradient(to top, rgba(90,44,203,0.7) 0%, transparent 60%)' }}>
              <h2 className="text-white text-2xl font-extrabold mb-2">Become a listener</h2>
              <p className="text-white/80 text-sm">Help those who need to be heard.</p>
            </div>
          </div>

          <div className="flex flex-col w-full lg:w-3/5 px-8 py-10">
            <h1 className="text-text-primary text-2xl font-extrabold tracking-tight mb-1">
              Listener <span style={{ color: '#8e5cff' }}>registration</span>
            </h1>
            <p className="text-sm mb-4" style={{ color: '#6F6F7A' }}>Complete 3 steps to submit your application</p>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-semibold mb-2" style={{ color: '#6F6F7A' }}>
                <span className={step >= 1 ? 'text-text-primary' : ''}>1. Identity</span>
                <span className={step >= 2 ? 'text-text-primary' : ''}>2. Availability & Audio</span>
                <span className={step >= 3 ? 'text-text-primary' : ''}>3. Confirmation</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #7A4CFF 0%, #B78CFF 100%)' }} />
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl mb-4 py-2 px-4 text-center">{error}</div>}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">First name <span style={{ color: '#8e5cff' }}>*</span></label>
                    <input type="text" placeholder="John" value={formData.firstname || ''} onChange={(e) => handleFormData('firstname', e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 transition" style={{ '--tw-ring-color': '#8e5cff' } as any} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Last name <span style={{ color: '#8e5cff' }}>*</span></label>
                    <input type="text" placeholder="Doe" value={formData.lastname || ''} onChange={(e) => handleFormData('lastname', e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 transition" style={{ '--tw-ring-color': '#8e5cff' } as any} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Phone <span style={{ color: '#8e5cff' }}>*</span></label>
                    <div className="relative flex items-center">
                      <Phone size={14} className="absolute left-3 text-gray-400" />
                      <input type="tel" placeholder="+1 000 000 0000" value={formData.phone || ''} onChange={(e) => handleFormData('phone', e.target.value)}
                        className="border border-gray-200 rounded-xl p-3 pl-8 text-sm bg-gray-50 focus:outline-none focus:ring-2 w-full transition" style={{ '--tw-ring-color': '#8e5cff' } as any} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Age <span style={{ color: '#8e5cff' }}>*</span></label>
                    <input type="number" min={18} max={99} placeholder="25" value={formData.age || ''} onChange={(e) => handleFormData('age', e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 transition" style={{ '--tw-ring-color': '#8e5cff' } as any} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Gender <span style={{ color: '#8e5cff' }}>*</span></label>
                    <select value={formData.gender || ''} onChange={(e) => handleFormData('gender', e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 transition" style={{ '--tw-ring-color': '#8e5cff' } as any}>
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Language(s) spoken <span style={{ color: '#8e5cff' }}>*</span></label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {LANGUAGES.map((lang) => {
                      const selected = formData.languages?.includes(lang);
                      return (
                        <button key={lang} type="button" onClick={() => toggleArrayValue('languages', lang)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold border transition"
                          style={{ background: selected ? 'linear-gradient(135deg, #7A4CFF, #B78CFF)' : 'white', color: selected ? 'white' : '#6F6F7A', borderColor: selected ? 'transparent' : '#e5e7eb' }}>
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Password <span style={{ color: '#8e5cff' }}>*</span></label>
                  <div className="relative flex items-center">
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password || ''} onChange={(e) => handleFormData('password', e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 w-full transition" style={{ '--tw-ring-color': '#8e5cff' } as any} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400">
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Confirm password <span style={{ color: '#8e5cff' }}>*</span></label>
                  <div className="relative flex items-center">
                    <input type={showPasswordConfirm ? 'text' : 'password'} placeholder="••••••••" value={formData.confirm || ''} onChange={(e) => handleFormData('confirm', e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 w-full transition" style={{ '--tw-ring-color': '#8e5cff' } as any} />
                    <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-3 text-gray-400">
                      {showPasswordConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <button type="button" onClick={nextStep} className="w-full mt-2 py-3 rounded-xl font-semibold text-white transition"
                  style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 4px 15px rgba(142, 92, 255, 0.35)' }}>
                  Continue →
                </button>
                <p className="text-center text-xs text-gray-400">
                  Already have an account?{' '}
                  <a href="/login" className="text-text-primary font-semibold hover:underline">Sign in</a>
                </p>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Available days <span style={{ color: '#8e5cff' }}>*</span></label>
                  <div className="flex gap-2 flex-wrap">
                    {DAYS.map((day) => {
                      const selected = formData.days?.includes(day);
                      return (
                        <button key={day} type="button" onClick={() => toggleArrayValue('days', day)}
                          className="w-12 h-12 rounded-xl text-sm font-semibold border transition"
                          style={{ background: selected ? 'linear-gradient(135deg, #7A4CFF, #B78CFF)' : 'white', color: selected ? 'white' : '#6F6F7A', borderColor: selected ? 'transparent' : '#e5e7eb' }}>
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Time slots <span style={{ color: '#8e5cff' }}>*</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    {SLOTS.map((slot) => {
                      const selected = formData.slots?.includes(slot);
                      return (
                        <button key={slot} type="button" onClick={() => toggleArrayValue('slots', slot)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold border transition text-left"
                          style={{ background: selected ? 'linear-gradient(135deg, #7A4CFF, #B78CFF)' : 'white', color: selected ? 'white' : '#6F6F7A', borderColor: selected ? 'transparent' : '#e5e7eb' }}>
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Audio introduction (max 2 min) <span style={{ color: '#8e5cff' }}>*</span></label>
                  <p className="text-xs" style={{ color: '#6F6F7A' }}>
                    Briefly introduce yourself: who you are, why you want to be a listener, and what you can bring.
                  </p>
                  <div className="rounded-2xl p-5 flex flex-col items-center gap-4" style={{ background: 'linear-gradient(135deg, #EFEAF9 0%, #E6DFF7 100%)', border: '1px solid rgba(142,92,255,0.15)' }}>
                    <div className="text-3xl font-mono font-bold" style={{ color: recording ? '#e53e3e' : '#8E5CFF' }}>
                      {recording ? formatTime(recordingTime) : audioBlob ? formatTime(recordingTime) : '02:00'}
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/60 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(recordingTime / MAX_RECORD_SECONDS) * 100}%`, background: recording ? '#e53e3e' : 'linear-gradient(90deg, #7A4CFF, #B78CFF)' }} />
                    </div>
                    <div className="flex gap-3 items-center">
                      {!recording && !audioBlob && (
                        <button type="button" onClick={startRecording} className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition"
                          style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 4px 15px rgba(142,92,255,0.35)' }}>
                          <Mic size={18} /> Start recording
                        </button>
                      )}
                      {recording && (
                        <button type="button" onClick={stopRecording} className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition"
                          style={{ background: '#e53e3e', boxShadow: '0 4px 15px rgba(229,62,62,0.35)' }}>
                          <Square size={18} fill="white" /> Stop
                        </button>
                      )}
                      {audioBlob && !recording && (
                        <>
                          {!playing
                            ? <button type="button" onClick={playAudio} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white transition"
                                style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)' }}>
                                <Play size={16} fill="white" /> Listen
                              </button>
                            : <button type="button" onClick={stopAudio} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white transition"
                                style={{ background: '#6F6F7A' }}>
                                <MicOff size={16} /> Stop
                              </button>
                          }
                          <button type="button" onClick={() => { setAudioBlob(null); setAudioUrl(null); setRecordingTime(0); stopAudio(); audioRef.current = null; }}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition">
                            Re-record
                          </button>
                        </>
                      )}
                    </div>
                    {audioBlob && <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#22c55e' }}><CheckCircle size={14} /> Recording ready ({formatTime(recordingTime)})</div>}
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => { setError(''); setStep(1); }}
                    className="px-5 py-3 rounded-xl font-semibold border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition">← Back</button>
                  <button type="button" onClick={nextStep} className="flex-1 py-3 rounded-xl font-semibold text-white transition"
                    style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 4px 15px rgba(142, 92, 255, 0.35)' }}>Continue →</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: 'linear-gradient(135deg, #EFEAF9 0%, #E6DFF7 100%)', border: '1px solid rgba(142,92,255,0.15)' }}>
                  <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">Summary</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span style={{ color: '#6F6F7A' }}>Full name</span>
                    <span className="font-semibold text-text-primary">{formData.firstname} {formData.lastname}</span>
                    <span style={{ color: '#6F6F7A' }}>Phone</span>
                    <span className="font-semibold text-text-primary">{formData.phone}</span>
                    <span style={{ color: '#6F6F7A' }}>Age</span>
                    <span className="font-semibold text-text-primary">{formData.age} years old</span>
                    <span style={{ color: '#6F6F7A' }}>Languages</span>
                    <span className="font-semibold text-text-primary">{formData.languages?.join(', ')}</span>
                    <span style={{ color: '#6F6F7A' }}>Days</span>
                    <span className="font-semibold text-text-primary">{formData.days?.join(', ')}</span>
                    <span style={{ color: '#6F6F7A' }}>Time slots</span>
                    <span className="font-semibold text-text-primary">{formData.slots?.join(', ')}</span>
                    <span style={{ color: '#6F6F7A' }}>Audio</span>
                    <span className="font-semibold" style={{ color: '#22c55e' }}>✓ Recorded ({formatTime(recordingTime)})</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" required className="mt-0.5" style={{ accentColor: '#8e5cff' }} />
                  <label htmlFor="terms" className="text-xs text-gray-500">
                    I accept the{' '}
                    <a href="/termsOfService" className="text-text-primary underline hover:opacity-80 transition">Terms of Service</a>
                    {' '}and the{' '}
                    <a href="/privacyPolicy" className="text-text-primary underline hover:opacity-80 transition">Privacy Policy</a>.
                    {' '}I understand my application will be reviewed by an administrator.
                  </label>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setError(''); setStep(2); }}
                    className="px-5 py-3 rounded-xl font-semibold border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition">← Back</button>
                  <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl font-semibold text-white transition disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 4px 15px rgba(142, 92, 255, 0.35)' }}>
                    {loading ? 'Submitting...' : 'Submit my application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
