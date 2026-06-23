import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { safeStorage } from '../lib/safeStorage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }

  private handleReset = () => {
    try {
      safeStorage.removeItem('molecule_use_fallback');
      safeStorage.removeItem('molecule_sandbox_user');
    } catch (e) {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-white font-sans">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
          
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse"></div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-full">
                <AlertOctagon className="h-8 w-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold font-sans tracking-tight text-white uppercase">
                  Biomechanical Thread Alert
                </h2>
                <p className="text-sm font-mono text-zinc-400">
                  An unexpected layout error transcended our visual system limits.
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-left">
                <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold mb-1">
                  Debug Signature
                </span>
                <p className="text-xs font-mono text-red-400 break-all leading-relaxed whitespace-pre-wrap">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold font-sans rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-[0.98]"
            >
              <RefreshCw className="h-4 w-4 animate-spin-slow" />
              <span>Calibrate and Reset Session</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


