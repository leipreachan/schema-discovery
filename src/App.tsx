import React, { useState, useEffect } from 'react';
import SchemaForm from './SchemaForm';
import { JsonSchema } from './types';

const App: React.FC = () => {
  const [schema, setSchema] = useState<JsonSchema | null>(null);

  const schemaPath = `/schema/${import.meta.env.VITE_SCHEMA_NAME}`;
  useEffect(() => {
    fetch(schemaPath)
      .then(response => response.json())
      .then((data: JsonSchema) => setSchema(data))
      .catch(error => console.error('Error loading schema:', error));
  }, [schemaPath]);

  return (
    <div className="App">
      <h1 className='text-2xl mb-2'>JSON Schema Discovery</h1>
      {schema && <SchemaForm schema={schema} />}
      <div className="mt-6 text-xs text-right">made by <a href="https://github.com/leipreachan/schema-discovery" target="_blank">@leipreachan</a>, 2025</div>
    </div>
  );
}

export default App;
