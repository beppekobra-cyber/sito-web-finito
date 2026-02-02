
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Language, Theme, TranslationSet } from './types';
import { decode, decodeAudioData } from './utils/audio';

// --- Custom Cursor Component ---
const CustomCursor: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('button') !== null ||
        target.closest('a') !== null
      );
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out hidden md:block"
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        <div className={`-translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full transition-colors duration-500 ${theme === 'dark' ? 'bg-gold shadow-[0_0_15px_rgba(212,175,55,1)]' : 'bg-[#1C1917]'}`} />
      </div>
      <div 
        className={`fixed top-0 left-0 pointer-events-none z-[9998] transition-all duration-500 ease-out border rounded-full hidden md:block ${theme === 'dark' ? 'border-gold/40' : 'border-[#1C1917]/60'}`}
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isPointer ? 2.8 : 1.3})`,
          width: '40px',
          height: '40px',
          marginTop: '-20px',
          marginLeft: '-20px',
          opacity: isHidden ? 0 : 0.8,
          backgroundColor: isPointer ? (theme === 'dark' ? 'rgba(212,175,55,0.12)' : 'rgba(28,25,23,0.08)') : 'transparent',
          backdropFilter: isPointer ? 'blur(3px)' : 'none'
        }}
      />
    </>
  );
};

const translations: Record<Language, TranslationSet> = {
  it: {
    nav: { works: 'Metodo', cards: 'Collezioni', info: 'Contatti', ai: 'Atelier AI' },
    hero: {
      title: 'L\'Eleganza del Ricordo',
      subtitle: 'Tributi Digitali d\'Elite',
      tagline: 'L\'eccellenza del ricordo, scolpita nel futuro.',
      desc: 'Ogni istante merita una cornice d\'eccezione.',
      btn: 'Esplora Collezioni'
    },
    works: {
      title: 'L\'Arte della Creazione',
      steps: [
        { title: 'Visione', desc: 'Condividi l\'essenza del tuo messaggio e la tua visione emozionale.' },
        { title: 'Design', desc: 'Diamo vita a un concept visivo e testuale unico per te.' },
        { title: 'Perfezione', desc: 'Raffiniamo ogni dettaglio e sfumatura insieme.' },
        { title: 'Eredità', desc: 'Il tuo tributo digitale è pronto per durare per l\'eternità.' }
      ]
    },
    cards: {
      title: 'Le Collezioni',
      items: [
        { id: 'bday', title: 'Celebrazioni', desc: 'Per compleanni che lasciano il segno.', btn: 'Personalizza' },
        { id: 'anniv', title: 'Unioni', desc: 'L\'eterno fascino dell\'amore condiviso.', btn: 'Personalizza' },
        { id: 'holiday', title: 'Ricorrenze', desc: 'Il calore delle tradizioni più care.', btn: 'Personalizza' },
        { id: 'memorial', title: 'In Memoriam', desc: 'Un omaggio solenne per onorare una vita.', btn: 'Personalizza' }
      ]
    },
    ai: {
      title: 'Atelier Creativo AI',
      subtitle: 'Lascia che la nostra intelligenza colga l\'anima delle tue parole.',
      placeholder: 'Descrivi l\'emozione che vuoi trasmettere...',
      generate: 'Componi Messaggio',
      result: 'La tua bozza d\'autore:',
      loading: 'Componendo l\'eccellenza...',
      listen: 'Ascolta Voce',
      copy: 'Copia Testo',
      copied: 'Copiato',
      generateImg: 'Sfondo Artistico',
      creatingImg: 'Dipingendo...',
      commission: 'Ordina Creazione Unica',
      recurringTitle: 'Gestione Annuale Ricorrenze',
      recurringDesc: 'Giuseppe Basile la attende per pianificare un calendario di tributi ricorrenti dedicati.',
      recurringBtn: 'Attiva Piano Ricorrenze',
      waiting: 'In attesa della tua visione...',
      consentTitle: 'Informativa Atelier AI',
      consentDesc: 'Per usufruire dei nostri servizi di composizione sartoriale digitale, è necessario acconsentire al trattamento della Sua richiesta tramite sistemi di intelligenza artificiale d\'avanguardia.',
      consentBtn: 'Autorizzo e Accedo all\'Atelier'
    },
    footer: {
      copy: '© 2026 Giuseppe Basile. Eccellenza Digitale.',
      tag: 'L\'eccellenza del ricordo, scolpita nel futuro.',
      label: 'Informazioni e Contatti'
    },
    mail: {
      subjects: {
        bday: 'Commissione d\'Elite: Celebrazione Digitale Sartoriale',
        anniv: 'Commissione d\'Elite: Omaggio per Unione Eterna',
        holiday: 'Commissione d\'Elite: Creazione per Ricorrenza Speciale',
        memorial: 'Commissione d\'Elite: Tributo In Memoriam',
        bespoke: 'Richiesta Atelier: Progetto Digitale Personalizzato'
      },
      recurringPrefix: '[PIANO RICORRENZE] ',
      intro: 'Egregio Giuseppe Basile,\n\nCon la presente desidero sottoporre alla Sua attenzione una richiesta per lo sviluppo di un tributo digitale di alto profilo.',
      recurringMsg: 'Sono interessato all\'attivazione di un servizio ricorrente per la gestione sistematica delle mie celebrazioni annuali.',
      draftLabel: 'Riferimento Bozza Atelier:',
      footer: '\nResto in attesa di un Suo riscontro per pianificare una sessione privata.\n\nCordiali saluti.'
    }
  },
  en: {
    nav: { works: 'Method', cards: 'Collections', info: 'Contact', ai: 'AI Atelier' },
    hero: {
      title: 'The Elegance of Memory',
      subtitle: 'Elite Digital Tributes',
      tagline: 'The excellence of memory, carved in the future.',
      desc: 'Every moment deserves an exceptional frame.',
      btn: 'Explore Collections'
    },
    works: {
      title: 'The Art of Creation',
      steps: [
        { title: 'Vision', desc: 'Share the essence of your message and emotional vision.' },
        { title: 'Design', desc: 'We bring a unique visual and textual concept to life.' },
        { title: 'Perfection', desc: 'Refining every detail and nuance together.' },
        { title: 'Legacy', desc: 'Your digital tribute is ready for eternity.' }
      ]
    },
    cards: {
      title: 'Collections',
      items: [
        { id: 'bday', title: 'Celebrations', desc: 'For birthdays that leave a mark.', btn: 'Personalize' },
        { id: 'anniv', title: 'Unions', desc: 'The eternal charm of shared love.', btn: 'Personalize' },
        { id: 'holiday', title: 'Occasions', desc: 'The warmth of cherished traditions.', btn: 'Personalize' },
        { id: 'memorial', title: 'In Memoriam', desc: 'A solemn tribute to honor a life.', btn: 'Personalize' }
      ]
    },
    ai: {
      title: 'AI Creative Atelier',
      subtitle: 'Let our intelligence capture the soul of your words.',
      placeholder: 'Describe the emotion you want to convey...',
      generate: 'Compose Message',
      result: 'Your bespoke draft:',
      loading: 'Composing excellence...',
      listen: 'Listen Voice',
      copy: 'Copy Text',
      copied: 'Copied',
      generateImg: 'Artistic BG',
      creatingImg: 'Painting...',
      commission: 'Order Unique Creation',
      recurringTitle: 'Annual Legacy Management',
      recurringDesc: 'Giuseppe Basile is waiting for you to plan a calendar of dedicated recurring tributes.',
      recurringBtn: 'Activate Recurring Plan',
      waiting: 'Waiting for your vision...',
      consentTitle: 'AI Atelier Disclosure',
      consentDesc: 'To access our bespoke digital composition services, you must consent to the processing of your request via cutting-edge artificial intelligence systems.',
      consentBtn: 'Authorize and Enter Atelier'
    },
    footer: {
      copy: '© 2026 Giuseppe Basile. Digital Excellence.',
      tag: 'The excellence of memory, carved in the future.',
      label: 'Info & Contacts'
    },
    mail: {
      subjects: {
        bday: 'Elite Commission: Tailored Digital Celebration',
        anniv: 'Elite Commission: Eternal Union Tribute',
        holiday: 'Elite Commission: Special Occasion Creation',
        memorial: 'Elite Commission: In Memoriam Tribute',
        bespoke: 'Atelier Request: Bespoke Digital Project'
      },
      recurringPrefix: '[RECURRING PLAN] ',
      intro: 'Dear Giuseppe Basile,\n\nI am writing to bring to your attention a request for the development of a high-profile digital tribute.',
      recurringMsg: 'I am interested in activating a recurring service for the systematic management of my annual celebrations.',
      draftLabel: 'Atelier Draft Reference:',
      footer: '\nI look forward to your feedback to schedule a private briefing session.\n\nBest regards.'
    }
  },
  de: {
    nav: { works: 'Methode', cards: 'Kollektionen', info: 'Kontakt', ai: 'KI-Atelier' },
    hero: {
      title: 'Eleganz der Erinnerung',
      subtitle: 'Exklusive digitale Würdigungen',
      tagline: 'Die Exzellenz der Erinnerung, in die Zukunft gemeißelt.',
      desc: 'Jeder Moment verdient einen aussergewöhnlichen Rahmen.',
      btn: 'Kollektionen entdecken'
    },
    works: {
      title: 'Die Kunst der Schöpfung',
      steps: [
        { title: 'Vision', desc: 'Teilen Sie die Essenz Ihrer Botschaft und emotionalen Vision.' },
        { title: 'Design', desc: 'Wir erwecken ein einzigartiges Konzept zum Leben.' },
        { title: 'Perfektion', desc: 'Gemeinsame Verfeinerung jedes Details.' },
        { title: 'Vermächtnis', desc: 'Ihre Ehrung ist bereit für die Ewigkeit.' }
      ]
    },
    cards: {
      title: 'Kollektionen',
      items: [
        { id: 'bday', title: 'Feiern', desc: 'Für Geburtstage, die Eindruck hinterlassen.', btn: 'Anpassen' },
        { id: 'anniv', title: 'Bündnisse', desc: 'Der ewige Charme geteilter Liebe.', btn: 'Anpassen' },
        { id: 'holiday', title: 'Anlässe', desc: 'Die Wärme geschätzter Traditionen.', btn: 'Anpassen' },
        { id: 'memorial', title: 'In Memoriam', desc: 'Eine feierliche Ehrung für ein Leben.', btn: 'Anpassen' }
      ]
    },
    ai: {
      title: 'KI Kreativ-Atelier',
      subtitle: 'Lassen Sie unsere Intelligenz die Seele Ihrer Worte einfangen.',
      placeholder: 'Beschreiben Sie die Emotion, die Sie vermitteln möchten...',
      generate: 'Komponieren',
      result: 'Ihr Entwurf:',
      loading: 'Exzellenz komponieren...',
      listen: 'Stimme anhören',
      copy: 'Text kopieren',
      copied: 'Kopiert',
      generateImg: 'Art BG',
      creatingImg: 'Malen...',
      commission: 'Einzigartiger Auftrag',
      recurringTitle: 'Jährlicher Legacy-Service',
      recurringDesc: 'Giuseppe Basile erwartet Sie, um einen Kalender con dedizierten wiederkehrenden Ehrungen zu planen.',
      recurringBtn: 'Wiederholungsplan aktivieren',
      waiting: 'Warten auf Ihre Vision...',
      consentTitle: 'KI Atelier Offenlegung',
      consentDesc: 'Um auf unsere massgeschneiderten digitalen Kompositionsdienste zuzugreifen, müssen Sie der Verarbeitung Ihrer Anfrage über modernste KI-Systeme zustimmen.',
      consentBtn: 'Autorisieren und Atelier betreten'
    },
    footer: {
      copy: '© 2026 Giuseppe Basile. Digitale Exzellenz.',
      tag: 'Die Exzellenz della Erinnerung, in die Zukunft gemeißelt.',
      label: 'Info & Kontakte'
    },
    mail: {
      subjects: {
        bday: 'Elite Auftrag: Maßgeschneiderte Digitale Feier',
        anniv: 'Elite Auftrag: Ewige Verbindung Tribut',
        holiday: 'Elite Auftrag: Besonderer Anlass Kreation',
        memorial: 'Elite Auftrag: In Memoriam Tribut',
        bespoke: 'Atelier Anfrage: Personalisiertes Digitalprojekt'
      },
      recurringPrefix: '[WIEDERKEHRENDER PLAN] ',
      intro: 'Sehr geehrter Giuseppe Basile,\n\nich möchte Sie hiermit auf eine Anfrage zur Entwicklung einer hochkarätigen digitalen Ehrung aufmerksam machen.',
      recurringMsg: 'Ich bin an der Aktivierung eines wiederkehrenden Dienstes für die systematische Verwaltung meiner jährlichen Feiern interessiert.',
      draftLabel: 'Atelier-Entwurf Referenz:',
      footer: '\nIch freue mich auf Ihre Rückmeldung, um eine private Sitzung zu vereinbaren.\n\nMit freundlichen Grüßen.'
    }
  }
};

const LanguageSwitcher: React.FC<{ current: Language, onSelect: (l: Language) => void, theme: Theme }> = ({ current, onSelect, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = [
    { code: 'it', flag: '🇮🇹', label: 'Italiano' },
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = options.find(o => o.code === current);
  const borderClass = theme === 'light' ? 'border-2 border-[#1C1917]' : 'border border-gold/40 shadow-[0_0_10px_rgba(212,175,55,0.2)]';

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 rounded-full transition-all duration-300 shadow-sm ${borderClass} ${theme === 'dark' ? 'bg-black/60 backdrop-blur-xl' : 'bg-white'}`}
      >
        <span className="text-xl sm:text-2xl drop-shadow-sm">{currentOption?.flag}</span>
        <span className={`text-[10px] sm:text-[12px] font-serif-display font-black tracking-[0.1em] ${theme === 'light' ? 'text-[#1C1917]' : 'gold-text'}`}>{currentOption?.code.toUpperCase()}</span>
        <span className={`text-[8px] sm:text-[9px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${theme === 'light' ? 'text-[#1C1917]' : 'text-gold opacity-100'}`}>▼</span>
      </button>

      {isOpen && (
        <div className={`absolute top-full right-0 mt-4 z-[100] min-w-[180px] sm:min-w-[220px] py-2 sm:py-3 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.5)] backdrop-blur-3xl animate-fade-up ${theme === 'dark' ? 'bg-[#0F0F0F]/95 border border-gold/30' : 'bg-white border-2 border-[#1C1917]'}`}>
          {options.map((opt) => (
            <button
              key={opt.code}
              onClick={() => { onSelect(opt.code as Language); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 transition-all text-left group ${current === opt.code ? 'bg-gold/20' : 'hover:bg-gold/10'}`}
            >
              <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">{opt.flag}</span>
              <span className={`text-[14px] sm:text-[16px] font-serif-display font-black tracking-wide transition-colors ${theme === 'dark' ? 'text-white group-hover:text-gold' : 'text-[#1C1917] group-hover:text-gold'}`}>
                {opt.label}
              </span>
              {current === opt.code && (
                <div className="ml-auto w-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gold shadow-[0_0_12px_rgba(212,175,55,1)]"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('it');
  const [theme, setTheme] = useState<Theme>('dark');
  const [scrolled, setScrolled] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [hasAiConsent, setHasAiConsent] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiResult('');
    setAiImage(null);
    setShowRecurring(false);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an elite greeting card copywriter for a high-end agency. 
        Generate an elegant, sophisticated, and deeply emotional message in ${lang} based on: ${aiPrompt}. 
        Focus on luxury, sincerity and timelessness. Max 50 words. Output ONLY the message text.`,
      });
      setAiResult(response.text || "Error");
      setTimeout(() => setShowRecurring(true), 800);
    } catch (error) {
      console.error(error);
      setAiResult("Error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerateImage = async () => {
    if (!aiResult) return;
    setIsImgLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A high-end, artistic, abstract and elegant background for a luxury digital tribute card. Theme: ${aiResult}. Minimalist, soft lighting, gold and ivory colors, cinematic quality, high resolution.` }]
        },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        const part = candidates[0].content.parts.find(p => p.inlineData);
        if (part?.inlineData) {
          setAiImage(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    } catch (error) {
      console.error("Image gen error", error);
    } finally {
      setIsImgLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!aiResult || isAudioLoading) return;
    setIsAudioLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: aiResult }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
        source.onended = () => setIsAudioLoading(false);
      }
    } catch (error) {
      console.error("Audio error", error);
      setIsAudioLoading(false);
    }
  };

  const openMail = (type: string, isRecurringPlan: boolean = false, draft?: string) => {
    const m = t.mail;
    let subject = (isRecurringPlan ? m.recurringPrefix : '') + (m.subjects[type] || m.subjects['bespoke']);
    let body = m.intro + "\n\n";
    
    if (isRecurringPlan) {
        body += m.recurringMsg + "\n\n";
    }

    if (draft) {
        body += m.draftLabel + "\n----------------------------\n" + draft + "\n----------------------------\n\n";
    }

    body += m.footer;

    window.location.href = `mailto:giu.bas.91@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getButtonClass = (primary: boolean) => {
    const base = "px-8 sm:px-16 py-4 sm:py-7 rounded-full text-[10px] sm:text-[12px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-700";
    if (theme === 'light') {
      return primary 
        ? `${base} group relative overflow-hidden border-2 border-[#1C1917] hover:bg-[#1C1917] shadow-xl`
        : `${base} border-2 border-[#1C1917] hover:bg-gold/30 text-[#1C1917]`;
    }
    return primary
        ? `${base} group relative overflow-hidden shadow-[0_20px_40px_rgba(212,175,55,0.2)] border border-gold/40`
        : `${base} border border-gold/40 hover:bg-gold/10 text-gold shadow-lg`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 font-serif relative overflow-hidden ${theme === 'dark' ? 'bg-obsidian text-[#F3F4F6]' : 'bg-[#FDFCF7] text-[#1C1917]'}`}>
      
      {/* Grain Texture Overlay */}
      <div className={`fixed inset-0 pointer-events-none z-[1] mix-blend-overlay grain-bg ${theme === 'dark' ? 'opacity-[0.04]' : 'opacity-[0.02]'}`}></div>

      <CustomCursor theme={theme} />

      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3 sm:py-5 backdrop-blur-3xl border-b' : 'py-6 sm:py-10 bg-transparent'} ${theme === 'dark' ? 'border-white/10 bg-black/70' : 'border-[#1C1917]/20 bg-white/90 shadow-md'}`}>
        <div className="container mx-auto px-4 sm:px-10 flex justify-between items-center">
          <span className={`text-2xl sm:text-4xl font-serif-display font-bold tracking-[0.2em] italic select-none drop-shadow-md ${theme === 'light' ? 'text-[#1C1917]' : 'gold-text'}`}>GB</span>
          
          <nav className="hidden lg:flex items-center gap-12 text-[11px] uppercase tracking-[0.3em] font-black">
            {['works', 'cards', 'ai', 'contact'].map((id) => (
              <a 
                key={id}
                href={`#${id}`} 
                onClick={(e) => scrollToSection(e, id)} 
                className={`transition-all hover:gold-text relative group pb-1 ${theme === 'light' ? 'text-[#1C1917]' : 'text-white opacity-90'}`}
              >
                {t.nav[id === 'contact' ? 'info' : id]}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-500 group-hover:w-full ${theme === 'light' ? 'bg-[#1C1917]' : 'bg-gold'}`}></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-8">
            <LanguageSwitcher current={lang} onSelect={setLang} theme={theme} />
            <button 
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} 
              className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full transition-all border-2 flex items-center justify-center hover:scale-110 active:scale-95 ${theme === 'dark' ? 'text-gold border-gold/40 bg-white/5 shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-[#1C1917] border-[#1C1917] bg-white shadow-xl'}`}
            >
              <span className="text-xl sm:text-2xl">{theme === 'dark' ? '✧' : '✦'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-40 px-4 sm:px-10 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className={`absolute top-[-25%] right-[-15%] w-[80vw] h-[80vw] rounded-full blur-[150px] sm:blur-[250px] opacity-20 animate-respirate ${theme === 'dark' ? 'bg-[#D4AF37]' : 'bg-[#B45309]'}`}></div>
          <div className={`absolute bottom-[-25%] left-[-15%] w-[70vw] h-[70vw] rounded-full blur-[200px] sm:blur-[300px] opacity-15 animate-respirate-slow ${theme === 'dark' ? 'bg-indigo-900' : 'bg-gold'}`}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10 animate-fade-up">
          <h1 className={`text-4xl sm:text-7xl md:text-[9rem] font-serif-display font-medium mb-8 sm:mb-14 tracking-tighter leading-[1.2] md:leading-[0.85] drop-shadow-3xl max-w-7xl mx-auto ${theme === 'light' ? 'text-[#1C1917]' : ''}`}>
            {t.hero.title.split(' ').map((word, i) => (
              <span key={i} className={word.length > 5 ? 'italic font-light' : 'font-black'}>{word} </span>
            ))}
          </h1>
          <p className={`text-lg sm:text-xl md:text-3xl max-w-4xl mx-auto mb-16 sm:mb-24 font-light italic leading-relaxed tracking-wider ${theme === 'light' ? 'text-[#1C1917] font-bold' : 'text-white opacity-90'}`}>
            {t.hero.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 justify-center items-center">
            <a href="#cards" onClick={(e) => scrollToSection(e, 'cards')} className={getButtonClass(true)}>
              {theme === 'dark' && <div className="absolute inset-0 gold-gradient transition-transform duration-1000 group-hover:scale-110"></div>}
              <span className={`relative z-10 font-black uppercase tracking-[0.3em] text-[11px] sm:text-[13px] transition-colors ${theme === 'dark' ? 'text-black' : 'text-[#1C1917] group-hover:text-white'}`}>
                {t.hero.btn}
              </span>
            </a>
            <a href="#works" onClick={(e) => scrollToSection(e, 'works')} className={getButtonClass(false)}>
              {t.nav.works}
            </a>
          </div>
        </div>
      </section>

      {/* Method Section (Works) */}
      <section id="works" className="py-32 sm:py-72 px-4 sm:px-10 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto mb-24 sm:mb-56 text-center">
             <span className={`text-[12px] sm:text-[15px] uppercase tracking-[0.5em] sm:tracking-[1em] gold-text font-black mb-6 sm:mb-12 block italic drop-shadow-sm`}>{t.nav.works}</span>
             <h2 className={`text-3xl sm:text-5xl md:text-[8rem] font-serif-display mb-8 sm:mb-14 tracking-tighter max-w-5xl mx-auto leading-tight ${theme === 'light' ? 'text-[#1C1917]' : 'text-white'}`}>{t.works.title}</h2>
             <div className={`w-24 sm:w-40 h-1 mx-auto ${theme === 'dark' ? 'bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-[#1C1917]'}`}></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-20">
            {t.works.steps.map((step, idx) => (
              <div key={idx} className={`group flex flex-col items-center text-center p-8 sm:p-16 transition-all duration-1000 ${theme === 'light' ? 'border-2 border-[#1C1917] rounded-[2.5rem] sm:rounded-[4rem] bg-white shadow-xl hover:-translate-y-2 sm:hover:-translate-y-4' : 'bg-white/[0.03] border border-white/10 rounded-[2.5rem] sm:rounded-[4rem] hover:bg-white/[0.06] hover:border-gold/30'}`}>
                 <div className="relative mb-16 sm:mb-24 h-32 sm:h-40 flex items-center justify-center">
                    <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 flex items-center justify-center relative z-0 transition-all duration-1000 shadow-xl ${theme === 'dark' ? 'bg-white/[0.05] border-gold/40 group-hover:border-gold' : 'bg-[#1C1917]/[0.1] border-[#1C1917] group-hover:border-gold'}`}>
                       <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gold shadow-[0_0_20px_rgba(212,175,55,1)]`}></div>
                    </div>
                    <span className="text-[6rem] sm:text-[9rem] md:text-[11rem] font-serif-display font-black absolute z-10 gold-text drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:scale-110">
                      0{idx + 1}
                    </span>
                 </div>
                 <h3 className="text-xl sm:text-3xl font-serif-display font-black mb-6 sm:mb-10 gold-text uppercase tracking-widest leading-none drop-shadow-sm">{step.title}</h3>
                 <p className={`text-[15px] sm:text-lg leading-relaxed italic max-w-[280px] ${theme === 'light' ? 'text-[#1C1917] font-black' : 'text-white/80 font-medium'}`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards Display */}
      <section id="cards" className="py-24 sm:py-64 px-4 sm:px-10">
        <div className="container mx-auto">
          <div className={`flex flex-col md:flex-row justify-between items-baseline mb-24 sm:mb-48 border-b pb-12 sm:pb-24 ${theme === 'dark' ? 'border-white/20' : 'border-[#1C1917] border-b-[4px] sm:border-b-[6px]'}`}>
            <h2 className={`text-3xl sm:text-5xl md:text-[8rem] font-serif-display mb-6 md:mb-0 tracking-tighter ${theme === 'light' ? 'text-[#1C1917]' : 'text-white'}`}>{t.cards.title}</h2>
            <p className={`max-w-md text-lg sm:text-xl italic font-black leading-relaxed ${theme === 'light' ? 'text-[#1C1917]' : 'text-white/80'}`}>{t.hero.desc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-16">
            {t.cards.items.map((card) => (
              <div key={card.id} className={`group relative p-8 sm:p-16 rounded-[3rem] sm:rounded-[5rem] border-2 flex flex-col transition-all duration-1000 hover:border-gold sm:hover:-translate-y-8 ${theme === 'dark' ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]' : 'bg-white border-[#1C1917] shadow-xl'}`}>
                <div className={`mb-8 sm:mb-14 text-[11px] sm:text-[13px] tracking-[0.4em] sm:tracking-[0.7em] font-black transition-opacity uppercase italic ${theme === 'light' ? 'text-gold' : 'gold-text'}`}>Selected Series</div>
                <h3 className={`text-2xl sm:text-4xl md:text-5xl font-serif-display font-black mb-6 sm:mb-10 transition-colors leading-tight ${theme === 'light' ? 'text-[#1C1917] group-hover:text-gold' : 'text-white group-hover:gold-text'}`}>{card.title}</h3>
                <p className={`text-[16px] sm:text-[18px] mb-12 sm:mb-24 flex-grow leading-relaxed italic ${theme === 'light' ? 'text-[#1C1917] font-black' : 'text-white/80 font-medium'}`}>{card.desc}</p>
                <button 
                  onClick={() => openMail(card.id)}
                  className={`relative w-full py-4 sm:py-7 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 ${theme === 'dark' ? 'border-gold/50 group-hover:border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'border-[#1C1917]'}`}
                >
                   <span className={`relative z-10 font-black text-[11px] sm:text-[13px] uppercase tracking-[0.3em] sm:tracking-[0.4em] transition-colors ${theme === 'dark' ? 'text-gold group-hover:text-black' : 'text-[#1C1917] group-hover:text-white'}`}>{card.btn}</span>
                   <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ${theme === 'dark' ? 'bg-gold' : 'bg-[#1C1917]'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Atelier */}
      <section id="ai" className={`py-32 sm:py-72 px-4 sm:px-10 relative overflow-hidden ${theme === 'dark' ? 'bg-black/40' : 'bg-[#F9F8F3]'}`}>
        <div className="container mx-auto max-w-7xl relative">
          
          {/* Consent Gate Overlay */}
          {!hasAiConsent && (
            <div className={`absolute inset-0 z-20 flex items-center justify-center p-6 rounded-[3rem] sm:rounded-[6rem] border-2 backdrop-blur-3xl animate-fade-up ${theme === 'dark' ? 'bg-black/70 border-gold/10' : 'bg-white/70 border-[#1C1917]/10'}`}>
              <div className="max-w-xl text-center space-y-8 sm:space-y-12">
                 <div className={`w-20 h-20 sm:w-28 sm:h-28 mx-auto rounded-full border-2 flex items-center justify-center font-serif-display text-2xl sm:text-3xl font-black italic shadow-2xl ${theme === 'dark' ? 'text-gold border-gold' : 'text-[#1C1917] border-[#1C1917]'}`}>GB</div>
                 <h3 className={`text-3xl sm:text-5xl font-serif-display font-black uppercase tracking-widest ${theme === 'dark' ? 'gold-text' : 'text-[#1C1917]'}`}>
                    {t.ai.consentTitle}
                 </h3>
                 <p className={`text-lg sm:text-xl italic leading-relaxed font-medium ${theme === 'dark' ? 'text-white/80' : 'text-[#1C1917]/80'}`}>
                    {t.ai.consentDesc}
                 </p>
                 <button 
                   onClick={() => setHasAiConsent(true)}
                   className={`group relative px-10 sm:px-16 py-5 sm:py-8 rounded-full overflow-hidden shadow-2xl transition-all duration-500 active:scale-95 ${theme === 'dark' ? 'gold-gradient text-black font-black uppercase tracking-widest text-[11px] sm:text-[13px]' : 'bg-[#1C1917] text-white font-black uppercase tracking-widest text-[11px] sm:text-[13px]'}`}
                 >
                    {t.ai.consentBtn}
                 </button>
              </div>
            </div>
          )}

          <div className={`grid lg:grid-cols-2 gap-20 sm:gap-40 items-start transition-all duration-1000 ${hasAiConsent ? 'opacity-100 blur-0 scale-100' : 'opacity-20 blur-2xl scale-95 pointer-events-none select-none'}`}>
            <div className="lg:sticky lg:top-40">
              <h2 className={`text-4xl sm:text-6xl md:text-[7rem] font-serif-display mb-10 sm:mb-16 tracking-tighter leading-none max-w-2xl ${theme === 'light' ? 'text-[#1C1917]' : 'text-white'}`}>{t.ai.title}</h2>
              <p className={`text-xl sm:text-2xl md:text-3xl mb-12 sm:mb-24 leading-relaxed italic max-w-xl ${theme === 'light' ? 'text-[#1C1917] font-black' : 'text-white/90'}`}>{t.ai.subtitle}</p>
              
              <div className="space-y-12 sm:space-y-20 mb-16 sm:mb-24">
                 {[1, 2, 3].map(num => (
                   <div key={num} className="flex items-center gap-8 sm:gap-12 group">
                      <span className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center text-sm sm:text-lg font-black group-hover:border-gold transition-all duration-700 shadow-xl ${theme === 'dark' ? 'text-gold border-gold/30 bg-white/5' : 'text-[#1C1917] border-[#1C1917] bg-white'}`}>{num}</span>
                      <span className={`text-[13px] sm:text-[16px] uppercase tracking-[0.4em] sm:tracking-[0.6em] font-black transition-all ${theme === 'light' ? 'text-[#1C1917] hover:text-gold' : 'text-white/80 group-hover:text-gold'}`}>
                        {num === 1 ? (lang === 'it' ? 'Essenze' : 'Essence') : 
                         num === 2 ? (lang === 'it' ? 'Alchimia' : 'Alchemy') : 
                         (lang === 'it' ? 'Capolavoro' : 'Masterpiece')}
                      </span>
                   </div>
                 ))}
              </div>

              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={t.ai.placeholder}
                style={{ caretColor: '#D4AF37' }}
                className={`w-full h-48 sm:h-64 p-6 sm:p-12 rounded-[2rem] sm:rounded-[4rem] border-2 outline-none transition-all resize-none mb-8 sm:mb-16 text-xl sm:text-2xl italic font-medium ${theme === 'dark' ? 'bg-black/60 border-white/20 focus:border-gold text-white shadow-inner' : 'bg-white border-[#1C1917] focus:border-gold text-[#1C1917] shadow-xl'}`}
              />
              <button 
                onClick={handleAiGenerate}
                disabled={isAiLoading || !aiPrompt.trim()}
                className={`group relative w-full py-6 sm:py-10 overflow-hidden rounded-full shadow-xl disabled:opacity-30 transition-all ${theme === 'light' ? 'border-2 border-[#1C1917] hover:bg-[#1C1917]' : 'border border-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.2)]'}`}
              >
                {theme === 'dark' && <div className="absolute inset-0 gold-gradient"></div>}
                <span className={`relative z-10 font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[13px] sm:text-[15px] ${theme === 'dark' ? 'text-black' : 'text-[#1C1917] group-hover:text-white transition-colors'}`}>
                  {isAiLoading ? t.ai.loading : t.ai.generate}
                </span>
              </button>
            </div>

            <div className="relative mt-12 lg:mt-0">
              {aiResult ? (
                <div className="animate-fade-up space-y-12 sm:space-y-16">
                  <div className={`relative overflow-hidden rounded-[3rem] sm:rounded-[6rem] aspect-[3/4] shadow-4xl border-2 group ${theme === 'dark' ? 'bg-black border-white/20' : 'bg-white border-[#1C1917]'}`}>
                    {aiImage ? (
                      <img src={aiImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105 group-hover:scale-110 transition-transform duration-[3s]" />
                    ) : (
                      <div className="absolute inset-0 gold-gradient opacity-[0.05]"></div>
                    )}
                    
                    <div className="absolute inset-0 p-8 sm:p-24 flex flex-col justify-center text-center backdrop-blur-[1px] sm:backdrop-blur-[2px]">
                       <div className={`w-12 sm:w-20 h-1 sm:h-1.5 mx-auto mb-10 sm:mb-16 transition-all duration-1000 group-hover:w-32 sm:group-hover:w-48 ${theme === 'dark' ? 'bg-gold shadow-[0_0_10px_rgba(212,175,55,1)]' : 'bg-[#1C1917]'}`}></div>
                       <p className={`text-2xl sm:text-3xl md:text-5xl font-serif-display leading-[1.6] italic z-10 px-4 sm:px-8 drop-shadow-lg ${theme === 'light' ? 'text-[#1C1917] font-black' : 'text-white font-bold'}`}>
                         {aiResult}
                       </p>
                       <div className={`w-12 sm:w-20 h-1 sm:h-1.5 mx-auto mt-10 sm:mt-16 transition-all duration-1000 group-hover:w-32 sm:group-hover:w-48 ${theme === 'dark' ? 'bg-gold shadow-[0_0_10px_rgba(212,175,55,1)]' : 'bg-[#1C1917]'}`}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:gap-8">
                    <button 
                      onClick={handlePlayAudio}
                      disabled={isAudioLoading}
                      className={`py-4 sm:py-6 px-4 sm:px-8 rounded-full border-2 text-[10px] sm:text-[12px] font-black uppercase tracking-widest gold-text hover:bg-gold hover:text-black transition-all disabled:opacity-50 ${theme === 'dark' ? 'border-gold/60 bg-white/5' : 'border-[#1C1917] bg-white shadow-lg'}`}
                    >
                      {isAudioLoading ? '...' : t.ai.listen}
                    </button>
                    <button 
                      onClick={handleCopyText}
                      className={`py-4 sm:py-6 px-4 sm:px-8 rounded-full border-2 text-[10px] sm:text-[12px] font-black uppercase tracking-widest gold-text hover:bg-gold hover:text-black transition-all ${theme === 'dark' ? 'border-gold/60 bg-white/5' : 'border-[#1C1917] bg-white shadow-lg'}`}
                    >
                      {isCopied ? t.ai.copied : t.ai.copy}
                    </button>
                    <button 
                      onClick={handleGenerateImage}
                      disabled={isImgLoading}
                      className={`col-span-2 py-4 sm:py-6 rounded-full border-2 text-[10px] sm:text-[12px] font-black uppercase tracking-widest gold-text hover:bg-gold hover:text-black transition-all disabled:opacity-50 ${theme === 'dark' ? 'border-gold/60 bg-white/5' : 'border-[#1C1917] bg-white shadow-lg'}`}
                    >
                      {isImgLoading ? '...' : t.ai.generateImg}
                    </button>
                    <button 
                      onClick={() => openMail('bespoke', false, aiResult)}
                      className={`col-span-2 py-6 sm:py-8 rounded-full text-[14px] sm:text-[16px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] shadow-2xl hover:scale-[1.02] transition-all active:scale-95 ${theme === 'dark' ? 'gold-gradient text-black' : 'border-2 border-[#1C1917] bg-[#1C1917] text-white shadow-2xl'}`}
                    >
                      {t.ai.commission}
                    </button>
                  </div>

                  {showRecurring && (
                    <div className={`animate-fade-up pt-16 sm:pt-24 border-t-2 text-center space-y-8 sm:space-y-10 ${theme === 'dark' ? 'border-white/10' : 'border-[#1C1917]'}`}>
                       <h4 className={`text-2xl sm:text-4xl font-serif-display gold-text uppercase tracking-widest font-black`}>{t.ai.recurringTitle}</h4>
                       <p className={`text-lg sm:text-xl italic max-w-md mx-auto leading-relaxed ${theme === 'light' ? 'text-[#1C1917] font-black' : 'text-white/80'}`}>
                         {t.ai.recurringDesc}
                       </p>
                       <button 
                         onClick={() => openMail('bespoke', true, aiResult)}
                         className={`px-8 sm:px-16 py-4 sm:py-7 rounded-full text-[11px] sm:text-[13px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-black gold-text hover:bg-gold hover:text-black transition-all shadow-xl active:scale-95 border-2 ${theme === 'dark' ? 'border-gold/60 bg-white/5' : 'border-[#1C1917] bg-white shadow-lg'}`}
                       >
                         {t.ai.recurringBtn}
                       </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`aspect-[3/4] rounded-[3rem] sm:rounded-[6rem] border-2 flex items-center justify-center italic font-serif-display text-3xl sm:text-5xl text-center px-12 sm:px-20 transition-all duration-1000 ${theme === 'dark' ? 'border-white/5 text-white/10' : 'border-[#1C1917] bg-[#1C1917]/10 text-[#1C1917] opacity-60 font-black shadow-inner'}`}>
                   {t.ai.waiting}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className={`py-32 sm:py-56 px-4 sm:px-10 border-t-2 ${theme === 'dark' ? 'border-white/10' : 'border-[#1C1917]'}`}>
        <div className="container mx-auto text-center max-w-6xl">
          <a 
            href="#contact" 
            onClick={(e) => scrollToSection(e, 'contact')} 
            className="group inline-block mb-12 sm:mb-20 transform hover:scale-110 transition-transform duration-1000"
          >
            <span className={`text-[14px] sm:text-[17px] gold-text font-black uppercase tracking-[0.8em] sm:tracking-[1.2em] italic block transition-all duration-700 ${theme === 'light' ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
              {t.footer.label}
            </span>
            <div className={`w-12 sm:w-16 h-1 mx-auto mt-6 sm:mt-8 group-hover:w-24 sm:group-hover:w-40 transition-all duration-1000 ${theme === 'dark' ? 'bg-gold shadow-[0_0_10px_rgba(212,175,55,1)]' : 'bg-[#1C1917]'}`}></div>
          </a>
          
          <a 
            href="mailto:giu.bas.91@gmail.com" 
            className={`text-xl sm:text-4xl md:text-7xl font-serif-display gold-text hover:tracking-[0.1em] sm:hover:tracking-[0.25em] transition-all duration-1000 tracking-normal sm:tracking-[0.2em] block mb-24 sm:mb-32 italic font-black break-words`}
          >
            giu.bas.91@gmail.com
          </a>
          
          <div className="space-y-12 sm:space-y-20">
            <p className={`text-xl sm:text-2xl md:text-5xl font-serif-display italic tracking-wider sm:tracking-widest leading-tight max-w-5xl mx-auto ${theme === 'light' ? 'text-[#1C1917] font-black' : 'text-white opacity-90'}`}>
              {t.footer.tag}
            </p>
            <div className={`w-20 sm:w-32 h-1 mx-auto ${theme === 'dark' ? 'bg-white/20' : 'bg-[#1C1917]'}`}></div>
            <p className={`text-[11px] sm:text-[14px] uppercase tracking-[0.4em] sm:tracking-[0.7em] font-black ${theme === 'light' ? 'text-[#1C1917]' : 'text-white/40'}`}>
              {t.footer.copy}
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        * {
          cursor: none !important;
        }
        @media (pointer: coarse) {
          * { cursor: auto !important; }
        }
        .bg-obsidian {
          background: radial-gradient(circle at 50% 50%, #111113 0%, #030303 100%);
        }
      `}</style>
    </div>
  );
};

export default App;
