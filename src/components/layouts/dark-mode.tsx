import { Button } from "@/components/ui/button";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useDarkMode } from "@/components/hooks/use-dark-mode";

export const DarkModeToggler = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Button
      size="icon"
      className="size-8"
      variant="ghost"
      onClick={toggleDarkMode}
    >
      {isDarkMode ? (
        <IconSun className="size-4" />
      ) : (
        <IconMoon className="size-4" />
      )}
    </Button>
  );
};
