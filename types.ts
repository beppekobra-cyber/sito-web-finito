
export type Language = 'it' | 'en' | 'de';
export type Theme = 'light' | 'dark';

// Interface representing a memory item in the gallery
export interface Memory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  year: string;
}

// Interface for AI reflection messages used in the ReflectionAI component
export interface ReflectionMessage {
  role: 'user' | 'ai';
  content: string;
  sources?: { uri: string; title: string }[];
}

export interface TranslationSet {
  nav: { works: string; cards: string; info: string; ai: string; };
  hero: { title: string; subtitle: string; tagline: string; desc: string; btn: string; };
  works: { title: string; steps: { title: string; desc: string; }[]; };
  cards: { title: string; items: { id: string; title: string; desc: string; btn: string; }[]; };
  ai: { 
    title: string; 
    subtitle: string; 
    placeholder: string; 
    generate: string; 
    result: string; 
    loading: string; 
    listen: string; 
    copy: string; 
    copied: string;
    generateImg: string; 
    creatingImg: string; 
    commission: string;
    recurringTitle: string;
    recurringDesc: string;
    recurringBtn: string;
    waiting: string;
    consentTitle: string;
    consentDesc: string;
    consentBtn: string;
  };
  footer: { copy: string; tag: string; label: string; };
  mail: {
    subjects: Record<string, string>;
    recurringPrefix: string;
    intro: string;
    recurringMsg: string;
    draftLabel: string;
    footer: string;
  };
}
