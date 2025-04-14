import Editor, { useMonaco } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useTheme } from './theme-provider';

export const TextEditor = ({ value, onChange, ...props }) => {
  const [errMessage, setErrMessage] = useState<string>("");

  const onChangeHandler = (val: string) => {
    setErrMessage("");
    try {
      onChange("", JSON.parse(val));
    } catch (e) {
      setErrMessage(`${e}`);
    }
  };

  const { theme } = useTheme();
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs-light");
    }
  }, [theme, monaco]);

  return (
    <>
      {
        errMessage && (
          <div className={"p-4 bg-red-100 dark:text-gray-900"}>{errMessage}</div>
        )
      }

      <Editor
        className='w-full border-2'
        value={value}
        defaultLanguage='json'
        onChange={onChangeHandler}
        {...props}
      />
    </>
  )
}
