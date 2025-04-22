import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import { NULL_TEXT_VALUE } from "@/types";

export const TextEditor = ({ value, onChange, ...props }) => {
  const [textValue, setTextValue] = useState<string>("");
  const [errMessage, setErrMessage] = useState<string>("");
  const [editedLine, setEditedLine] = useState<number>();

  const { theme } = useTheme();
  const monaco = useMonaco();

  const onChangeHandler = (val: string) => {
    setErrMessage("");
    try {
      onChange("", JSON.parse(val));
    } catch (e) {
      setErrMessage(`${e}`);
    }
  };

  function removeEmptyValues(
    obj: object,
    andNodesToo: boolean = true
  ): FormData {
    const newObj = obj;
    // const newObj = JSON.parse(JSON.stringify(obj));

    const isObject = typeof newObj === "object";
    const isArray = Array.isArray(newObj);
    if ((isObject || isArray) && newObj !== null) {
      // Recursively process child nodes
      for (const key in newObj) {
        newObj[key] = removeEmptyValues(newObj[key], true);
        // Remove keys with empty objects or arrays
        if (
          newObj[key] == NULL_TEXT_VALUE ||
          newObj[key] == null ||
          (Array.isArray(newObj[key]) && newObj[key].length <= 0) ||
          (andNodesToo &&
            typeof newObj[key] === "object" &&
            Object.keys(newObj[key]).length === 0)
        ) {
          if (isArray) {
            newObj.splice(key, 1);
          } else {
          delete newObj[key];
          }
        }
      }
      // If the object is empty after processing, return {}
      // if (isObject && andNodesToo && Object.keys(newObj).length == 0) {
      //   return {};
      // }
      // if (isArray && andNodesToo && newObj.length == 0) {
      //   return [];
      // }
    }
    return newObj as FormData;
  }

  useEffect(() => {
    monaco?.editor.setTheme(theme === "dark" ? "vs-dark" : "vs-light");
  }, [theme, monaco]);

  useEffect(() => {
    const prevValue = textValue.split("\n");
    const newValue = JSON.stringify(removeEmptyValues(value), null, 4);
    setTextValue(newValue);

    const newValueAsArray = newValue.split("\n");
    for (let line = 0; line < newValueAsArray.length; line++) {
      if (
        prevValue[line] == undefined ||
        newValueAsArray[line] != prevValue[line]
      ) {
        setEditedLine(line);
        break;
      }
    }
  }, [value]);

  return (
    <>
      {errMessage && (
        <div className={"p-4 bg-red-100 dark:text-gray-900"}>{errMessage}</div>
      )}

      <Editor
        className="w-full border-2"
        line={editedLine}
        value={textValue}
        defaultLanguage="json"
        onChange={onChangeHandler}
        {...props}
      />
    </>
  );
};
