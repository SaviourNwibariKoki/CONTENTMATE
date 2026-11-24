import { BusinessProfile, SavedContent } from '../types';

const PROFILE_KEY = 'contentmate_business_profile_v1';
const LIBRARY_KEY = 'contentmate_library_v1';

const DEFAULT_PROFILE: BusinessProfile = {
  id: 'default',
  businessName: '',
  category: 'Retail & E-commerce',
  description: '',
  productsOrServices: '',
  targetAudience: 'Everyday consumers and online shoppers',
  location: '',
  preferredTone: 'Friendly and professional',
  brandWords: '',
  avoidWords: '',
  updatedAt: new Date().toISOString(),
};

export function getStoredProfile(): BusinessProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load business profile', err);
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: BusinessProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profile, updatedAt: new Date().toISOString() }));
  } catch (err) {
    console.error('Failed to save business profile', err);
  }
}

export function getStoredLibrary(): SavedContent[] {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load content library', err);
    return [];
  }
}

export function saveToLibrary(item: Omit<SavedContent, 'id' | 'createdAt' | 'updatedAt'>): SavedContent {
  const library = getStoredLibrary();
  const newItem: SavedContent = {
    ...item,
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  library.unshift(newItem);
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  } catch (err) {
    console.error('Failed to save to library', err);
  }
  return newItem;
}

export function updateInLibrary(id: string, updates: Partial<SavedContent>): void {
  const library = getStoredLibrary();
  const index = library.findIndex((i) => i.id === id);
  if (index !== -1) {
    library[index] = {
      ...library[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
    } catch (err) {
      console.error('Failed to update library item', err);
    }
  }
}

export function deleteFromLibrary(id: string): void {
  const library = getStoredLibrary().filter((i) => i.id !== id);
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  } catch (err) {
    console.error('Failed to delete library item', err);
  }
}

export function clearAllData(): void {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(LIBRARY_KEY);
}
