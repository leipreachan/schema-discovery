// SchemaForm.tsx
import React, { useEffect, useState } from 'react';
import FormField from '@/components/fields/FormField';
import { JsonSchema, FormData, JsonSchemaProperty } from '@/types';
import TextEditor from '@/components/TextEditor';
import usePersistState from '@/lib/usePersistStateHook';

interface SchemaFormProps {
  schema: JsonSchema;
}

const SchemaForm: React.FC<SchemaFormProps> = ({ schema }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [editorData, setEditorData] = usePersistState<FormData>({}, 'editorData');

  function removeEmptyValues(obj: object, andNodesToo: boolean = true): FormData {
    const newObj =  JSON.parse(JSON.stringify(obj)) ;
    if (typeof newObj === 'object' && newObj !== null) {
      // Recursively process child nodes
      for (const key in newObj) {
        newObj[key] = removeEmptyValues(newObj[key]);
        // Remove keys with empty objects or arrays
        if (newObj[key] == "null"
          || newObj[key] == null
          || newObj[key] == ""
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

  const handleEditorChange = (value) => {
    setEditorData(value);
    setFormData(value);
  }

  // load data when opening page
  useEffect(() => {
    setFormData(editorData);
  }, []);

  useEffect(() => {
    setEditorData(removeEmptyValues(formData));
  }, [formData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className='col-span-1 h-screen overflow-y-scroll p-1 pl-4'>
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
      <div className='top-0 col-span-1 p-1'>
        <TextEditor
          className='w-full border-2'
          value={JSON.stringify(editorData, null, 4)}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
}

export default SchemaForm;