import React, { useState } from 'react';
import { ViewTab } from '../types';
import { 
  LayoutDashboard, 
  PenTool, 
  Bookmark, 
  Sliders, 
  Building2, 
  Menu, 
  X, 
  MessageSquare, 
  FileText, 
  Send, 
  Megaphone, 
  Calendar 
} from 'lucide-react';

interface NavbarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  businessName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, businessName }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);

  const navItems = [
    { id: 'overview' as ViewTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'library' as ViewTab, label: 'Content library', icon: Bookmark },
    { id: 'brand' as ViewTab, label: 'Brand profile', icon: Building2 },
    { id: 'settings' as ViewTab, label: 'Settings', icon: Sliders },
  ];

  const createTasks = [
    { id: 'captions' as ViewTab, label: 'Social media captions', icon: MessageSquare, desc: 'Instagram, Facebook, TikTok, LinkedIn' },
    { id: 'descriptions' as ViewTab, label: 'Product & service descriptions', icon: FileText, desc: 'Catalogues, marketplaces, websites' },
    { id: 'whatsapp' as ViewTab, label: 'WhatsApp business messages', icon: Send, desc: 'Launches, broadcasts, follow-ups' },
    { id: 'ads' as ViewTab, label: 'Ad copy generator', icon: Megaphone, desc: 'Headlines, primary text, calls to action' },
    { id: 'calendar' as ViewTab, label: 'Weekly content calendar', icon: Calendar, desc: '3, 5, or 7-day structured plans' },
  ];

  const handleSelect = (tab: ViewTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    setCreateDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#DADDD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => handleSelect('overview')}
              className="flex items-center space-x-3 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 bg-[#315B4C] text-white flex items-center justify-center font-serif font-bold text-lg rounded-md tracking-tight shadow-sm group-hover:bg-[#25483C] transition-colors">
                C
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-[#20251F]">Contentmate</span>
                <span className="block text-[11px] text-[#687067] tracking-wider uppercase font-sans font-medium">Marketing Workspace</span>
              </div>
            </button>

            {/* Business Pill indicator */}
            {businessName && (
              <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E4EEE8] text-[#315B4C] text-xs font-medium border border-[#315B4C]/20">
                <Building2 className="w-3.5 h-3.5" />
                <span className="truncate max-w-[160px]">{businessName}</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleSelect('overview')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'overview'
                  ? 'bg-[#E4EEE8] text-[#315B4C]'
                  : 'text-[#687067] hover:text-[#20251F] hover:bg-[#EFEFE9]/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            {/* Create Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
                onBlur={() => setTimeout(() => setCreateDropdownOpen(false), 200)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  ['create', 'captions', 'descriptions', 'whatsapp', 'ads', 'calendar'].includes(currentTab)
                    ? 'bg-[#E4EEE8] text-[#315B4C]'
                    : 'text-[#687067] hover:text-[#20251F] hover:bg-[#EFEFE9]/60'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>Create content</span>
              </button>

              {createDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-[#DADDD5] py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-[#687067] uppercase tracking-wider border-b border-[#DADDD5]/60">
                    Core Workflows
                  </div>
                  {createTasks.map((task) => {
                    const Icon = task.icon;
                    return (
                      <button
                        key={task.id}
                        onClick={() => handleSelect(task.id)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-[#EFEFE9] flex items-start space-x-3 transition-colors"
                      >
                        <div className="p-1 rounded bg-[#E4EEE8] text-[#315B4C] mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#20251F]">{task.label}</div>
                          <div className="text-xs text-[#687067]">{task.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {navItems.slice(1).map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E4EEE8] text-[#315B4C]'
                      : 'text-[#687067] hover:text-[#20251F] hover:bg-[#EFEFE9]/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Create CTA button */}
          <div className="hidden md:block">
            <button
              onClick={() => handleSelect('captions')}
              className="px-4 py-2 bg-[#315B4C] hover:bg-[#25483C] text-white rounded-md text-sm font-medium shadow-sm transition-colors flex items-center space-x-2"
            >
              <PenTool className="w-4 h-4" />
              <span>Create draft</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#687067] hover:text-[#20251F] hover:bg-[#EFEFE9] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#DADDD5] px-4 pt-2 pb-6 space-y-2">
          {businessName && (
            <div className="py-2 px-3 rounded-md bg-[#E4EEE8] text-[#315B4C] text-xs font-medium flex items-center space-x-2 mb-3">
              <Building2 className="w-4 h-4" />
              <span className="truncate">{businessName}</span>
            </div>
          )}

          <button
            onClick={() => handleSelect('overview')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium ${
              currentTab === 'overview' ? 'bg-[#E4EEE8] text-[#315B4C]' : 'text-[#687067]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <div className="pt-2 pb-1 text-[11px] font-semibold text-[#687067] uppercase tracking-wider">
            Create Content
          </div>
          {createTasks.map((task) => {
            const Icon = task.icon;
            const isActive = currentTab === task.id;
            return (
              <button
                key={task.id}
                onClick={() => handleSelect(task.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium pl-6 ${
                  isActive ? 'bg-[#E4EEE8] text-[#315B4C]' : 'text-[#687067]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{task.label}</span>
              </button>
            );
          })}

          <div className="pt-2 pb-1 text-[11px] font-semibold text-[#687067] uppercase tracking-wider">
            Workspace
          </div>
          {navItems.slice(1).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive ? 'bg-[#E4EEE8] text-[#315B4C]' : 'text-[#687067]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
