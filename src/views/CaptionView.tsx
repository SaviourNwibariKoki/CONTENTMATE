import React, { useState } from 'react';
import { BusinessProfile, SavedContent } from '../types';
import { saveToLibrary } from '../lib/storage';
import { 
  MessageSquare, 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  RefreshCw, 
  AlertCircle,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

interface CaptionViewProps {
  profile: BusinessProfile;
  onBack: () => void;
  onSaved: (item: SavedContent) => void;
}

export const CaptionView: React.FC<CaptionViewProps> = ({ profile, onBack, onSaved }) => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [objective, setObjective] = useState('Promote a product or service');
  const [audience, setAudience] = useState(profile.targetAudience);
  const [tone, setTone] = useState(profile.preferredTone || 'Friendly and professional');
  const [length, setLength] = useState('Medium');
  const [callToAction, setCallToAction] = useState('');
  const [details, setDetails] = useState('');
  const [includeHashtags, setIncludeHashtags] = useState(true);

  // Result state
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [variationInstruction, setVariationInstruction] = useState('');
  const [showVariationBox, setShowVariationBox] = useState(false);

  const handleGenerate = async (e?: React.FormEvent, isVariation = false) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError('Add a few details before creating your content.');
      return;
    }

    setLoading(true);
    setError('');
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'caption',
          businessProfile: profile,
          input: {
            topic,
            platform,
            objective,
            audience,
            tone,
            length,
            callToAction,
            details,
            includeHashtags,
          },
          variationInstruction: isVariation ? variationInstruction : undefined,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message || 'Generation failed.');
      }

      setResult(json.data);
      if (isVariation) {
        setVariationInstruction('');
        setShowVariationBox(false);
      }
    } catch (err: any) {
      setError(err.message || 'We couldn’t reach the content service. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSave = () => {
    if (!result) return;
    const title = topic.length > 40 ? topic.substring(0, 40) + '...' : topic;
    const saved = saveToLibrary({
      title,
      task: 'caption',
      platform,
      content: result,
      input: { topic, platform, objective, audience, tone, length, callToAction, details },
    });
    setSavedSuccess(true);
    onSaved(saved);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-sm font-medium text-[#687067] hover:text-[#20251F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to workflows</span>
        </button>
        <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#315B4C] bg-[#E4EEE8] px-2.5 py-1 rounded-full">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Social Media Caption</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#DADDD5] p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#20251F]">Social caption generator</h1>
            <p className="text-xs text-[#687067] mt-1">
              Create platform-aware captions with tone, audience, and hashtags tailored for your business.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-[#B33D35]/10 border border-[#B33D35]/20 text-[#B33D35] text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={(e) => handleGenerate(e, false)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                What is the post about? <span className="text-[#B33D35]">*</span>
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                placeholder="e.g., New batch of artisanal sourdough bread fresh out of the oven this Saturday morning."
                className="w-full rounded-md border border-[#DADDD5] p-3 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C] focus:ring-1 focus:ring-[#315B4C]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] bg-white focus:outline-none focus:border-[#315B4C]"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="TikTok">TikTok</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                  Objective
                </label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] bg-white focus:outline-none focus:border-[#315B4C]"
                >
                  <option value="Promote a product or service">Promote product/service</option>
                  <option value="Announce news or update">Announce news/update</option>
                  <option value="Educate customers">Educate customers</option>
                  <option value="Engage audience">Engage audience</option>
                  <option value="Build trust / Share story">Build trust / Share story</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                  Tone
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                  Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] bg-white focus:outline-none focus:border-[#315B4C]"
                >
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Long">Long</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                  Hashtags
                </label>
                <select
                  value={includeHashtags ? 'yes' : 'no'}
                  onChange={(e) => setIncludeHashtags(e.target.value === 'yes')}
                  className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] bg-white focus:outline-none focus:border-[#315B4C]"
                >
                  <option value="yes">Include</option>
                  <option value="no">Do not include</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                Target Audience <span className="text-[#687067] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., Local food lovers, busy professionals"
                className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                Call to Action <span className="text-[#687067] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="e.g., Send us a direct message to reserve yours."
                className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                Specific Facts or Price <span className="text-[#687067] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g., Price $12 per loaf. Pickup between 9am and 2pm."
                className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#315B4C] hover:bg-[#25483C] text-white rounded-md text-sm font-medium shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating your draft…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate caption</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-[#DADDD5] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DADDD5]/60 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#315B4C]"></div>
                <h2 className="font-serif text-lg font-bold text-[#20251F]">Generated draft</h2>
              </div>
              {result && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 bg-[#E4EEE8] hover:bg-[#315B4C] hover:text-white text-[#315B4C] rounded text-xs font-medium transition-colors flex items-center space-x-1"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{savedSuccess ? 'Saved!' : 'Save draft'}</span>
                  </button>
                </div>
              )}
            </div>

            {!result ? (
              <div className="py-20 text-center border-2 border-dashed border-[#DADDD5] rounded-lg space-y-3">
                <MessageSquare className="w-10 h-10 text-[#687067]/30 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#20251F]">Your generated caption will appear here</p>
                  <p className="text-xs text-[#687067]">Fill in your topic on the left and click Generate caption.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Hook / Alternative opening */}
                {result.hook && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#687067] uppercase tracking-wider">
                      <span>Opening hook option</span>
                      <button
                        onClick={() => handleCopy(result.hook, 'hook')}
                        className="text-[#315B4C] hover:underline flex items-center space-x-1 lowercase"
                      >
                        {copiedSection === 'hook' ? <Check className="w-3 h-3 text-[#367451]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSection === 'hook' ? 'Copied' : 'copy'}</span>
                      </button>
                    </div>
                    <div className="p-3 bg-[#F7F7F3] rounded-md border border-[#DADDD5] text-sm text-[#20251F] font-medium">
                      {result.hook}
                    </div>
                  </div>
                )}

                {/* Main Caption */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#687067] uppercase tracking-wider">
                    <span>Main caption ({platform})</span>
                    <button
                      onClick={() => handleCopy(result.caption, 'caption')}
                      className="text-[#315B4C] hover:underline flex items-center space-x-1 lowercase"
                    >
                      {copiedSection === 'caption' ? <Check className="w-3 h-3 text-[#367451]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSection === 'caption' ? 'Copied' : 'copy'}</span>
                    </button>
                  </div>
                  <textarea
                    value={result.caption}
                    onChange={(e) => setResult({ ...result, caption: e.target.value })}
                    rows={6}
                    className="w-full rounded-md border border-[#DADDD5] p-3 text-sm text-[#20251F] leading-relaxed focus:outline-none focus:border-[#315B4C]"
                  />
                </div>

                {/* Call to Action */}
                {result.callToAction && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#687067] uppercase tracking-wider">
                      <span>Call to action</span>
                      <button
                        onClick={() => handleCopy(result.callToAction, 'cta')}
                        className="text-[#315B4C] hover:underline flex items-center space-x-1 lowercase"
                      >
                        {copiedSection === 'cta' ? <Check className="w-3 h-3 text-[#367451]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSection === 'cta' ? 'Copied' : 'copy'}</span>
                      </button>
                    </div>
                    <div className="p-3 bg-[#F7F7F3] rounded-md border border-[#DADDD5] text-sm text-[#20251F]">
                      {result.callToAction}
                    </div>
                  </div>
                )}

                {/* Hashtags */}
                {result.hashtags && result.hashtags.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#687067] uppercase tracking-wider">
                      <span>Hashtags</span>
                      <button
                        onClick={() => handleCopy(result.hashtags.map((h: string) => `#${h}`).join(' '), 'hashtags')}
                        className="text-[#315B4C] hover:underline flex items-center space-x-1 lowercase"
                      >
                        {copiedSection === 'hashtags' ? <Check className="w-3 h-3 text-[#367451]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSection === 'hashtags' ? 'Copied' : 'copy all'}</span>
                      </button>
                    </div>
                    <div className="p-3 bg-[#F7F7F3] rounded-md border border-[#DADDD5] text-sm text-[#315B4C] flex flex-wrap gap-2">
                      {result.hashtags.map((tag: string, i: number) => (
                        <span key={i} className="bg-white px-2 py-1 rounded border border-[#DADDD5] text-xs font-medium">
                          #{tag.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variation controls */}
                <div className="pt-4 border-t border-[#DADDD5]/60 space-y-3">
                  {!showVariationBox ? (
                    <button
                      onClick={() => setShowVariationBox(true)}
                      className="w-full py-2 bg-[#EFEFE9] hover:bg-[#DADDD5]/60 text-[#20251F] rounded-md text-xs font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Request variation or adjustment</span>
                    </button>
                  ) : (
                    <div className="space-y-2 p-4 bg-[#F7F7F3] rounded-lg border border-[#DADDD5]">
                      <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider">
                        How should we change this caption?
                      </label>
                      <input
                        type="text"
                        value={variationInstruction}
                        onChange={(e) => setVariationInstruction(e.target.value)}
                        placeholder="e.g., Make it shorter, or more enthusiastic."
                        className="w-full rounded-md border border-[#DADDD5] p-2 text-xs text-[#20251F] bg-white focus:outline-none focus:border-[#315B4C]"
                      />
                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          onClick={() => setShowVariationBox(false)}
                          className="px-3 py-1.5 text-xs text-[#687067] hover:text-[#20251F]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => handleGenerate(e, true)}
                          disabled={loading}
                          className="px-3 py-1.5 bg-[#315B4C] text-white rounded text-xs font-medium hover:bg-[#25483C]"
                        >
                          Generate variation
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {savedSuccess && (
                  <div className="p-3 rounded-lg bg-[#367451]/10 border border-[#367451]/20 text-[#367451] text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Draft saved to your library successfully.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
