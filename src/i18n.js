import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from "./locales/fr.json";
import en from "./locales/en.json";

// Configuration de i18n
i18n
  // Détecte la langue du navigateur
  .use(LanguageDetector)
  // Passe i18n à react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // Langue par défaut si la langue détectée n'est pas disponible
    debug: process.env.NODE_ENV === 'development', // Affiche des logs en mode développement
    interpolation: {
      escapeValue: false, // React gère déjà l'échappement des valeurs
    },
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
  });

export default i18n;