import React, { useState, useEffect, Suspense } from "react";
import SchemaForm from "@/SchemaForm";
import { JsonSchema } from "./types";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { UploadSchema } from "./UploadSchema";

const App: React.FC = () => {
  const [schema, setSchema] = useState<JsonSchema | null>(null);
  // const [loading, setLoading] = useState<string>(true);

  useEffect(() => {
    const schemaPath = `${import.meta.env.VITE_SCHEMA_NAME}`;
    fetch(schemaPath)
      .then((response) => response.json())
      .then((data: JsonSchema) => setSchema(data))
      .catch((error) => console.error("Error loading schema:", error));
  }, []);

  const uploadHandler = (file: string | ArrayBuffer | null) => {
    if (typeof file == "string") {
      setSchema(JSON.parse(file));
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="App">
        <Header />
        <Suspense>
          {schema ? (
            <SchemaForm schema={schema} />
          ) : (
            <UploadSchema onUpload={uploadHandler} />
          )}
        </Suspense>
        <div className="mt-6 text-xs text-right">
          made by{" "}
          <a
            href="https://github.com/leipreachan/schema-discovery"
            target="_blank"
          >
            @leipreachan
          </a>
          , 2025
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
