import React, { useState } from 'react';
import { BusinessProfile, SavedContent } from '../types';
import { saveToLibrary } from '../lib/storage';
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  RefreshCw, 
  AlertCircle,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

interface WhatsAppViewProps {
  profile: BusinessProfile;
  onBack: () => void;
  onSaved: (item: SavedContent) => void;
}

export const WhatsAppView: React.FC<WhatsAppViewProps> = ({ profile, onBack, onSaved }) => {
  const [purpose, setPurpose] = useState('New product or service launch');
  const [details, setDetails] = useState('');
  const [audience, setAudience] = useState('Existing customers and contacts');
  const [format, setFormat] = useState('Broadcast message');
  const [tone, setTone] = useState(profile.preferredTone || 'Warm and respectful');
  const [callToAction, setCallToAction] = useState('');
  const [offer, setOffer] = useState('');

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [variationInstruction, setVariationInstruction] = useState('');
  const [showVariationBox, setShowVariationBox] = useState(false);

  const handleGenerate = async (e?: React.FormEvent, isVariation = false) => {
    if (e) e.preventDefault();
    if (!details.trim()) {
      setError('Please provide message details.');
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
          task: 'whatsapp',
          businessProfile: profile,
          input: {
            purpose,
            details,
            audience,
            format,
            tone,
            callToAction,
            offer,
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
    const title = purpose.length > 40 ? purpose.substring(0, 40) + '...' : purpose;
    const saved = saveToLibrary({
      title,
      task: 'whatsapp',
      platform: 'WhatsApp',
      content: result,
      input: { purpose, details, audience, format, tone, callToAction, offer },
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
          <Send className="w-3.5 h-3.5" />
          <span>WhatsApp Business Message</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#DADDD5] p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#20251F]">WhatsApp message generator</h1>
            <p className="text-xs text-[#687067] mt-1">
              Create natural, conversational WhatsApp messages for launches, broadcasts, and customer updates without spammy pressure.
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
                Message Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] bg-white focus:outline-none focus:border-[#315B4C]"
              >
                <option value="New product or service launch">New product or service launch</option>
                <option value="Special promotion or discount">Special promotion or discount</option>
                <option value="Restock announcement">Restock announcement</option>
                <option value="Order update or delivery notice">Order update or delivery notice</option>
                <option value="Customer follow-up or check-in">Customer follow-up or check-in</option>
                <option value="Event or business announcement">Event or business announcement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                Message Details <span className="text-[#B33D35]">*</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="e.g., We just received a fresh restock of our bestselling organic body butter in lavender scent."
                className="w-full rounded-md border border-[#DADDD5] p-3 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] bg-white focus:outline-none focus:border-[#315B4C]"
                >
                  <option value="Broadcast message">Broadcast message</option>
                  <option value="One-to-one message">One-to-one message</option>
                </select>
              </div>

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
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., Existing VIP customers"
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
                placeholder="e.g., Reply 'RESTOCK' to secure yours."
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
                  <span>Creating message…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate WhatsApp message</span>
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
                <h2 className="font-serif text-lg font-bold text-[#20251F]">Generated message</h2>
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
                <Send className="w-10 h-10 text-[#687067]/30 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#20251F]">Your WhatsApp message will appear here</p>
                  <p className="text-xs text-[#687067]">Provide your message details on the left and click Generate message.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#687067] uppercase tracking-wider">
                    <span>Ready-to-send message</span>
                    <button
                      onClick={() => handleCopy(result.message, 'msg')}
                      className="text-[#315B4C] hover:underline flex items-center space-x-1 lowercase"
                    >
                      {copiedSection === 'msg' ? <Check className="w-3 h-3 text-[#367451]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSection === 'msg' ? 'Copied' : 'copy'}</span>
                    </button>
                  </div>
                  <textarea
                    value={result.message}
                    onChange={(e) => setResult({ ...result, message: e.target.value })}
                    rows={6}
                    className="w-full rounded-md border border-[#DADDD5] p-3 text-sm text-[#20251F] leading-relaxed focus:outline-none focus:border-[#315B4C]"
                  />
                </div>

                {result.shorterVersion && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#687067] uppercase tracking-wider">
                      <span>Shorter alternative</span>
                      <button
                        onClick={() => handleCopy(result.shorterVersion, 'short')}
                        className="text-[#315B4C] hover:underline flex items-center space-x-1 lowercase"
                      >
                        {copiedSection === 'short' ? <Check className="w-3 h-3 text-[#367451]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSection === 'short' ? 'Copied' : 'copy'}</span>
                      </button>
                    </div>
                    <div className="p-3 bg-[#F7F7F3] rounded-md border border-[#DADDD5] text-sm text-[#20251F]">
                      {result.shorterVersion}
                    </div>
                  </div>
                )}

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
                        How should we change this message?
                      </label>
                      <input
                        type="text"
                        value={variationInstruction}
                        onChange={(e) => setVariationInstruction(e.target.value)}
                        placeholder="e.g., Make it warmer or shorter."
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
                    <span>WhatsApp message saved to library successfully.</span>
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
