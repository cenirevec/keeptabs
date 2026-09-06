import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Configuration de i18n
i18n
  // Détecte la langue du navigateur
  .use(LanguageDetector)
  // Active les traductions via HTTP (chargement des fichiers JSON)
  .use(Backend)
  // Passe i18n à react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // Langue par défaut si la langue détectée n'est pas disponible
    debug: process.env.NODE_ENV === 'development', // Affiche des logs en mode développement
    interpolation: {
      escapeValue: false, // React gère déjà l'échappement des valeurs
    },
    // Chemins vers les fichiers de traduction
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
  });

export default i18n;