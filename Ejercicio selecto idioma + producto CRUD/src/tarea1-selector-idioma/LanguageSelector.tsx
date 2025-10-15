import React from 'react';
import { useLanguage, Language } from '../shared/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="language-selector">
      <h3>{t('selectLanguage')}</h3>
      <div className="language-buttons">
        <button
          className={`language-btn ${language === 'es' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('es')}
        >
          🇪🇸 {t('spanish')}
        </button>
        <button
          className={`language-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('en')}
        >
          🇺🇸 {t('english')}
        </button>
        <button
          className={`language-btn ${language === 'fr' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('fr')}
        >
          🇫🇷 {t('french')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;