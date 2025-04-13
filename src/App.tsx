import React, { useState, useEffect } from 'react';
import SchemaForm from './SchemaForm';
import { JsonSchema } from './types';
import { ThemeProvider } from './components/theme-provider';
import { Header } from './components/Header';

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
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="App">
        <Header />
        {schema && <SchemaForm schema={schema} />}
        <div className="mt-6 text-xs text-right">made by <a href="https://github.com/leipreachan/schema-discovery" target="_blank">@leipreachan</a>, 2025</div>
      </div>
    </ThemeProvider>
  );
}

export default App;
