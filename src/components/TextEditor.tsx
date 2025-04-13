import Editor from '@monaco-editor/react';
import React, { useState } from 'react';

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

  return (
    <>
      <div className={errMessage?.length > 0 ? "bg-red-100" : "bg-white-100"}>{errMessage}</div>
   
      <Editor
        className='w-full border-2'
        value={value}
        defaultLanguage='json'
        theme="github-light"
        onChange={onChangeHandler}
        {...props}
      />
    </>
  )
}

export default TextEditor;