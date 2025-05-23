import { useEffect, useState } from "react";
import { FormFieldProps } from "@/types";
import { Input } from "@/components/ui/input";
import { CustomButton as Button } from "@/components/ui/custom-button";

interface KV {
  key: string;
  value: string;
}

const DynamicFieldObject: React.FC<FormFieldProps> = ({ name, value, onChange }) => {
  const [fields, setFields] = useState([{ key: "", value: "" }]);

  useEffect(() => {
    setFields(Object.entries(value).map(([keyVal, valVal]) => ({ key: keyVal, value: valVal })));
  }, [value])

  const globalHandler = (values: KV[]) => {
    let newObject = {};
    for (let i = 0; i < values.length; i++) {
      newObject = { ...newObject, [values[i].key]: values[i].value }
    }

    //@ts-expect-error
    onChange(newObject);
  }

  const handleKeyChange = (index: number) => (e: {target: {value: string}}) => {
    const newFields: KV[] = fields as KV[];
    const key = e.target.value;
    const value = newFields[index].value;
    newFields[index] = { key, value };
    setFields(newFields);
    globalHandler(newFields);
  }

  // Handle value update
  const handleValueChange = (index: number) => (e: {target: {value: string}}) => {
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
  const handleRemove = (index: number) => {
    const newFields = Array.from(fields).filter((_, i) => i !== index);
    setFields(newFields);
    globalHandler(newFields);
  };

  return (
    <>
      {fields.map(({ key, value }, index) => (
        <div key={index} className="flex items-center mb-2">
          <Input
            type={"text"}
            id={name}
            value={key}
            onChange={handleKeyChange(index)}
            placeholder={"name"}
          /> :
          <Input
            type={"text"} 
            id={name}
            value={value}
            onChange={handleValueChange(index)}
            placeholder={"value"}
          />
          <Button
            onClick={() => handleRemove(index)}
            className="ml-1"
          >
            X
          </Button>
        </div>
      ))}
      <div className="text-right">
        <Button
          onClick={handleAdd} >+</Button>
      </div>
    </>
  );
}

export default DynamicFieldObject;