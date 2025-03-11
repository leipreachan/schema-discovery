// SchemaForm.tsx
import React, { useState } from 'react';
import FormField from './FormField';
import { JsonSchema, FormData } from './types';

interface SchemaFormProps {
  schema: JsonSchema;
}

const SchemaForm: React.FC<SchemaFormProps> = ({ schema }) => {
  const [formData, setFormData] = useState<FormData>({});

  const chop = (obj) => {
    const keyBlacklist = ['_id', '__v'];

    const res = JSON.stringify(obj, function chopChop(key, value) {
      if (keyBlacklist.indexOf(key) > -1) {
        return undefined;
      }

      // this here checks against the array, but also for undefined
      // and empty array as value
      if (value === null || value === undefined || value.length <= 0) {
        return undefined;
      }
      return value;
    })
    return res != undefined ? JSON.parse(res) : "";
  }

  const handleChange = (name: string, value: string | number | Array) => {
    value = chop(value);
    console.log(value);
    if (`${value}`.length <= 0 || `${value}` == '{}') {
      delete formData[name];
      setFormData({...formData});
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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
        <textarea className='w-full border-1 h-full p-2 border-gray-300' value={JSON.stringify(formData, null, 3)} />
      </div>
    </div>
  );
}

export default SchemaForm;