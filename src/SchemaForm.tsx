// SchemaForm.tsx
import React from 'react';
import FormField from '@/components/fields/FormField';
import { JsonSchema, FormData } from '@/types';
import TextEditor from '@/components/TextEditor';
import usePersistState from '@/lib/usePersistStateHook';

interface SchemaFormProps {
  schema: JsonSchema;
}

const SchemaForm: React.FC<SchemaFormProps> = ({ schema }) => {
  const [formData, setFormData] = usePersistState<FormData>({}, 'formData');

  function removeEmptyValues(obj: object, andNodesToo: boolean = false): object | null {
    if (typeof obj === 'object' && obj !== null) {
      // Recursively process child nodes
      for (const key in obj) {
        obj[key] = removeEmptyValues(obj[key]);
        // Remove keys with empty objects or arrays
        if (obj[key] == "null"
          || obj[key] == null
          || obj[key] == ""
          || (Array.isArray(obj[key]) && obj[key].length <= 0)
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

  const handleChange = (name: string, value: string | number | boolean | string[] | number[]) => {
    const whiteListedKeys = ["agents", "scenarios"];
    const newValue = { ...formData, [name]: value };
    const cleanedValue = removeEmptyValues(newValue, whiteListedKeys.includes(name)) || {};
    setFormData(cleanedValue as FormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className='col-span-1 h-screen overflow-y-scroll p-1 pl-4'>
        <form onSubmit={handleSubmit}>
          {Object.entries(schema.properties).map(([name, property]) => (
            <FormField
              key={name}
              title={name}
              name={name}
              property={property}
              value={(formData[name] || formData[name] == false) ? formData[name] : ''}
              onChange={handleChange}
              schema={schema}
            />
          ))}
        </form>
      </div>
      <div className='top-0 col-span-1 p-1'>
        <TextEditor 
          className='w-full h-screen border-2'
          value={JSON.stringify(formData, null, 4)} 
          onChange={setFormData}
        />
      </div>
    </div>
  );
}

export default SchemaForm;