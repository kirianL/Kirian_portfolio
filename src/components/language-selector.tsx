import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import type { Language } from "@/data/data";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "ES", name: "Español", flag: "🇪🇸" },
    { code: "EN", name: "English", flag: "🇺🇸" },
    { code: "PT", name: "Português", flag: "🇧🇷" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="group">
          <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all group-hover:text-primary" />
          <span className="sr-only">Cambiar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg">{lang.flag}</span>
            <span
              className={language === lang.code ? "font-bold text-primary" : ""}
            >
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
