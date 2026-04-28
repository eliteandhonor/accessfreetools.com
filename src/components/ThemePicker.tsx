import { useEffect, useState } from 'react';

const themes = [
  { id: 'fresh', label: 'Fresh', colors: ['#0f766e', '#b7e85f', '#ff7a59'] },
  { id: 'coral', label: 'Coral', colors: ['#e14f3d', '#ffc857', '#2563eb'] },
  { id: 'violet', label: 'Violet', colors: ['#6d5dfc', '#39d0ff', '#f7b801'] },
  { id: 'mono', label: 'Ink', colors: ['#121826', '#f4f7fb', '#8aa3b5'] },
] as const;

type ThemeId = (typeof themes)[number]['id'];

function isThemeId(value: string | null): value is ThemeId {
  return themes.some((theme) => theme.id === value);
}

export default function ThemePicker() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>('fresh');

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

  const chooseTheme = (theme: ThemeId) => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem('access-tools-theme', theme);
    } catch {
      // The visual change still applies for the current page when storage is blocked.
    }
    setActiveTheme(theme);
  };

  return (
    <div className="theme-picker" aria-label="Choose website look">
      <span>Choose look</span>
      <div>
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
            {theme.colors.map((color) => (
              <i aria-hidden="true" key={color} style={{ background: color }} />
            ))}
          </button>
        ))}
      </div>
    </div>
  );
}
