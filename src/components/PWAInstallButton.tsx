import React, { useState } from 'react';
import { Smartphone, Download, Share2, PlusSquare, X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already installed and running standalone as an app on phone, hide prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        // If dismissed or fallback needed
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Install Game on Phone"
        title="Install TimberCraft on your phone (Home Screen App)"
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:text-emerald-100 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-600/60 hover:border-emerald-500 rounded-lg transition-all shadow cursor-pointer active:scale-95 group"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Install on Phone</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* Phone Installation Guide Modal */}
      {showGuide && (
        <div
          onClick={() => setShowGuide(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-stone-900 border border-emerald-600/50 rounded-2xl shadow-2xl p-6 text-stone-100 max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={() => setShowGuide(false)}
              aria-label="Close installation guide"
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-600/60 flex items-center justify-center text-emerald-400 text-2xl shadow-inner">
                🌲
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-emerald-300">
                  Install TimberCraft on Phone
                </h3>
                <p className="text-xs text-stone-400">
                  Play full-screen with offline support & no browser address bar!
                </p>
              </div>
            </div>

            {/* If browser supports 1-click install prompt */}
            {isInstallable && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-700/50">
                <button
                  onClick={async () => {
                    const res = await install();
                    if (res) setShowGuide(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-98 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tap to Install Instantly</span>
                </button>
              </div>
            )}

            {/* Step-by-Step for iPhone / iPad */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5 mb-2 text-sm">
                  <span>📱</span>
                  <span>For iPhone & iPad (Safari):</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-stone-300 leading-relaxed">
                  <li>
                    Open this app URL in <strong className="text-stone-100">Safari</strong>.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span>1.</span>
                    <span>
                      Tap the <strong className="text-stone-100">Share</strong> button{' '}
                      <Share2 className="w-3.5 h-3.5 inline text-sky-400" /> at the bottom or top of Safari.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span>2.</span>
                    <span>
                      Scroll down and tap{' '}
                      <strong className="text-stone-100">Add to Home Screen</strong>{' '}
                      <PlusSquare className="w-3.5 h-3.5 inline text-amber-400" />.
                    </span>
                  </li>
                  <li>
                    Tap <strong className="text-emerald-400">Add</strong> in the top-right corner.
                  </li>
                </ol>
              </div>

              {/* Step-by-Step for Android */}
              <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800">
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-2 text-sm">
                  <span>🤖</span>
                  <span>For Android (Chrome / Samsung Internet):</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-stone-300 leading-relaxed">
                  <li>
                    Open this app URL in <strong className="text-stone-100">Chrome</strong> or your mobile browser.
                  </li>
                  <li>
                    Tap the three dots menu <strong className="text-stone-100">⋮</strong> in the top-right.
                  </li>
                  <li>
                    Tap <strong className="text-stone-100">Install app</strong> or{' '}
                    <strong className="text-stone-100">Add to Home screen</strong>.
                  </li>
                  <li>
                    Confirm to launch TimberCraft right from your phone's home screen icon!
                  </li>
                </ol>
              </div>
            </div>

            {/* Perks */}
            <div className="mt-4 pt-3 border-t border-stone-800 grid grid-cols-2 gap-2 text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Full screen app</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant load speed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Auto-saves progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Works offline</span>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
