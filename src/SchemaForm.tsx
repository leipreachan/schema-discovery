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

  function removeEmptyValues(obj: object, andNodesToo: boolean = true, unwrap: boolean = false): FormData {
    const newObj = unwrap ? JSON.parse(JSON.stringify(obj)) : obj;
    if (typeof newObj === 'object' && newObj !== null) {
      // Recursively process child nodes
      for (const key in newObj) {
        newObj[key] = removeEmptyValues(newObj[key]);
        // Remove keys with empty objects or arrays
        if (newObj[key] == "null"
          || newObj[key] == null
          || newObj[key] === ""
          || (Array.isArray(newObj[key]) && newObj[key].length <= 0)
          || (andNodesToo && typeof newObj[key] === 'object' && Object.keys(newObj[key]).length === 0)
        ) {
          delete newObj[key];
        }
      }
      // If the object is empty after processing, return {}
      if (andNodesToo && Object.keys(newObj).length === 0) {
        return {};
      }
    }
    return newObj as FormData;
  }

  const handleFormChange = (name: string, value: FormData) => {
    const newValue = name ? { ...formData, [name]: value } : { ...formData, ...value };
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
          value={JSON.stringify(removeEmptyValues(formData, true), null, 4)}
          onChange={handleFormChange}
        />
      </div>
    </div>
  );
}

export default SchemaForm;