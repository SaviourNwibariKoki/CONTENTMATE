import React from 'react';
import { ViewTab, BusinessProfile, SavedContent } from '../types';
import { 
  PenTool, 
  MessageSquare, 
  FileText, 
  Send, 
  Megaphone, 
  Calendar, 
  Building2, 
  Bookmark, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Clock
} from 'lucide-react';

interface OverviewProps {
  onSelectTab: (tab: ViewTab) => void;
  profile: BusinessProfile;
  library: SavedContent[];
  onOpenItem?: (item: SavedContent) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onSelectTab, profile, library }) => {
  const isProfileEmpty = !profile.businessName.trim();

  const quickTasks = [
    {
      id: 'captions' as ViewTab,
      title: 'Social media caption',
      description: 'Platform-aware captions for Instagram, Facebook, TikTok & LinkedIn with hashtags.',
      icon: MessageSquare,
      color: 'bg-[#E4EEE8] text-[#315B4C]',
    },
    {
      id: 'descriptions' as ViewTab,
      title: 'Product or service description',
      description: 'Clear, compelling descriptions for catalogues, online stores, and service pages.',
      icon: FileText,
      color: 'bg-[#EFEFE9] text-[#20251F]',
    },
    {
      id: 'whatsapp' as ViewTab,
      title: 'WhatsApp business message',
      description: 'Natural messages for product launches, restocks, promotions, and updates.',
      icon: Send,
      color: 'bg-[#E4EEE8] text-[#315B4C]',
    },
    {
      id: 'ads' as ViewTab,
      title: 'Ad copy generator',
      description: 'Engaging headlines, primary text, and call-to-action options for simple campaigns.',
      icon: Megaphone,
      color: 'bg-[#EFEFE9] text-[#20251F]',
    },
    {
      id: 'calendar' as ViewTab,
      title: 'Weekly content calendar',
      description: 'Structured 3, 5, or 7-day plans with post formats, topics, and drafts.',
      icon: Calendar,
      color: 'bg-[#E4EEE8] text-[#315B4C]',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-[#DADDD5] p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#315B4C] bg-[#E4EEE8] px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Editorial Marketing Workspace</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#20251F] tracking-tight">
            {profile.businessName ? `Welcome back, ${profile.businessName}` : 'Create clear marketing drafts without the blank page.'}
          </h1>
          <p className="text-sm text-[#687067] max-w-2xl leading-relaxed">
            Contentmate turns your business details into practical captions, product listings, WhatsApp broadcasts, ad copy, and weekly plans.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => onSelectTab('captions')}
            className="flex-1 md:flex-initial px-5 py-2.5 bg-[#315B4C] hover:bg-[#25483C] text-white rounded-md text-sm font-medium shadow-sm transition-colors flex items-center justify-center space-x-2"
          >
            <PenTool className="w-4 h-4" />
            <span>Create content</span>
          </button>
        </div>
      </div>

      {/* Profile Notice if empty */}
      {isProfileEmpty && (
        <div className="bg-[#E4EEE8]/60 border border-[#315B4C]/20 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-2.5 bg-[#315B4C] text-white rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#20251F]">Set up your business profile</h2>
              <p className="text-xs text-[#687067] mt-0.5">
                Add your business name, audience, and preferred tone once so every generated draft reflects your brand.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('brand')}
            className="px-4 py-2 bg-white hover:bg-[#F7F7F3] text-[#315B4C] border border-[#315B4C]/30 rounded-md text-xs font-medium transition-colors whitespace-nowrap shadow-sm"
          >
            Configure brand profile
          </button>
        </div>
      )}

      {/* Core Task Shortcuts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#20251F]">Choose a content task</h2>
          <button 
            onClick={() => onSelectTab('create')}
            className="text-xs font-medium text-[#315B4C] hover:underline flex items-center space-x-1"
          >
            <span>View all workflows</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickTasks.map((task) => {
            const Icon = task.icon;
            return (
              <div
                key={task.id}
                onClick={() => onSelectTab(task.id)}
                className="bg-white rounded-xl border border-[#DADDD5] p-6 hover:border-[#315B4C] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${task.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#20251F] group-hover:text-[#315B4C] transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-xs text-[#687067] mt-1.5 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#DADDD5]/60 flex items-center justify-between text-xs font-medium text-[#315B4C]">
                  <span>Start drafting</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Saved Drafts & Profile Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Library Items */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#DADDD5] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-[#315B4C]" />
              <h2 className="font-serif text-lg font-bold text-[#20251F]">Recent saved drafts</h2>
            </div>
            <button
              onClick={() => onSelectTab('library')}
              className="text-xs font-medium text-[#315B4C] hover:underline flex items-center space-x-1"
            >
              <span>View library ({library.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {library.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-[#DADDD5] rounded-lg">
              <Bookmark className="w-8 h-8 text-[#687067]/40 mx-auto mb-2" />
              <p className="text-sm font-medium text-[#20251F]">No saved drafts yet</p>
              <p className="text-xs text-[#687067] mt-1">Generated content you save will appear here for easy access.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#DADDD5]/60">
              {library.slice(0, 3).map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="space-y-0.5 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#EFEFE9] text-[#687067]">
                        {item.task}
                      </span>
                      {item.platform && (
                        <span className="text-[11px] text-[#687067]">({item.platform})</span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-[#20251F] truncate max-w-md">{item.title}</h4>
                    <span className="text-[11px] text-[#687067] flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectTab('library')}
                    className="px-3 py-1.5 bg-[#E4EEE8] hover:bg-[#315B4C] hover:text-white text-[#315B4C] text-xs font-medium rounded transition-colors whitespace-nowrap"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Business Profile Summary */}
        <div className="bg-white rounded-xl border border-[#DADDD5] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#315B4C]" />
                <h2 className="font-serif text-lg font-bold text-[#20251F]">Brand profile</h2>
              </div>
              <button
                onClick={() => onSelectTab('brand')}
                className="text-xs font-medium text-[#315B4C] hover:underline"
              >
                Edit profile
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#687067] block">Business Name</span>
                <span className="font-medium text-[#20251F] text-sm">{profile.businessName || 'Not set'}</span>
              </div>
              <div>
                <span className="text-[#687067] block">Category / Industry</span>
                <span className="font-medium text-[#20251F]">{profile.category || 'Not set'}</span>
              </div>
              <div>
                <span className="text-[#687067] block">Target Audience</span>
                <span className="font-medium text-[#20251F]">{profile.targetAudience || 'Not set'}</span>
              </div>
              <div>
                <span className="text-[#687067] block">Preferred Tone</span>
                <span className="font-medium text-[#20251F]">{profile.preferredTone}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DADDD5]/60 flex items-center space-x-2 text-[11px] text-[#687067]">
            <CheckCircle2 className="w-4 h-4 text-[#315B4C]" />
            <span>Profile context automatically guides generated drafts.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
