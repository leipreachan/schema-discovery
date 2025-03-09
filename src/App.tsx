import React, { useState, useEffect } from 'react';
import SchemaForm from './SchemaForm';
import { JsonSchema } from './types';

const App: React.FC = () => {
  const [schema, setSchema] = useState<JsonSchema | null>(null);

  useEffect(() => {
    fetch('/builder-template-schema.json')
      .then(response => response.json())
      .then((data: JsonSchema) => setSchema(data))
      .catch(error => console.error('Error loading schema:', error));
  }, []);

  return (
    <div className="App">
      <h1>JSON Schema Form Generator</h1>
      {schema && <SchemaForm schema={schema} />}
    </div>
  );
}

export default App;
