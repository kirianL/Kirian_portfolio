import { createContext, useContext, useState, type ReactNode } from "react";
import { dictionaries, type Language } from "@/data/data";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  data: (typeof dictionaries)["ES"];
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ES");

  const value = {
    language,
    setLanguage,
    data: dictionaries[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
