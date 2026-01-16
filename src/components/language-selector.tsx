import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-transparent px-3 text-sm text-foreground hover:text-blue-500 transition-colors font-semibold uppercase tracking-wider"
        >
          {language}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[9rem] bg-background/80 backdrop-blur-md border-border/40 py-2"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-center cursor-pointer text-sm py-3 hover:bg-transparent focus:bg-transparent bg-transparent group"
          >
            <span
              className={cn(
                "transition-colors duration-200 group-hover:text-blue-500",
                language === lang.code
                  ? "font-bold text-blue-500"
                  : "font-medium text-muted-foreground"
              )}
            >
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
