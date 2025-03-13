// SchemaForm.tsx
import React, { useState } from 'react';
import FormField from './FormField';
import { JsonSchema, FormData } from './types';

interface SchemaFormProps {
  schema: JsonSchema;
}

const SchemaForm: React.FC<SchemaFormProps> = ({ schema }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [textFieldData, setTextFieldData] = useState<string>("{}");
  const [errMessage, setErrMessage] = useState<string>("");

  function removeEmptyValues(obj: object, andNodesToo: boolean = false): object|null {
    if (typeof obj === 'object' && obj !== null) {
        // Recursively process child nodes
        for (const key in obj) {
            obj[key] = removeEmptyValues(obj[key]);
            // Remove keys with empty objects or arrays
            if (obj[key] === "null" 
              || obj[key] === null 
              || obj[key].length <=0
              || (andNodesToo && typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0)
             ) {
                delete obj[key];
            }
        }
        // If the object is empty after processing, return null
        if (andNodesToo && Object.keys(obj).length === 0) {
            return null;
        }
    }
    return obj;
}

  function removeEmptyNodes(obj: object): object|null {
    if (typeof obj === 'object' && obj !== null) {
        // Recursively process child nodes
        for (const key in obj) {
            obj[key] = removeEmptyNodes(obj[key]);
            // Remove keys with empty objects or arrays
            if (obj[key] === false) {
              continue;
            }
            if (obj[key] === "null" 
              || obj[key] === null 
              || obj[key].length <=0 
              ||(typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0)) {
                delete obj[key];
            }
        }
        // If the object is empty after processing, return null
        if (Object.keys(obj).length === 0) {
            return null;
        }
    }
    return obj;
}

  const handleChange = (name: string, value: string | number | boolean | Array) => {
    const whiteListedKeys = ["agents", "scenarios"];
    const newValue = { ...formData, [name]: value };
    console.log(name, newValue);
    const cleanedValue = removeEmptyValues(newValue, whiteListedKeys.includes(name)) || {};
    // const cleanedValue = removeEmptyNodes({ ...formData, [name]: value });
    setFormData(cleanedValue as FormData);
    setTextFieldData(JSON.stringify(cleanedValue, null, 4));
  };

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setTextFieldData(newValue);
    setErrMessage("");
    try {
      setFormData(JSON.parse(newValue));
    } catch (e) {
      setErrMessage(`${e}`);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className='col-span-1 h-screen overflow-y-scroll'>
        <form onSubmit={handleSubmit}>
          {Object.entries(schema.properties).map(([name, property]) => (
            <FormField
              key={name}
              name={name}
              property={property}
              value={(formData[name] || formData[name] == false) ? formData[name] : ''}
              onChange={handleChange}
              schema={schema}
            />
          ))}
          {/* <button type="submit">Submit</button> */}
        </form>
      </div>
      <div className='p-3 top-0 col-span-1'>
        <div className={errMessage?.length > 0 ? "bg-red-100": "bg-white-100"}>{errMessage}</div>
        <textarea className='w-full h-screen border-1 p-2 border-gray-300' value={textFieldData} onChange={handleTextChange}/>
      </div>
    </div>
  );
}

export default SchemaForm;