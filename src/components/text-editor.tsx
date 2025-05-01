import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import { NULL_TEXT_VALUE } from "@/types";
import useCustomMonaco from "@/hooks/use-custom-monaco";

//@ts-ignore
export const TextEditor = ({ value, onChange, ...props }) => {
  const [textValue, setTextValue] = useState<string>("");
  const [errMessage, setErrMessage] = useState<string>("");
  const [editedLine, setEditedLine] = useState<number>();

  const { theme } = useTheme();
  const monaco = useCustomMonaco();

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
        //@ts-ignore
        newObj[key] = removeEmptyValues(newObj[key], true);
        // Remove keys with empty objects or arrays
        if (
          //@ts-ignore
          newObj[key] == NULL_TEXT_VALUE ||
          //@ts-ignore
          newObj[key] == null ||
          //@ts-ignore
          (Array.isArray(newObj[key]) && newObj[key].length <= 0) ||
          (andNodesToo &&
            //@ts-ignore
            typeof newObj[key] === "object" &&
            //@ts-ignore
            Object.keys(newObj[key]).length === 0)
        ) {
          if (isArray) {
            //@ts-ignore
            newObj.splice(key, 1);
          } else {
            //@ts-ignore
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
        //@ts-ignore
        onChange={onChangeHandler}
        {...props}
      />
    </>
  );
};
