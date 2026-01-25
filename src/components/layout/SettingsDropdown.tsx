import { Settings, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext"
import { useTranslation } from "react-i18next";

export const SettingsDropdown = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover">
        <DropdownMenuLabel className="flex items-center gap-2">
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          {t('common.theme')}
        </DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={toggleTheme}
          className="cursor-pointer"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4 mr-2" />
              {t('common.darkMode')}
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 mr-2" />
              {t('common.lightMode')}
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {t('common.language')}
        </DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={`cursor-pointer ${i18n.language === 'en' ? 'bg-accent' : ''}`}
        >
          🇺🇸 {t('common.english')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('zh')}
          className={`cursor-pointer ${i18n.language === 'zh' ? 'bg-accent' : ''}`}
        >
          🇨🇳 {t('common.chinese')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
