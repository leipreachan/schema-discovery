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

  function removeEmptyNodes(obj: object): object|null {
    if (typeof obj === 'object' && obj !== null) {
        // Recursively process child nodes
        for (const key in obj) {
            obj[key] = removeEmptyNodes(obj[key]);
            // Remove keys with empty objects or arrays
            if (obj[key] == null || obj[key].length <=0 ||(typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0)) {
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

  const handleChange = (name: string, value: string | number | Array) => {
    const whiteListedKeys = ["agents", "scenarios"];
    const newValue = { ...formData, [name]: value };
    const cleanedValue = whiteListedKeys.includes(name) ? newValue : removeEmptyNodes(newValue);
    // const cleanedValue = removeEmptyNodes({ ...formData, [name]: value });
    setFormData(cleanedValue as FormData);
    setTextFieldData(JSON.stringify(cleanedValue, null, 4));
  };

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setTextFieldData(newValue);
    try {
      const newState = JSON.parse(newValue);
      setFormData(newState);
    } finally {
      //
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
  };

  return (
    <div className="grid grid-cols-2">
      <div className='col-span-1'>
        <form onSubmit={handleSubmit}>
          {Object.entries(schema.properties).map(([name, property]) => (
            <FormField
              key={name}
              name={name}
              property={property}
              value={formData[name] || ''}
              onChange={handleChange}
              schema={schema}
            />
          ))}
          {/* <button type="submit">Submit</button> */}
        </form>
      </div>
      <div className='sticky h-screen pl-2 pr-3 top-0 col-span-1'>
        <textarea className='w-full border-1 h-full p-2 border-gray-300' value={textFieldData} onChange={handleTextChange}/>
      </div>
    </div>
  );
}

export default SchemaForm;