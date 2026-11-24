import React from 'react';
import { ViewTab } from '../types';
import { 
  MessageSquare, 
  FileText, 
  Send, 
  Megaphone, 
  Calendar, 
  ArrowRight,
  PenTool
} from 'lucide-react';

interface CreateHubProps {
  onSelectTab: (tab: ViewTab) => void;
}

export const CreateHub: React.FC<CreateHubProps> = ({ onSelectTab }) => {
  const tasks = [
    {
      id: 'captions' as ViewTab,
      title: 'Social media captions',
      subtitle: 'Instagram, Facebook, TikTok, and LinkedIn',
      description: 'Platform-aware captions tailored to your audience, objective, tone, and length, with separate editable hashtags.',
      icon: MessageSquare,
    },
    {
      id: 'descriptions' as ViewTab,
      title: 'Product & service descriptions',
      subtitle: 'Catalogues, marketplaces, and website listings',
      description: 'Clear, compelling descriptions highlighting key features and benefits without inventing unverified specifications.',
      icon: FileText,
    },
    {
      id: 'whatsapp' as ViewTab,
      title: 'WhatsApp business messages',
      subtitle: 'Broadcasts and one-to-one messages',
      description: 'Natural, conversational messages for launches, restocks, promotions, order updates, and customer appreciation.',
      icon: Send,
    },
    {
      id: 'ads' as ViewTab,
      title: 'Ad copy generator',
      subtitle: 'Paid campaigns and simple promotions',
      description: 'Compelling headline options, primary text drafts, concise alternatives, and clear calls to action.',
      icon: Megaphone,
    },
    {
      id: 'calendar' as ViewTab,
      title: 'Weekly content calendar',
      subtitle: 'Consistent 3, 5, or 7-day posting plans',
      description: 'Structured weekly plans complete with content pillars, formats, topics, draft captions, and calls to action.',
      icon: Calendar,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#315B4C] bg-[#E4EEE8] px-2.5 py-1 rounded-full">
          <PenTool className="w-3.5 h-3.5" />
          <span>Content Creation Hub</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#20251F] tracking-tight">Select a content task</h1>
        <p className="text-sm text-[#687067] max-w-2xl leading-relaxed">
          Choose what you want to write. Each workflow asks only for the details relevant to your task and uses your business profile defaults.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <div
              key={task.id}
              onClick={() => onSelectTab(task.id)}
              className="bg-white rounded-xl border border-[#DADDD5] p-6 hover:border-[#315B4C] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#E4EEE8] text-[#315B4C] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#20251F] group-hover:text-[#315B4C] transition-colors">
                    {task.title}
                  </h3>
                  <span className="text-xs font-medium text-[#315B4C] block mt-1">{task.subtitle}</span>
                  <p className="text-xs text-[#687067] mt-2.5 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DADDD5]/60 flex items-center justify-between text-xs font-semibold text-[#315B4C]">
                <span>Start task</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
