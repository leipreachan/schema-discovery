// SchemaForm.tsx
import React from 'react';
import FormField from '@/components/fields/FormField';
import { JsonSchema, FormData, JsonSchemaProperty } from '@/types';
import { TextEditor } from '@/components/text-editor';
import usePersistState from '@/lib/usePersistStateHook';

interface SchemaFormProps {
  schema: JsonSchema;
}

const SchemaForm: React.FC<SchemaFormProps> = ({ schema }) => {
  const [formData, setFormData] = usePersistState<FormData>({}, 'formData');

  const handleFormChange = (name: string, value: FormData) => {
    const newValue = name ? { ...formData, [name]: value } : { ...value };
    setFormData(newValue as FormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid h-screen grid-cols-2 dark:bg-zinc-800">
      <div className='h-screen p-1 overflow-y-scroll'>
        <form onSubmit={handleSubmit}>
          <FormField
            title={""}
            name={""}
            property={schema as JsonSchemaProperty}
            value={formData}
            onChange={handleFormChange}
            schema={schema}
          />
        </form>
      </div>
      <div className='top-0 h-screen p-1'>
        <TextEditor
          value={formData}
          onChange={handleFormChange}
        />
      </div>
    </div>
  );
}

export default SchemaForm;