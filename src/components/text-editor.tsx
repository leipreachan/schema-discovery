import Editor, { useMonaco } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useTheme } from './theme-provider';
import { NULL_TEXT_VALUE } from '@/types';

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

  function removeEmptyValues(obj: object, andNodesToo: boolean = true): FormData {
    const newObj = JSON.parse(JSON.stringify(obj));
    if (typeof newObj === 'object' && newObj !== null) {
      // Recursively process child nodes
      for (const key in newObj) {
        newObj[key] = removeEmptyValues(newObj[key]);
        // Remove keys with empty objects or arrays
        if (newObj[key] == NULL_TEXT_VALUE
          || newObj[key] == null
          || (Array.isArray(newObj[key]) && newObj[key].length <= 0)
          || (andNodesToo && typeof newObj[key] === 'object' && Object.keys(newObj[key]).length === 0)
        ) {
          delete newObj[key];
        }
      }
      // If the object is empty after processing, return {}
      if (andNodesToo && Object.keys(newObj).length === 0) {
        return {};
      }
    }
    return newObj as FormData;
  }

  const { theme } = useTheme();
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs-light");
    }
  }, [theme, monaco]);

  const textValue = JSON.stringify(removeEmptyValues(value), null, 4);

  return (
    <>
      {
        errMessage && (
          <div className={"p-4 bg-red-100 dark:text-gray-900"}>{errMessage}</div>
        )
      }

      <Editor
        className='w-full border-2'
        value={textValue}
        defaultLanguage='json'
        onChange={onChangeHandler}
        {...props}
      />
    </>
  )
}
