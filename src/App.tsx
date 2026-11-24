import { useState, useEffect } from 'react';
import { ViewTab, BusinessProfile, SavedContent } from './types';
import { getStoredProfile, getStoredLibrary } from './lib/storage';
import { Navbar } from './components/Navbar';
import { Overview } from './views/Overview';
import { CreateHub } from './views/CreateHub';
import { CaptionView } from './views/CaptionView';
import { DescriptionView } from './views/DescriptionView';
import { WhatsAppView } from './views/WhatsAppView';
import { AdCopyView } from './views/AdCopyView';
import { CalendarView } from './views/CalendarView';
import { LibraryView } from './views/LibraryView';
import { BrandView } from './views/BrandView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('overview');
  const [profile, setProfile] = useState<BusinessProfile>(getStoredProfile());
  const [library, setLibrary] = useState<SavedContent[]>(getStoredLibrary());

  // Refresh profile & library when tab changes or items saved
  useEffect(() => {
    setProfile(getStoredProfile());
    setLibrary(getStoredLibrary());
  }, [currentTab]);

  const handleSavedItem = (_item: SavedContent) => {
    setLibrary(getStoredLibrary());
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3] text-[#20251F] font-sans antialiased selection:bg-[#315B4C] selection:text-white">
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        businessName={profile.businessName}
      />

      <main className="pb-16">
        {currentTab === 'overview' && (
          <Overview
            onSelectTab={setCurrentTab}
            profile={profile}
            library={library}
          />
        )}

        {currentTab === 'create' && (
          <CreateHub onSelectTab={setCurrentTab} />
        )}

        {currentTab === 'captions' && (
          <CaptionView
            profile={profile}
            onBack={() => setCurrentTab('create')}
            onSaved={handleSavedItem}
          />
        )}

        {currentTab === 'descriptions' && (
          <DescriptionView
            profile={profile}
            onBack={() => setCurrentTab('create')}
            onSaved={handleSavedItem}
          />
        )}

        {currentTab === 'whatsapp' && (
          <WhatsAppView
            profile={profile}
            onBack={() => setCurrentTab('create')}
            onSaved={handleSavedItem}
          />
        )}

        {currentTab === 'ads' && (
          <AdCopyView
            profile={profile}
            onBack={() => setCurrentTab('create')}
            onSaved={handleSavedItem}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarView
            profile={profile}
            onBack={() => setCurrentTab('create')}
            onSaved={handleSavedItem}
          />
        )}

        {currentTab === 'library' && (
          <LibraryView onOpenCreate={(task) => {
            const map: Record<string, ViewTab> = {
              caption: 'captions',
              description: 'descriptions',
              whatsapp: 'whatsapp',
              'ad-copy': 'ads',
              calendar: 'calendar'
            };
            setCurrentTab(map[task] || 'captions');
          }} />
        )}

        {currentTab === 'brand' && (
          <BrandView />
        )}

        {currentTab === 'settings' && (
          <SettingsView />
        )}
      </main>
    </div>
  );
}
