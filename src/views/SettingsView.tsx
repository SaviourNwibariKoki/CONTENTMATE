import React, { useState } from 'react';
import { clearAllData, getStoredLibrary } from '../lib/storage';
import { Sliders, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [libraryCount, setLibraryCount] = useState(getStoredLibrary().length);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClearData = () => {
    clearAllData();
    setLibraryCount(0);
    setShowClearConfirm(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#315B4C] bg-[#E4EEE8] px-2.5 py-1 rounded-full">
          <Sliders className="w-3.5 h-3.5" />
          <span>Preferences & Controls</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#20251F]">Settings</h1>
        <p className="text-sm text-[#687067] max-w-2xl leading-relaxed">
          Manage your local workspace data, privacy preferences, and app storage.
        </p>
      </div>

      <div className="space-y-6">
        {/* Storage stats */}
        <div className="bg-white rounded-xl border border-[#DADDD5] p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-[#20251F]">Workspace storage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F7F7F3] rounded-lg border border-[#DADDD5] space-y-1">
              <span className="text-xs font-semibold text-[#687067] uppercase tracking-wider block">Saved Drafts</span>
              <span className="text-2xl font-bold text-[#20251F]">{libraryCount} items</span>
            </div>
            <div className="p-4 bg-[#F7F7F3] rounded-lg border border-[#DADDD5] space-y-1">
              <span className="text-xs font-semibold text-[#687067] uppercase tracking-wider block">Persistence Mode</span>
              <span className="text-sm font-semibold text-[#315B4C] block mt-1">Browser Local Storage</span>
            </div>
          </div>
        </div>

        {/* Privacy & Factual Integrity info */}
        <div className="bg-white rounded-xl border border-[#DADDD5] p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-[#315B4C]">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="font-serif text-lg font-bold text-[#20251F]">Privacy & factual integrity</h2>
          </div>
          <p className="text-xs text-[#687067] leading-relaxed">
            Contentmate generates text drafts securely through server-side AI calls. Your data is stored locally in your browser. We never invent unverified specifications, prices, testimonials, or guarantees.
          </p>
        </div>

        {/* Danger zone / Clear data */}
        <div className="bg-white rounded-xl border border-[#B33D35]/30 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-[#B33D35]">
            <Trash2 className="w-5 h-5" />
            <h2 className="font-serif text-lg font-bold text-[#20251F]">Clear workspace data</h2>
          </div>
          <p className="text-xs text-[#687067] leading-relaxed">
            Permanently delete all saved drafts and reset your business profile data stored in this browser.
          </p>

          {cleared && (
            <div className="p-3 bg-[#367451]/10 text-[#367451] rounded-md text-xs font-medium">
              All workspace data cleared successfully.
            </div>
          )}

          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 bg-[#B33D35]/10 hover:bg-[#B33D35]/20 text-[#B33D35] rounded-md text-xs font-medium transition-colors border border-[#B33D35]/30"
            >
              Clear all data
            </button>
          ) : (
            <div className="p-4 bg-[#B33D35]/5 rounded-lg border border-[#B33D35]/30 space-y-3">
              <div className="flex items-center space-x-2 text-[#B33D35]">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold">Are you sure? This cannot be undone.</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 text-xs text-[#687067] hover:text-[#20251F]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  className="px-3 py-1.5 bg-[#B33D35] hover:bg-[#962e28] text-white rounded text-xs font-medium"
                >
                  Confirm and clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
