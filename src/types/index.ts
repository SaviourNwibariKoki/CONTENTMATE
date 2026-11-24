export type ContentTaskType = 'caption' | 'description' | 'whatsapp' | 'ad-copy' | 'calendar';

export interface BusinessProfile {
  id: string;
  businessName: string;
  category: string;
  description: string;
  productsOrServices: string;
  targetAudience: string;
  location: string;
  preferredTone: string;
  brandWords: string;
  avoidWords: string;
  updatedAt: string;
}

export interface SavedContent {
  id: string;
  title: string;
  task: ContentTaskType;
  platform?: string;
  content: any;
  input: any;
  createdAt: string;
  updatedAt: string;
}

export type ViewTab = 'overview' | 'create' | 'captions' | 'descriptions' | 'whatsapp' | 'ads' | 'calendar' | 'library' | 'brand' | 'settings';
