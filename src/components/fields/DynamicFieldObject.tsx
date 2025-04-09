import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormFieldProps } from "@/types";
import { Input } from "../ui/input";

interface KV {
  key: string;
  value: string;
}

const DynamicFieldObject: React.FC<FormFieldProps> = ({ name, value, onChange }) => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    setFields(Object.entries(value).map(([keyVal, valVal]) => ({ key: keyVal, value: valVal })));
  }, [value])

  const globalHandler = (values: KV[]) => {
    let newObject = {};
    for (let i = 0; i < values.length; i++) {
      newObject = { ...newObject, [values[i].key]: values[i].value }
    }

    onChange(newObject);
  }

  const handleKeyChange = (index) => (e) => {
    const newFields: KV[] = fields as KV[];
    const key = e.target.value;
    const value = newFields[index].value;
    newFields[index] = { key, value };
    setFields(newFields);
    globalHandler(newFields);
  }

  // Handle value update
  const handleValueChange = (index) => (e) => {
    const newFields: KV[] = fields as KV[];
    const key = fields[index].key;
    const value = e.target.value;
    newFields[index] = { key, value };
    setFields(newFields);
    globalHandler(newFields);
  };

  // Add new field
  const handleAdd = () => {
    const newFields = [...fields, { key: "", value: "" }];
    setFields(newFields);
    globalHandler(newFields);
  };

  // Remove field
  const handleRemove = (index) => {
    const newFields = Array.from(fields).filter((_, i) => i !== index);
    setFields(newFields);
    globalHandler(newFields);
  };

  return (
    <>
      {fields.map(({ key, value }, index) => (
        <div key={index} className="flex items-center mb-2">
          <Input
            className={"bg-white" + (value ? "bg-amber-100" : "")}
            type={"text"}
            id={name}
            value={key}
            onChange={handleKeyChange(index)}
            placeholder={"name"}
          /> :
          <Input
            className={"bg-white" + (value ? "bg-amber-100" : "")}
            type={"text"}
            id={name}
            value={value}
            onChange={handleValueChange(index)}
            placeholder={"value"}
          />
          <Button
            type="button"
            onClick={() => handleRemove(index)}
          >
            X
          </Button>
        </div>
      ))}
      <div className="text-right">
        <Button type="button" onClick={handleAdd} >+</Button>
      </div>
    </>
  );
}

export default DynamicFieldObject;