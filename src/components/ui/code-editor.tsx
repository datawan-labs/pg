import { FC } from "react";
import { cn } from "@/utils/classnames";
import { Editor, EditorProps } from "@monaco-editor/react";
import { useDarkMode } from "../hooks/use-dark-mode";

export const CodeEditor: FC<EditorProps> = ({
  options,
  className,
  ...props
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <Editor
      className={cn(className)}
      theme={isDarkMode ? "vs-dark" : "light"}
      options={{
        fontLigatures: true,
        fontFamily: "JetBrains Mono",
        minimap: {
          enabled: false,
        },
        ...options,
      }}
      {...props}
    />
  );
};
