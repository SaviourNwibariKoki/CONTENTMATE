import React, { useState } from 'react';
import { BusinessProfile, SavedContent } from '../types';
import { saveToLibrary } from '../lib/storage';
import { 
  Calendar, 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  RefreshCw, 
  AlertCircle,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

interface CalendarViewProps {
  profile: BusinessProfile;
  onBack: () => void;
  onSaved: (item: SavedContent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ profile, onBack, onSaved }) => {
  const [platform, setPlatform] = useState('Instagram');
  const [goal, setGoal] = useState('Build community engagement and showcase products');
  const [frequency, setFrequency] = useState(5);
  const [audience, setAudience] = useState(profile.targetAudience);
  const [tone, setTone] = useState(profile.preferredTone || 'Friendly and professional');
  const [events, setEvents] = useState('');

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goal.trim()) {
      setError('Please provide a main goal for the week.');
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
          task: 'calendar',
          businessProfile: profile,
          input: {
            platform,
            goal,
            frequency,
            audience,
            tone,
            events,
          },
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message || 'Generation failed.');
      }

      setResult(json.data);
    } catch (err: any) {
      setError(err.message || 'We couldn’t reach the content service. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (!result || !result.days) return;
    const text = result.days.map((d: any) => `[${d.dayLabel}] Pillar: ${d.contentPillar} | Format: ${d.format}\nTopic: ${d.topic}\nDraft: ${d.draft}\n`).join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopiedSection('all');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSave = () => {
    if (!result) return;
    const title = result.title || `Weekly Plan (${platform})`;
    const saved = saveToLibrary({
      title,
      task: 'calendar',
      platform,
      content: result,
      input: { platform, goal, frequency, audience, tone, events },
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
          <Calendar className="w-3.5 h-3.5" />
          <span>Weekly Content Calendar</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#DADDD5] p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#20251F]">Content calendar plan</h1>
            <p className="text-xs text-[#687067] mt-1">
              Create a realistic 3, 5, or 7-day posting plan to maintain consistent online presence.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-[#B33D35]/10 border border-[#B33D35]/20 text-[#B33D35] text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                Main Goal for the Week <span className="text-[#B33D35]">*</span>
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={3}
                placeholder="e.g., Showcase new spring collection and drive website traffic."
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
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="TikTok">TikTok</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                  Posting Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] bg-white focus:outline-none focus:border-[#315B4C]"
                >
                  <option value={3}>3 days per week</option>
                  <option value={5}>5 days per week</option>
                  <option value={7}>7 days per week</option>
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
                className="w-full rounded-md border border-[#DADDD5] p-2.5 text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-1.5">
                Important Dates, Launches, or Events <span className="text-[#687067] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={events}
                onChange={(e) => setEvents(e.target.value)}
                placeholder="e.g., Flash sale on Friday"
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
                  <span>Building weekly plan…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate weekly plan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-[#DADDD5] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DADDD5]/60 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#315B4C]"></div>
                  <h2 className="font-serif text-lg font-bold text-[#20251F]">
                    {result ? result.title : 'Weekly Content Plan'}
                  </h2>
                </div>
                <span className="text-xs text-[#687067] mt-0.5 block">{platform} • {frequency} Days</span>
              </div>
              {result && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyAll}
                    className="px-3 py-1.5 bg-[#EFEFE9] hover:bg-[#DADDD5] text-[#20251F] rounded text-xs font-medium transition-colors flex items-center space-x-1"
                  >
                    {copiedSection === 'all' ? <Check className="w-3.5 h-3.5 text-[#367451]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'all' ? 'Copied' : 'Copy all'}</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 bg-[#315B4C] hover:bg-[#25483C] text-white rounded text-xs font-medium transition-colors flex items-center space-x-1"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{savedSuccess ? 'Saved!' : 'Save plan'}</span>
                  </button>
                </div>
              )}
            </div>

            {!result ? (
              <div className="py-20 text-center border-2 border-dashed border-[#DADDD5] rounded-lg space-y-3">
                <Calendar className="w-10 h-10 text-[#687067]/30 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#20251F]">Your weekly content calendar will appear here</p>
                  <p className="text-xs text-[#687067]">Set your weekly goal on the left and click Generate weekly plan.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {result.days && result.days.map((day: any, i: number) => (
                  <div key={i} className="p-4 bg-[#F7F7F3] rounded-lg border border-[#DADDD5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#315B4C] text-white">
                          {day.dayLabel}
                        </span>
                        <span className="text-xs font-semibold text-[#20251F]">{day.contentPillar}</span>
                      </div>
                      <span className="text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-[#DADDD5] text-[#687067]">
                        {day.format}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-[#687067] uppercase tracking-wider block">Topic / Angle</span>
                      <p className="text-sm font-medium text-[#20251F]">{day.topic}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#687067] uppercase tracking-wider">
                        <span>Draft Content / Outline</span>
                        <button
                          onClick={() => handleCopy(day.draft, `day-${i}`)}
                          className="text-[#315B4C] hover:underline lowercase"
                        >
                          {copiedSection === `day-${i}` ? 'Copied' : 'copy'}
                        </button>
                      </div>
                      <textarea
                        value={day.draft}
                        onChange={(e) => {
                          const newDays = [...result.days];
                          newDays[i].draft = e.target.value;
                          setResult({ ...result, days: newDays });
                        }}
                        rows={3}
                        className="w-full rounded-md border border-[#DADDD5] p-2.5 text-xs text-[#20251F] bg-white focus:outline-none focus:border-[#315B4C]"
                      />
                    </div>

                    {day.callToAction && (
                      <div className="text-xs text-[#687067]">
                        <span className="font-semibold text-[#20251F]">CTA:</span> {day.callToAction}
                      </div>
                    )}
                  </div>
                ))}

                {savedSuccess && (
                  <div className="p-3 rounded-lg bg-[#367451]/10 border border-[#367451]/20 text-[#367451] text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Weekly calendar saved to library successfully.</span>
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
