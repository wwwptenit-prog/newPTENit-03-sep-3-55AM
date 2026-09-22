import React, { useState, useEffect } from 'react';
import {
  Video,
  ExternalLink,
  Copy,
  Check,
  X,
  PhoneCall,
  Sparkles,
  Link as LinkIcon,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';

export interface GoogleMeetCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  windowId?: string;
  targetName?: string;
  existingLink?: string;
}

export const GoogleMeetCallModal: React.FC<GoogleMeetCallModalProps> = ({
  isOpen,
  onClose,
  windowId,
  targetName = 'ক্লায়েন্ট / শিক্ষার্থী',
  existingLink = ''
}) => {
  const { sendChatMessage } = useData();
  const [activeTab, setActiveTab] = useState<'instant' | 'custom'>('instant');
  const [meetLinkInput, setMeetLinkInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMeetLinkInput(existingLink || '');
      setCopied(false);
      setToastMsg('');
    }
  }, [isOpen, existingLink]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleLaunchInstantMeet = () => {
    // Open Google's official new meeting creator in a new tab
    const newMeetUrl = 'https://meet.google.com/new';
    window.open(newMeetUrl, '_blank', 'noopener,noreferrer');
    showToast('গুগল মিট নতুন ট্যাবে চালু হয়েছে! মিটিং এর লিংক কপি করে নিচে দিতে পারেন।');
  };

  const handleSendInvite = (directUrl?: string) => {
    const finalUrl = (directUrl || meetLinkInput).trim();
    if (!finalUrl && activeTab === 'custom') {
      alert('অনুগ্রহ করে একটি কার্যকর গুগল মিট (Google Meet) লিংক প্রদান করুন।');
      return;
    }

    let validUrl = finalUrl || 'https://meet.google.com/new';
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = `https://${validUrl}`;
    }

    if (windowId) {
      sendChatMessage(
        windowId,
        `📹 গুগুল মিট (Google Meet) লাইভ ভিডিও কনফারেন্স কল শুরু করা হয়েছে। সরাসরি লিংকে জয়েন করুন!`,
        validUrl
      );
    }

    // Launch meeting room for the caller
    window.open(validUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMeetLinkInput(text.trim());
        showToast('ক্লিপবোর্ড থেকে লিংক পেস্ট করা হয়েছে!');
      }
    } catch {
      showToast('ক্লিপবোর্ড এক্সেস করা যায়নি। ম্যানুয়ালি পেস্ট করুন।');
    }
  };

  const handleCopyLink = () => {
    const textToCopy = meetLinkInput.trim() || 'https://meet.google.com/new';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('মিটিং লিংক কপি করা হয়েছে!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 font-bengali"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-sky-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
              <Video className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Google Meet কল ও মিটিং</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  রিয়েল কল
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>আমন্ত্রণ প্রাপক: <strong>{targetName}</strong></span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Feedback */}
        {toastMsg && (
          <div className="mx-4 mt-3 py-2 px-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold text-center animate-in fade-in">
            {toastMsg}
          </div>
        )}

        {/* Tab Selection */}
        <div className="px-4 sm:px-6 pt-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('instant')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'instant'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>১-ক্লিকে ইনস্ট্যান্ট মিট</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>কাস্টম লিংক পেস্ট</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {activeTab === 'instant' ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>গুগলের অফিসিয়াল সার্ভারে সরাসরি রুম তৈরি</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  নিচের বাটনে ক্লিক করলে গুগলের আসল গুগল মিট ইঞ্জিনে (<strong>meet.google.com/new</strong>) একটি নতুন মিটিং রুম চালু হবে। এরপর সেই লিংকটি সাথে সাথে {targetName}-কে পাঠানো যাবে।
                </p>
                <button
                  type="button"
                  onClick={handleLaunchInstantMeet}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-sm"
                >
                  <ExternalLink className="w-4 h-4 text-sky-400" />
                  <span>গুগল মিট ওপেন করুন (Open New Room)</span>
                </button>
              </div>

              {/* Optional Link Input for generated link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>মিটিং লিংক (ঐচ্ছিক - ডিফল্ট ইনস্ট্যান্ট লিংক পাঠানো হবে):</span>
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="text-[11px] text-sky-400 hover:underline cursor-pointer"
                  >
                    পেস্ট করুন
                  </button>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={meetLinkInput}
                    onChange={(e) => setMeetLinkInput(e.target.value)}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx (বা খালি রাখুন)"
                    className="w-full py-2.5 pl-3.5 pr-20 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  {meetLinkInput && (
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                <p className="text-xs text-slate-300 leading-relaxed">
                  আপনার গুগল ক্যালেন্ডার বা পূর্বে তৈরি করা গুগল মিটের নির্দিষ্ট লিংকটি (যেমন: <span className="font-mono text-emerald-300 text-[11px]">meet.google.com/abc-defg-hij</span>) নিচে দিয়ে আমন্ত্রণ পাঠান:
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    গুগল মিট URL:
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="text-[11px] text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>ক্লিপবোর্ড থেকে পেস্ট</span>
                  </button>
                </div>
                <input
                  type="url"
                  value={meetLinkInput}
                  onChange={(e) => setMeetLinkInput(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="w-full py-2.5 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 text-center sm:text-left">
            ক্লিক করলেই চ্যাটে সরাসরি জয়েন বাটনসহ আসল গুগল মিট লিংক চলে যাবে।
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={() => handleSendInvite()}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>মিটিং শুরু ও লিংক পাঠান</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
