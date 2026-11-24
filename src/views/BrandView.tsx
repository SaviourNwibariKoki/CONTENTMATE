import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { getStoredProfile, saveStoredProfile } from '../lib/storage';
import { Building2, Save, CheckCircle2 } from 'lucide-react';

export const BrandView: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile>(getStoredProfile());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#315B4C] bg-[#E4EEE8] px-2.5 py-1 rounded-full">
          <Building2 className="w-3.5 h-3.5" />
          <span>Brand Voice & Profile</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#20251F]">Business profile</h1>
        <p className="text-sm text-[#687067] max-w-2xl leading-relaxed">
          Configure your business details and brand voice. Contentmate automatically uses these preferences to guide your generated marketing drafts.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-[#DADDD5] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
              Business Name
            </label>
            <input
              type="text"
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              placeholder="e.g., Artisan Bakehouse"
              className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
              Business Category / Industry
            </label>
            <input
              type="text"
              value={profile.category}
              onChange={(e) => setProfile({ ...profile, category: e.target.value })}
              placeholder="e.g., Food & Bakery, Fashion, Consulting"
              className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
            Short Business Description
          </label>
          <textarea
            value={profile.description}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            rows={3}
            placeholder="e.g., Independent neighborhood bakery specializing in organic sourdough and pastries."
            className="w-full rounded-md border border-[#DADDD5] p-3 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
            Products or Services Offered
          </label>
          <input
            type="text"
            value={profile.productsOrServices}
            onChange={(e) => setProfile({ ...profile, productsOrServices: e.target.value })}
            placeholder="e.g., Sourdough bread, croissants, custom cakes, coffee"
            className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
              Typical Target Audience
            </label>
            <input
              type="text"
              value={profile.targetAudience}
              onChange={(e) => setProfile({ ...profile, targetAudience: e.target.value })}
              placeholder="e.g., Local food lovers and families"
              className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
              Preferred Writing Tone
            </label>
            <input
              type="text"
              value={profile.preferredTone}
              onChange={(e) => setProfile({ ...profile, preferredTone: e.target.value })}
              placeholder="e.g., Friendly and professional, Warm, Authoritative"
              className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
              Brand Vocabulary / Phrases to Use <span className="text-[#687067] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={profile.brandWords}
              onChange={(e) => setProfile({ ...profile, brandWords: e.target.value })}
              placeholder="e.g., artisanal, freshly baked, organic"
              className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
              Words or Claims to Avoid <span className="text-[#687067] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={profile.avoidWords}
              onChange={(e) => setProfile({ ...profile, avoidWords: e.target.value })}
              placeholder="e.g., cheap, guarantee, miracle"
              className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#DADDD5]/60 flex items-center justify-between">
          {savedSuccess ? (
            <div className="flex items-center space-x-2 text-[#367451] text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Brand profile saved successfully.</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#315B4C] hover:bg-[#25483C] text-white rounded-md text-sm font-medium shadow-sm transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save brand profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
