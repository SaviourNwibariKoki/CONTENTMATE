import React, { useState } from 'react';
import { BusinessProfile, SavedContent } from '../types';
import { saveToLibrary } from '../lib/storage';
import { 
  Megaphone, 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  RefreshCw, 
  AlertCircle,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

interface AdCopyViewProps {
  profile: BusinessProfile;
  onBack: () => void;
  onSaved: (item: SavedContent) => void;
}

export const AdCopyView: React.FC<AdCopyViewProps> = ({ profile, onBack, onSaved }) => {
  const [product, setProduct] = useState('');
  const [promotion, setPromotion] = useState('');
  const [audience, setAudience] = useState(profile.targetAudience);
  const [objective, setObjective] = useState('Sales / Conversions');
  const [platform, setPlatform] = useState('Facebook & Instagram Ads');
  const [offer, setOffer] = useState('');
  const [action, setAction] = useState('Visit website');
  const [tone, setTone] = useState(profile.preferredTone || 'Persuasive but natural');

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [variationInstruction, setVariationInstruction] = useState('');
  const [showVariationBox, setShowVariationBox] = useState(false);

  const handleGenerate = async (e?: React.FormEvent, isVariation = false) => {
    if (e) e.preventDefault();
    if (!product.trim() || !promotion.trim()) {
      setError('Please provide product and promotion details.');
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
          task: 'ad-copy',
          businessProfile: profile,
          input: {
            product,
            promotion,
            audience,
            objective,
            platform,
            offer,
            action,
            tone,
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
    const title = product.length > 40 ? product.substring(0, 40) + '...' : product;
    const saved = saveToLibrary({
      title,
      task: 'ad-copy',
      platform,
      content: result,
      input: { product, promotion, audience, objective, platform, offer, action, tone },
    });
    setSavedSuccess(true);
    onSaved(saved);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-sm font-medium text-[#687067] hover:text-[#20251F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to workflows</span>
        </button>
        <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#315B4C] bg-[#E4EEE8] px-2.5 py-1 rounded-full">
          <Megaphone className="w-3.5 h-3.5" />
          <span>Ad Copy Generator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#DADDD5] p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#20251F]">Ad copy generator</h1>
            <p className="text-xs text-[#687067] mt-1">
              Create compelling headline options, primary text drafts, and clear calls to action for simple paid campaigns.
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
                Product or Service <span className="text-[#B33D35]">*</span>
              </label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g., Online Yoga & Wellness Membership"
                className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                What is being promoted <span className="text-[#B33D35]">*</span>
              </label>
              <textarea
                value={promotion}
                onChange={(e) => setPromotion(e.target.value)}
                rows={3}
                placeholder="e.g., Unlimited live classes and guided meditation library for busy professionals."
                className="w-full rounded-md border border-[#DADDD5] p-3 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
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
                  <option value="Facebook & Instagram Ads">Facebook & Instagram Ads</option>
                  <option value="TikTok Ads">TikTok Ads</option>
                  <option value="General Campaign">General Campaign</option>
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
                  <option value="Sales / Conversions">Sales / Conversions</option>
                  <option value="Leads / Signups">Leads / Signups</option>
                  <option value="Website Traffic">Website Traffic</option>
                  <option value="Brand Awareness">Brand Awareness</option>
                  <option value="Messages">Messages</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., Working professionals seeking stress relief"
                className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                  Offer or Price <span className="text-[#687067] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  placeholder="e.g., 14-day free trial"
                  className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                  Desired Action
                </label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] bg-white focus:outline-none focus:border-[#315B4C]"
                >
                  <option value="Visit website">Visit website</option>
                  <option value="Send message">Send message</option>
                  <option value="Sign up">Sign up</option>
                  <option value="Call now">Call now</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#315B4C] hover:bg-[#25483C] text-white rounded-md text-sm font-medium shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating ad copy…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate ad copy</span>
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
                <h2 className="font-serif text-lg font-bold text-[#20251F]">Generated ad copy</h2>
              </div>
              {result && (
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-[#E4EEE8] hover:bg-[#315B4C] hover:text-white text-[#315B4C] rounded text-xs font-medium transition-colors flex items-center space-x-1"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? 'Saved!' : 'Save draft'}</span>
                </button>
              )}
            </div>

            {!result ? (
              <div className="py-20 text-center border-2 border-dashed border-[#DADDD5] rounded-lg space-y-3">
                <Megaphone className="w-10 h-10 text-[#687067]/30 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#20251F]">Your ad copy options will appear here</p>
                  <p className="text-xs text-[#687067]">Fill in your promotion details on the left and click Generate ad copy.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {result.headlines && result.headlines.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-[#687067] uppercase tracking-wider block">Headline options</span>
                    <div className="space-y-2">
                      {result.headlines.map((h: string, i: number) => (
                        <div key={i} className="p-3 bg-[#F7F7F3] rounded-md border border-[#DADDD5] flex items-center justify-between text-sm font-medium text-[#20251F]">
                          <span>{h}</span>
                          <button
                            onClick={() => handleCopy(h, `h-${i}`)}
                            className="text-[#315B4C] hover:underline text-xs flex items-center space-x-1"
                          >
                            {copiedSection === `h-${i}` ? <Check className="w-3 h-3 text-[#367451]" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedSection === `h-${i}` ? 'Copied' : 'copy'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#687067] uppercase tracking-wider">
                    <span>Primary ad text</span>
                    <button
                      onClick={() => handleCopy(result.primaryText, 'primary')}
                      className="text-[#315B4C] hover:underline flex items-center space-x-1 lowercase"
                    >
                      {copiedSection === 'primary' ? <Check className="w-3 h-3 text-[#367451]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSection === 'primary' ? 'Copied' : 'copy'}</span>
                    </button>
                  </div>
                  <textarea
                    value={result.primaryText}
                    onChange={(e) => setResult({ ...result, primaryText: e.target.value })}
                    rows={5}
                    className="w-full rounded-md border border-[#DADDD5] p-3 text-sm text-[#20251F] leading-relaxed focus:outline-none focus:border-[#315B4C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#687067] uppercase tracking-wider">
                    <span>Concise alternative</span>
                    <button
                      onClick={() => handleCopy(result.alternativeText, 'alt')}
                      className="text-[#315B4C] hover:underline flex items-center space-x-1 lowercase"
                    >
                      {copiedSection === 'alt' ? <Check className="w-3 h-3 text-[#367451]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSection === 'alt' ? 'Copied' : 'copy'}</span>
                    </button>
                  </div>
                  <div className="p-3 bg-[#F7F7F3] rounded-md border border-[#DADDD5] text-sm text-[#20251F]">
                    {result.alternativeText}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#E4EEE8]/40 rounded-md border border-[#315B4C]/20">
                    <span className="text-[11px] font-semibold text-[#687067] uppercase tracking-wider block">Call to Action</span>
                    <span className="text-sm font-semibold text-[#315B4C] mt-0.5 block">{result.callToAction}</span>
                  </div>
                  {result.creativeAngle && (
                    <div className="p-3 bg-[#F7F7F3] rounded-md border border-[#DADDD5]">
                      <span className="text-[11px] font-semibold text-[#687067] uppercase tracking-wider block">Creative Angle</span>
                      <span className="text-xs text-[#20251F] mt-0.5 block">{result.creativeAngle}</span>
                    </div>
                  )}
                </div>

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
                        How should we change this ad copy?
                      </label>
                      <input
                        type="text"
                        value={variationInstruction}
                        onChange={(e) => setVariationInstruction(e.target.value)}
                        placeholder="e.g., Make it more urgent or focus on savings."
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
                    <span>Ad copy saved to library successfully.</span>
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
