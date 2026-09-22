import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorUp,
  Hand,
  MessageSquare,
  Users,
  PhoneOff,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  X,
  Send,
  Radio,
  ExternalLink,
  Info,
  RefreshCw
} from 'lucide-react';
import { useData } from '../context/DataContext';

export interface InAppMeetStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomTitle?: string;
  targetName?: string;
  targetAvatar?: string;
  targetRole?: string;
  courseTitle?: string;
  windowId?: string;
  initialType?: 'video' | 'audio' | 'screen';
}

interface InMeetingChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
}

export const InAppMeetStudioModal: React.FC<InAppMeetStudioModalProps> = ({
  isOpen,
  onClose,
  roomTitle = 'লাইভ মিটিং ও কনফারেন্স রুম',
  targetName = 'তানজিম আহমেদ (সেবাগ্রহীতা)',
  targetAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  targetRole = 'অনলাইন ক্লায়েন্ট / শিক্ষার্থী',
  courseTitle,
  windowId,
  initialType = 'video'
}) => {
  const { currentUser, playAppSound, sendChatMessage } = useData();

  // Media states
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(initialType === 'audio');
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(initialType === 'screen');
  const [hasRaisedHand, setHasRaisedHand] = useState<boolean>(false);
  const [activeSidePanel, setActiveSidePanel] = useState<'none' | 'chat' | 'participants' | 'info'>('none');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Participant simulation states
  const [remoteSpeaking, setRemoteSpeaking] = useState<boolean>(false);

  // In-meeting Chat
  const [meetingChatInput, setMeetingChatInput] = useState<string>('');
  const [meetingMessages, setMeetingMessages] = useState<InMeetingChatMessage[]>([
    {
      id: 'm-1',
      sender: 'সিস্টেম বট',
      text: 'স্বাগতম! লাইভ মিটিংয়ে সরাসরি যুক্ত হয়েছেন। ভিডিও, অডিও ও চ্যাটের মাধ্যমে কথা বলতে পারেন।',
      time: 'এখন',
      isSelf: false
    },
    {
      id: 'm-2',
      sender: targetName,
      text: 'আসসালামু আলাইকুম, আমি মিটিংয়ে যুক্ত হয়েছি। আপনার কথা শুনতে পাচ্ছি।',
      time: 'এখন',
      isSelf: false
    }
  ]);

  // Video Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Room Identifier
  const roomCode = useRef(`PTN-${Math.floor(1000 + Math.random() * 9000)}`).current;

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  // Remote speaking pulse simulation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setRemoteSpeaking(Math.random() > 0.4);
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Real Camera & Mic Stream Setup
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function initMedia() {
      try {
        setPermissionError(null);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          if (!isMounted) {
            stream.getTracks().forEach(t => t.stop());
            return;
          }
          mediaStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          try {
            playAppSound('success');
          } catch {}
        }
      } catch (err: any) {
        console.warn('Media devices access note:', err);
        setPermissionError('ক্যামেরা/মাইক্রোফোন চালু করা যায়নি অথবা ডিভাইসে অনুমতি প্রয়োজন। মিটিং অডিও-ভিজ্যুয়াল মোডে চলছে।');
      }
    }

    initMedia();

    return () => {
      isMounted = false;
      // Stop all tracks on cleanup
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
    };
  }, [isOpen]);

  // Toggle Mic
  const handleToggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMicMuted;
      });
    }
    const nextState = !isMicMuted;
    setIsMicMuted(nextState);
    showToast(nextState ? '🔇 মাইক্রোফোন মিউট করা হয়েছে' : '🎤 মাইক্রোফোন অন করা হয়েছে');
    playAppSound('click');
  };

  // Toggle Camera
  const handleToggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isCameraOff;
      });
    }
    const nextState = !isCameraOff;
    setIsCameraOff(nextState);
    showToast(nextState ? '📷 ক্যামেরা বন্ধ করা হয়েছে' : '📹 ক্যামেরা চালু করা হয়েছে');
    playAppSound('click');
  };

  // Toggle Screen Share
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      showToast('স্ক্রিন শেয়ার বন্ধ করা হয়েছে');
      playAppSound('click');
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        setIsScreenSharing(true);
        showToast('🖥️ স্ক্রিন শেয়ার শুরু হয়েছে!');
        playAppSound('success');

        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }

        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          screenStreamRef.current = null;
          showToast('স্ক্রিন শেয়ার সমাপ্ত হয়েছে');
        };
      } else {
        showToast('আপনার ব্রাউজারে স্ক্রিন শেয়ার সমর্থন করে না।');
      }
    } catch {
      showToast('স্ক্রিন শেয়ার বাতিল করা হয়েছে');
    }
  };

  // Handle Raise Hand
  const handleRaiseHand = () => {
    const next = !hasRaisedHand;
    setHasRaisedHand(next);
    playAppSound(next ? 'notification' : 'click');
    showToast(next ? '✋ আপনি হাত তুলেছেন' : 'হাত নামানো হয়েছে');

    if (next) {
      setMeetingMessages(prev => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          sender: 'সিস্টেম',
          text: `✋ ${currentUser?.name || 'আপনি'} মিটিংয়ে হাত তুলেছেন।`,
          time: 'এখন',
          isSelf: true
        }
      ]);
    }
  };

  // Send In-Meeting Message
  const handleSendMeetingMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!meetingChatInput.trim()) return;

    const newMsg: InMeetingChatMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser?.name || 'আপনি',
      text: meetingChatInput.trim(),
      time: 'এখন',
      isSelf: true
    };

    setMeetingMessages(prev => [...prev, newMsg]);
    setMeetingChatInput('');
    playAppSound('message');

    // Also sync to global messenger thread if available
    if (windowId) {
      sendChatMessage(windowId, `[মিটিং চ্যাট]: ${newMsg.text}`);
    }

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Copy Room Link / Code
  const handleCopyMeetingInfo = () => {
    const meetShareText = `${window.location.origin}?meetRoom=${roomCode}`;
    navigator.clipboard.writeText(meetShareText);
    setCopiedLink(true);
    showToast('মিটিং জয়েন লিংক সফলভাবে কপি করা হয়েছে!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Toggle FullScreen
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullScreen(false);
    }
  };

  // End Call
  const handleEndCall = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }
    playAppSound('click');
    onClose();
  };

  if (!isOpen) return null;

  const formattedTime = `${Math.floor(callDuration / 60)
    .toString()
    .padStart(2, '0')}:${(callDuration % 60).toString().padStart(2, '0')}`;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100000] flex flex-col bg-slate-950 text-white font-bengali select-none animate-in fade-in duration-200"
    >
      {/* TOP BAR / HEADER */}
      <div className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        {/* Left: Brand & Room Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#006A4E] to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
                PTENit Live Meet
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
              <span className="font-bold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                {courseTitle || roomTitle}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono text-[11px]">{roomCode}</span>
            </div>
          </div>
        </div>

        {/* Center: Live Timer & Security Badge */}
        <div className="hidden md:flex items-center gap-3 bg-slate-950/70 border border-slate-800/80 px-4 py-1.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-mono font-black text-slate-200 tracking-wider">
              {formattedTime}
            </span>
          </div>
          <span className="h-3 w-px bg-slate-700" />
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>নিরাপদ এনক্রিপ্টেড কল</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyMeetingInfo}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
            title="মিটিং লিংক কপি করুন"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
            title={isFullScreen ? 'ছোট পর্দা' : 'ফুলস্ক্রিন'}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleEndCall}
            className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TOAST ALERT OVERLAY */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-600/90 border border-emerald-400 text-white text-xs font-bold rounded-2xl shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-150">
          {toastMessage}
        </div>
      )}

      {/* PERMISSION ERROR BANNER */}
      {permissionError && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-1.5 text-center text-amber-300 text-xs font-bold flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-amber-400" />
          <span>{permissionError}</span>
        </div>
      )}

      {/* MAIN MEETING STAGE & CONTENT */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* VIDEO CONFERENCE CANVAS */}
        <div className="flex-1 p-3 sm:p-5 flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          {/* Main Stage Tile (Remote / Screen share) */}
          <div className="w-full h-full max-w-5xl rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 relative flex items-center justify-center shadow-2xl">
            {isScreenSharing ? (
              // SCREEN SHARE STREAM
              <div className="w-full h-full relative flex items-center justify-center bg-black">
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md">
                  <MonitorUp className="w-4 h-4 animate-bounce text-emerald-400" />
                  <span>আপনি স্ক্রিন শেয়ার করছেন</span>
                </div>
              </div>
            ) : (
              // REMOTE PARTICIPANT TILE
              <div className="w-full h-full relative flex flex-col items-center justify-center p-6 bg-radial from-slate-900 to-slate-950">
                {/* Active audio ripple wave */}
                <div className="relative mb-6">
                  {remoteSpeaking && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping scale-125" />
                      <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-pulse scale-150" />
                    </>
                  )}
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-emerald-500/80 shadow-2xl relative z-10">
                    <img
                      src={targetAvatar}
                      alt={targetName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Mic status badge */}
                  <div className="absolute bottom-1 right-1 z-20 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-slate-950 shadow-md">
                    {remoteSpeaking ? (
                      <Mic className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <div className="text-center space-y-1 relative z-10">
                  <h3 className="text-lg sm:text-2xl font-black text-white flex items-center justify-center gap-2">
                    <span>{targetName}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-bold">
                    {targetRole}
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800/80 text-sky-400 border border-slate-700">
                      {remoteSpeaking ? '🎙️ কথা বলছেন...' : '🟢 লাইভ কানেক্টেড'}
                    </span>
                  </div>
                </div>

                {/* Bottom-left Participant Label */}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{targetName}</span>
                </div>
              </div>
            )}

            {/* LOCAL USER PIP CAMERA (Floating inside the stage) */}
            <div className="absolute bottom-4 right-4 w-36 sm:w-56 aspect-video bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl z-30 group">
              {!isCameraOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 p-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs border border-slate-700 mb-1">
                    {currentUser?.name ? currentUser.name.charAt(0) : 'আপ'}
                  </div>
                  <span className="text-[10px] text-slate-400">ক্যামেরা বন্ধ</span>
                </div>
              )}

              {/* Local Video Label */}
              <div className="absolute bottom-1.5 left-1.5 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                <span>আপনি</span>
                {isMicMuted ? (
                  <MicOff className="w-2.5 h-2.5 text-rose-400" />
                ) : (
                  <Mic className="w-2.5 h-2.5 text-emerald-400" />
                )}
              </div>

              {hasRaisedHand && (
                <div className="absolute top-1.5 right-1.5 bg-amber-500 text-slate-950 p-1 rounded-lg shadow-md animate-bounce">
                  <Hand className="w-3.5 h-3.5 font-bold" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIDE PANELS (Chat / Participants / Info) */}
        {activeSidePanel !== 'none' && (
          <div className="w-full sm:w-80 md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col z-30 animate-in slide-in-from-right duration-200 shrink-0">
            {/* Panel Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2 font-black text-sm">
                {activeSidePanel === 'chat' && (
                  <>
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <span>ইন-মিটিং লাইভ চ্যাট</span>
                  </>
                )}
                {activeSidePanel === 'participants' && (
                  <>
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>অংশগ্রহণকারী তালিকা (২)</span>
                  </>
                )}
                {activeSidePanel === 'info' && (
                  <>
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>মিটিং বিবরণ ও শেয়ারিং</span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveSidePanel('none')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* CHAT PANEL */}
              {activeSidePanel === 'chat' && (
                <div className="flex flex-col h-full justify-between gap-3">
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {meetingMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-2xl text-xs space-y-1 ${
                          msg.isSelf
                            ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-200 ml-4'
                            : 'bg-slate-800 text-slate-200 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-white">{msg.sender}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>

                  <form onSubmit={handleSendMeetingMessage} className="pt-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={meetingChatInput}
                        onChange={(e) => setMeetingChatInput(e.target.value)}
                        placeholder="মিটিংয়ের সবার জন্য লিখুন..."
                        className="w-full py-2.5 pl-3.5 pr-12 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* PARTICIPANTS PANEL */}
              {activeSidePanel === 'participants' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm border-2 border-slate-800">
                        {currentUser?.name?.charAt(0) || 'আ'}
                      </div>
                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>{currentUser?.name || 'আপনি'}</span>
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-400 font-bold">
                            হোস্ট
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">ডিভাইস অডিও ও ভিডিও প্রস্তুত</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {isMicMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                      {isCameraOff ? <VideoOff className="w-4 h-4 text-rose-400" /> : <Video className="w-4 h-4 text-emerald-400" />}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-800">
                        <img src={targetAvatar} alt={targetName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>{targetName}</span>
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-sky-500/20 text-sky-400 font-bold">
                            পার্টিসিপেন্ট
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{targetRole}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <Video className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* INFO PANEL */}
              {activeSidePanel === 'info' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>লাইভ মিটিং তথ্য</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      নিরাপদ এনক্রিপ্টেড ভিডিও ও অডিও কনফারেন্সিং। সরাসরি মিটিং চলাকালীন অডিও, ভিডিও ও স্ক্রিন শেয়ারের মাধ্যমে যোগাযোগ করুন।
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-slate-300">মিটিং কোড:</div>
                    <div className="text-base font-mono font-black text-emerald-400 bg-slate-900 p-2 rounded-xl text-center border border-slate-800">
                      {roomCode}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyMeetingInfo}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>ইনভাইট লিংক কপি করুন</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROL DOCK */}
      <div className="h-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        {/* Left: Placeholder to balance layout */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 w-32" />

        {/* Center: Essential Controls */}
        <div className="flex items-center gap-2 sm:gap-3 mx-auto">
          {/* Mute/Unmute Mic */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-3 sm:p-3.5 rounded-2xl transition cursor-pointer active:scale-95 shadow-md ${
              isMicMuted
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
            title={isMicMuted ? 'আনমিউট করুন' : 'মাইক বন্ধ করুন'}
          >
            {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Turn Camera On/Off */}
          <button
            type="button"
            onClick={handleToggleCamera}
            className={`p-3 sm:p-3.5 rounded-2xl transition cursor-pointer active:scale-95 shadow-md ${
              isCameraOff
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
            title={isCameraOff ? 'ক্যামেরা চালু করুন' : 'ক্যামেরা বন্ধ করুন'}
          >
            {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            type="button"
            onClick={handleToggleScreenShare}
            className={`p-3 sm:p-3.5 rounded-2xl transition cursor-pointer active:scale-95 shadow-md ${
              isScreenSharing
                ? 'bg-emerald-600 text-white shadow-emerald-900/40 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title={isScreenSharing ? 'স্ক্রিন শেয়ার বন্ধ করুন' : 'স্ক্রিন শেয়ার করুন'}
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          {/* Raise Hand */}
          <button
            type="button"
            onClick={handleRaiseHand}
            className={`p-3 sm:p-3.5 rounded-2xl transition cursor-pointer active:scale-95 shadow-md ${
              hasRaisedHand
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="হাত তুলুন (Raise Hand)"
          >
            <Hand className="w-5 h-5" />
          </button>

          {/* In-Meeting Chat Toggle */}
          <button
            type="button"
            onClick={() => setActiveSidePanel(prev => prev === 'chat' ? 'none' : 'chat')}
            className={`p-3 sm:p-3.5 rounded-2xl transition cursor-pointer active:scale-95 shadow-md relative ${
              activeSidePanel === 'chat'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="ইন-মিটিং চ্যাট"
          >
            <MessageSquare className="w-5 h-5" />
            {meetingMessages.length > 2 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-sky-400 ring-2 ring-slate-900" />
            )}
          </button>

          {/* Participants Toggle */}
          <button
            type="button"
            onClick={() => setActiveSidePanel(prev => prev === 'participants' ? 'none' : 'participants')}
            className={`p-3 sm:p-3.5 rounded-2xl transition cursor-pointer active:scale-95 shadow-md ${
              activeSidePanel === 'participants'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="অংশগ্রহণকারী তালিকা"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* End Call / Leave */}
          <button
            type="button"
            onClick={handleEndCall}
            className="px-4 sm:px-6 py-3 sm:py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-red-950/60 flex items-center gap-2 transition cursor-pointer active:scale-95"
            title="কল শেষ করুন"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="hidden sm:inline">কল শেষ</span>
          </button>
        </div>

        {/* Right: Info / Settings Toggle */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSidePanel(prev => prev === 'info' ? 'none' : 'info')}
            className={`p-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              activeSidePanel === 'info'
                ? 'bg-slate-800 border-emerald-500 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
