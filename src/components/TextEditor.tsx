import Editor, { useMonaco } from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import { useTheme } from './theme-provider';

const TextEditor = ({ value, onChange, ...props }) => {
  const [errMessage, setErrMessage] = useState<string>("");

  const onChangeHandler = React.useCallback((val: string) => {
    setErrMessage("");
    try {
      const newValue = JSON.parse(val);
      onChange(newValue);
    } catch (e) {
      setErrMessage(`${e}`);
    }
  }, [onChange]);

  const { theme } = useTheme();
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      if (theme === "dark") {
        monaco.editor.setTheme("vs-dark")
      } else {
        monaco.editor.setTheme("vs-light")
      }
    }
  }, [theme, monaco]);

  return (
    <>
      <div className={errMessage?.length > 0 ? "bg-red-100" : "bg-white-100"}>{errMessage}</div>

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

export default TextEditor;