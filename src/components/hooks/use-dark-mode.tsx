import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(checkDarkMode());

  function checkDarkMode() {
    return document.documentElement.classList.contains("dark");
  }

  function toggleDarkMode() {
    checkDarkMode()
      ? document.documentElement.classList.remove("dark")
      : document.documentElement.classList.add("dark");
  }

  useEffect(() => {
    setIsDarkMode(checkDarkMode);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") setIsDarkMode(checkDarkMode());
      });
    });

    mutationObserver.observe(document.documentElement, { attributes: true });

    return () => mutationObserver.disconnect();
  }, []);

  return { isDarkMode, toggleDarkMode };
};
