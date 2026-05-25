import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Palette } from 'lucide-react';

const themes = [
  { id: 'fresh', label: 'Fresh', colors: ['#0f766e', '#b7e85f', '#ff7a59'] },
  { id: 'coral', label: 'Coral', colors: ['#e14f3d', '#ffc857', '#2563eb'] },
  { id: 'violet', label: 'Violet', colors: ['#6d5dfc', '#39d0ff', '#f7b801'] },
  { id: 'lagoon', label: 'Lagoon', colors: ['#0284c7', '#2dd4bf', '#f97316'] },
  { id: 'bloom', label: 'Bloom', colors: ['#db2777', '#f9a8d4', '#14b8a6'] },
  { id: 'sunrise', label: 'Sunrise', colors: ['#b45309', '#facc15', '#06b6d4'] },
  { id: 'forest', label: 'Forest', colors: ['#3f6212', '#d9f99d', '#a855f7'] },
  { id: 'slate', label: 'Slate', colors: ['#334155', '#0ea5e9', '#eab308'] },
  { id: 'orchid', label: 'Retro', colors: ['#7c2d12', '#2dd4bf', '#facc15'] },
  { id: 'mono', label: 'Ink', colors: ['#121826', '#f4f7fb', '#8aa3b5'] },
] as const;

type ThemeId = (typeof themes)[number]['id'];

function isThemeId(value: string | null): value is ThemeId {
  return themes.some((theme) => theme.id === value);
}

export default function ThemePicker() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>('fresh');
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const activeThemeLabel = themes.find((theme) => theme.id === activeTheme)?.label ?? 'Fresh';

  useEffect(() => {
    let storedTheme: string | null = null;

    try {
      storedTheme = window.localStorage.getItem('access-tools-theme');
    } catch {
      storedTheme = null;
    }

    const nextTheme = isThemeId(storedTheme) ? storedTheme : 'fresh';
    document.documentElement.dataset.theme = nextTheme;
    setActiveTheme(nextTheme);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const eventPath = event.composedPath();
      if (!pickerRef.current || !eventPath.includes(pickerRef.current)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const chooseTheme = (theme: ThemeId) => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem('access-tools-theme', theme);
    } catch {
      // The visual change still applies for the current page when storage is blocked.
    }
    setActiveTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="theme-picker" ref={pickerRef}>
      <button
        aria-label={`Choose website look. Current look: ${activeThemeLabel}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="theme-picker-trigger"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="theme-picker-icon" aria-hidden="true">
          <Palette size={16} strokeWidth={2.4} />
        </span>
        <ChevronDown className="theme-picker-chevron" aria-hidden="true" size={15} strokeWidth={2.4} />
      </button>

      {isOpen && (
        <div className="theme-picker-panel">
          <div className="theme-picker-panel-heading">
            <span>Website looks</span>
            <strong>{activeThemeLabel}</strong>
          </div>
          <div className="theme-swatch-grid" role="group" aria-label="Website color looks">
            {themes.map((theme) => (
              <button
                aria-label={`Use ${theme.label} look`}
                aria-pressed={activeTheme === theme.id}
                className="theme-swatch"
                key={theme.id}
                onClick={() => chooseTheme(theme.id)}
                title={theme.label}
                type="button"
              >
                <span className="theme-swatch-colors" aria-hidden="true">
                  {theme.colors.map((color, index) => (
                    <i key={`${theme.id}-${index}`} style={{ background: color }} />
                  ))}
                </span>
                <span className="theme-swatch-label">{theme.label}</span>
                {activeTheme === theme.id && <Check className="theme-swatch-check" aria-hidden="true" size={14} strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
