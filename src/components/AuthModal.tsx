import React, { useState } from "react";
import { auth, googleProvider, firebaseConfig } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup 
} from "firebase/auth";
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle, Sparkles, ExternalLink, Check } from "lucide-react";
import { triggerLocalFallback } from "../lib/firebaseService";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const handleSandboxBypassWithRole = (roleEmail: string, roleName: string) => {
    const sandboxUser = {
      uid: "sandbox_uid_" + Math.random().toString(36).substring(2, 10),
      email: roleEmail,
      displayName: roleName,
      isSandbox: true
    };
    localStorage.setItem('molecule_sandbox_user', JSON.stringify(sandboxUser));
    triggerLocalFallback();
    onClose();
    window.location.reload();
  };

  const handleSandboxBypass = () => {
    const tempName = displayName.trim() ? displayName : (email ? email.split('@')[0] : "Rupesh Kumar");
    const chosenEmail = email.trim() ? email : "itsofficialrupeshcsa@gmail.com";
    handleSandboxBypassWithRole(chosenEmail, tempName);
  };

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          throw new Error("Please specify your full name.");
        }
        // Sign Up with Email/Password
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, {
          displayName: displayName
        });
      } else {
        // Sign In with Email/Password
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (error: any) {
      console.error("Authentication action failed:", error);
      let friendlyError = error?.message || "An unexpected issue occurred.";
      if (error?.code === "auth/invalid-credential") {
        friendlyError = "Incorrect email address or password. Please try again.";
      } else if (error?.code === "auth/email-already-in-use") {
        friendlyError = "This email is already in use by another member.";
      } else if (error?.code === "auth/weak-password") {
        friendlyError = "Password must be at least 6 characters long.";
      } else if (error?.code === "auth/invalid-email") {
        friendlyError = "Please enter a valid email address.";
      }
      setErrorMsg(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (error: any) {
      console.error("Google authentication failed:", error);
      // Ignore if user cancelled popup
      if (error?.code !== "auth/popup-closed-by-user") {
        if (error?.code === "auth/unauthorized-domain" || (error?.message && error?.message.includes("unauthorized-domain"))) {
          setErrorMsg("auth/unauthorized-domain");
        } else {
          setErrorMsg(error?.message || "Google Single Sign-On failed.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-950 border border-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-6">
          <div className="text-center">
            <span className="inline-flex items-center space-x-1 bg-red-500/10 text-red-500 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>{isSignUp ? "Create Secure Account" : "Registered Access"}</span>
            </span>
            <h3 className="text-2xl font-display font-medium text-white leading-tight">
              {isSignUp ? "Join Fitness Molecule" : "Sign In to Your Hub"}
            </h3>
            <p className="text-zinc-400 text-xs mt-1 font-sans">
              {isSignUp 
                ? "Enroll in Ghaziabad's elite biomechanical athlete network to manage your bookings." 
                : "Enter your member credentials below to resume personalized coaching schedules."}
            </p>
          </div>

          {errorMsg === "auth/unauthorized-domain" ? (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs p-4 sm:p-5 rounded-2xl flex flex-col space-y-3">
                <div className="flex items-start space-x-2.5">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />
                  <div className="text-left w-full">
                    <span className="font-mono font-bold uppercase text-[9px] tracking-wider block mb-1 text-zinc-500">Firebase Auth Setting Error</span>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">auth/unauthorized-domain</h4>
                    <p className="mt-1 leading-snug text-zinc-300 text-xs">
                      Firebase has blocked the Google Sign-In request because this specific preview URL path isn't registered in your project's authorized domains list.
                    </p>
                  </div>
                </div>

                <div className="border-t border-zinc-800/80 pt-3 mt-1.5 space-y-2.5 text-left">
                  <span className="text-[10px] uppercase font-mono font-bold text-red-400 tracking-wider block">How to enable in 45 seconds:</span>
                  <ol className="text-xs text-zinc-350 list-decimal list-inside space-y-1.5 leading-relaxed">
                    <li>
                      Go to the {" "}
                      <a 
                        href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-red-400 hover:text-red-300 hover:underline inline-flex items-center gap-1 font-medium bg-red-950/15 border border-red-900/30 px-1.5 py-0.5 rounded"
                      >
                        <span>Firebase Authentication Settings</span>
                        <ExternalLink className="h-3 w-3 inline" />
                      </a>
                    </li>
                    <li>Click on the <strong className="text-white">"Authorized Domains"</strong> tab.</li>
                    <li>Click <strong className="text-white">"Add domain"</strong> and register this preview URL's host:</li>
                  </ol>

                  <div className="space-y-1.5 mt-2">
                    <div className="bg-zinc-950 border border-zinc-850 px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between text-zinc-300">
                      <span className="select-all truncate mr-2 font-mono text-[11px] text-zinc-400">{window.location.hostname}</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          const domain = window.location.hostname;
                          navigator.clipboard.writeText(domain);
                          setCopiedDomain(true);
                          setTimeout(() => setCopiedDomain(false), 2000);
                        }}
                        className="text-[10px] text-red-400 hover:text-red-350 bg-red-950/20 px-2 py-1 rounded border border-red-900/35 cursor-pointer font-bold select-none shrink-0 flex items-center space-x-1"
                      >
                        {copiedDomain ? <Check className="h-3 w-3" /> : null}
                        <span>{copiedDomain ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-zinc-500 leading-normal font-sans pt-1">
                    💡 Due to sandboxed development, you can also completely bypass this cloud verification by using the bypass button below or clicking on one of the Quick Sandbox buttons.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSandboxBypass}
                className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-400 hover:text-amber-300 text-xs py-3 px-4 rounded-xl font-bold font-mono tracking-wide transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Bypass with Sandbox Session</span>
              </button>
            </div>
          ) : errorMsg ? (
            <div className="space-y-3">
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs p-3.5 rounded-xl flex flex-col space-y-2">
                <div className="flex items-start space-x-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                  <div className="text-left">
                    <span className="font-mono font-bold uppercase text-[9px] tracking-wider block mb-0.5 text-zinc-500">Firebase Event Log</span>
                    <p className="leading-snug text-zinc-300">{errorMsg}</p>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-550 leading-relaxed font-sans border-t border-rose-500/10 pt-1.5 text-left">
                  💡 Due to sandbox preview limitations, you can bypass cloud sync & test authentication, admin dashboards and scheduling instantly in local-persisted Sandbox Storage.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSandboxBypass}
                className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-400 hover:text-amber-300 text-xs py-3 px-4 rounded-xl font-bold font-mono tracking-wide transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Bypass with Sandbox Session</span>
              </button>
            </div>
          ) : null}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Display Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Rupesh Kumar"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none transition-colors placeholder-zinc-650"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none transition-colors placeholder-zinc-650"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none transition-colors placeholder-zinc-650"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-4 rounded-xl text-center text-sm transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-red-500/10 hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSignUp ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              <span>{loading ? "Processing Securely..." : isSignUp ? "Create Account & Agree" : "Secure Sign In"}</span>
            </button>
          </form>

          {/* Social Sign In Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-zinc-500 font-mono text-[9px] uppercase tracking-widest font-bold">OR DIRECT DISCOVERY</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-white font-bold py-3 px-4 rounded-xl text-center text-sm transition-colors flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google Login</span>
          </button>

          {/* Quick Sandbox Access Hub */}
          <div className="border-t border-zinc-800/60 pt-4 mt-2">
            <span className="block text-center text-zinc-500 font-mono text-[9px] uppercase tracking-widest font-bold mb-3">
              🔋 QUICK TEST SANDBOX ASSISTANT
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSandboxBypassWithRole("itsofficialrupeshcsa@gmail.com", "Rupesh Kumar (Admin)")}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs py-2 px-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-1 hover:text-red-300 cursor-pointer"
              >
                <span>🔑 Admin Mode</span>
              </button>
              <button
                type="button"
                onClick={() => handleSandboxBypassWithRole("athlete@fitnessmolecule.com", "Athlete Member")}
                className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs py-2 px-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-1 hover:text-white cursor-pointer"
              >
                <span>💪 Member Mode</span>
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 text-center mt-2.5 leading-snug">
              Instant login simulation without triggering Firebase sync limits.
            </p>
          </div>

          {/* Toggle Button */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-red-500 hover:text-red-400 hover:underline border-none bg-transparent cursor-pointer font-sans"
            >
              {isSignUp 
                ? "Already registered? Click here to sign in" 
                : "New molecule athlete? Create an account in 10 seconds"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
