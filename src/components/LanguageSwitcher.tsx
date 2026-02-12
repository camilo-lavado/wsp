import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
      title={i18n.language === 'en' ? 'Switch to Spanish' : 'Switch to English'}
    >
      <span className="text-xl">
        {i18n.language === 'en' ? '🇺🇸' : '🇨🇱'}
      </span>
      <span className="text-sm font-medium text-gray-300 uppercase">
        {i18n.language}
      </span>
    </button>
  );
};
