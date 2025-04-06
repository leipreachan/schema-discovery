import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import React, { useState } from 'react';

const TextEditor = ({ value, onChange, ...props }) => {
  const [errMessage, setErrMessage] = useState<string>("");
  // const [textFieldData, setTextFieldData] = useState<string>(value);

  const onChangeHandler = React.useCallback((val: string, viewUpdate) => {
    // setTextFieldData(val);
    setErrMessage("");
    try {
      const newValue = JSON.parse(val);
      console.log("redraw?");
      onChange(newValue);
    } catch (e) {
      setErrMessage(`${e}`);
    }
  }, [onChange]);

  return (
    <>
      <div className={errMessage?.length > 0 ? "bg-red-100" : "bg-white-100"}>{errMessage}</div>
      <CodeMirror
        className='w-full h-screen border-2'
        value={value}
        theme={githubLight}
        extensions={[javascript()]}
        onChange={onChangeHandler}
        {...props}
      />
    </>
  )
}

export default TextEditor;