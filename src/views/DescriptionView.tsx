import React, { useState } from 'react';
import { BusinessProfile, SavedContent } from '../types';
import { saveToLibrary } from '../lib/storage';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  RefreshCw, 
  AlertCircle,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

interface DescriptionViewProps {
  profile: BusinessProfile;
  onBack: () => void;
  onSaved: (item: SavedContent) => void;
}

export const DescriptionView: React.FC<DescriptionViewProps> = ({ profile, onBack, onSaved }) => {
  const [name, setName] = useState('');
  const [whatItIs, setWhatItIs] = useState('');
  const [features, setFeatures] = useState('');
  const [audience, setAudience] = useState(profile.targetAudience);
  const [useCase, setUseCase] = useState('Online store / E-commerce');
  const [length, setLength] = useState('Medium');
  const [tone, setTone] = useState(profile.preferredTone || 'Clear and professional');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState('');

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [variationInstruction, setVariationInstruction] = useState('');
  const [showVariationBox, setShowVariationBox] = useState(false);

  const handleGenerate = async (e?: React.FormEvent, isVariation = false) => {
    if (e) e.preventDefault();
    if (!name.trim() || !whatItIs.trim()) {
      setError('Please provide the product/service name and details.');
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
          task: 'description',
          businessProfile: profile,
          input: {
            name,
            whatItIs,
            features,
            audience,
            useCase,
            length,
            tone,
            price,
            availability,
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
    const saved = saveToLibrary({
      title: name,
      task: 'description',
      platform: useCase,
      content: result,
      input: { name, whatItIs, features, audience, useCase, length, tone, price, availability },
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
          <FileText className="w-3.5 h-3.5" />
          <span>Product & Service Description</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#DADDD5] p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#20251F]">Description generator</h1>
            <p className="text-xs text-[#687067] mt-1">
              Turn basic specifications into clear, professional listings for catalogues, marketplaces, and websites.
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
                Product or Service Name <span className="text-[#B33D35]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Handcrafted Leather Tote Bag"
                className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                What it is / Service provided <span className="text-[#B33D35]">*</span>
              </label>
              <textarea
                value={whatItIs}
                onChange={(e) => setWhatItIs(e.target.value)}
                rows={3}
                placeholder="e.g., Premium full-grain leather everyday tote with reinforced straps and laptop compartment."
                className="w-full rounded-md border border-[#DADDD5] p-3 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                Key Features or Details
              </label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                rows={2}
                placeholder="e.g., 100% vegetable tanned leather, interior zip pocket, fits 15-inch laptop."
                className="w-full rounded-md border border-[#DADDD5] p-3 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                  Use Case
                </label>
                <select
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] bg-white focus:outline-none focus:border-[#315B4C]"
                >
                  <option value="Online store / E-commerce">Online store / E-commerce</option>
                  <option value="Marketplace listing">Marketplace listing</option>
                  <option value="Social media catalogue">Social media catalogue</option>
                  <option value="Website service page">Website service page</option>
                  <option value="General catalogue">General catalogue</option>
                </select>
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
                  <option value="Detailed">Detailed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                  Price <span className="text-[#687067] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., $145"
                  className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
                />
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#315B4C] hover:bg-[#25483C] text-white rounded-md text-sm font-medium shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating description…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate description</span>
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
                <h2 className="font-serif text-lg font-bold text-[#20251F]">Generated description</h2>
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
                <FileText className="w-10 h-10 text-[#687067]/30 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#20251F]">Your description will appear here</p>
                  <p className="text-xs text-[#687067]">Fill in your product details on the left and click Generate description.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#687067] uppercase tracking-wider">
                    <span>Main description</span>
                    <button
                      onClick={() => handleCopy(result.mainDescription, 'main')}
                      className="text-[#315B4C] hover:underline flex items-center space-x-1 lowercase"
                    >
                      {copiedSection === 'main' ? <Check className="w-3 h-3 text-[#367451]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSection === 'main' ? 'Copied' : 'copy'}</span>
                    </button>
                  </div>
                  <textarea
                    value={result.mainDescription}
                    onChange={(e) => setResult({ ...result, mainDescription: e.target.value })}
                    rows={6}
                    className="w-full rounded-md border border-[#DADDD5] p-3 text-sm text-[#20251F] leading-relaxed focus:outline-none focus:border-[#315B4C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#687067] uppercase tracking-wider">
                    <span>Short summary</span>
                    <button
                      onClick={() => handleCopy(result.shortDescription, 'short')}
                      className="text-[#315B4C] hover:underline flex items-center space-x-1 lowercase"
                    >
                      {copiedSection === 'short' ? <Check className="w-3 h-3 text-[#367451]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSection === 'short' ? 'Copied' : 'copy'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={result.shortDescription}
                    onChange={(e) => setResult({ ...result, shortDescription: e.target.value })}
                    className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
                  />
                </div>

                {result.features && result.features.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-[#687067] uppercase tracking-wider block">Key Features</span>
                    <ul className="list-disc list-inside space-y-1 p-3 bg-[#F7F7F3] rounded-md border border-[#DADDD5] text-sm text-[#20251F]">
                      {result.features.map((feat: string, i: number) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
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
                        How should we change this description?
                      </label>
                      <input
                        type="text"
                        value={variationInstruction}
                        onChange={(e) => setVariationInstruction(e.target.value)}
                        placeholder="e.g., Make it more concise or highlight durability."
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
                    <span>Description saved to your library successfully.</span>
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
