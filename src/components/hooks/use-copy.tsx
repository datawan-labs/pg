import { useCallback, useState } from "react";

/**
 * I do not write this code, I copied from usehooks library
 *
 * @ref https://github.com/uidotdev/usehooks/blob/main/index.js
 */

/**
 * copy with command
 */
const oldSchoolCopy = (text: string) => {
  const tempTextArea = document.createElement("textarea");

  tempTextArea.value = text;

  document.body.appendChild(tempTextArea);

  tempTextArea.select();

  document.execCommand("copy");

  document.body.removeChild(tempTextArea);
};

/**
 * copy to keyboard with navigator API or execCommand for
 * old browser
 */
export const useCopyToClipboard = () => {
  const [state, setState] = useState<string | null>(null);

  const copyToClipboard = useCallback((value: string) => {
    const handleCopy = async () => {
      try {
        if (!navigator?.clipboard?.writeText)
          throw new Error("writeText not supported");

        await navigator.clipboard.writeText(value);
        setState(value);
      } catch (e) {
        oldSchoolCopy(value);
        setState(value);
      }
    };

    handleCopy();
  }, []);

  return { state, copyToClipboard };
};
