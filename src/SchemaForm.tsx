// SchemaForm.tsx
import React, { useState } from 'react';
import FormField from './FormField';
import { JsonSchema, FormData } from './types';

interface SchemaFormProps {
  schema: JsonSchema;
}

const SchemaForm: React.FC<SchemaFormProps> = ({ schema }) => {
  const [formData, setFormData] = useState<FormData>({});

  const handleChange = (name: string, value: string | number) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
  };

  return (
    <form onSubmit={handleSubmit} className='pl-8'>
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
  );
}

export default SchemaForm;