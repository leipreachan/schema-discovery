import React, { useEffect, Suspense, useState } from "react";
import SchemaForm from "@/SchemaForm";
import { JsonSchema } from "./types";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { UploadSchema } from "./UploadSchema";
import usePersistState from "./hooks/use-persist-state";
import { UploadButton } from "./components/ui/upload-button";
import { ModeToggle } from "./components/mode-toggle";

const App: React.FC = () => {
  const [schema, setSchema] = usePersistState<JsonSchema | null>(
    null,
    "schemaData"
  );
  const [hideHeader, setHideHeader] = useState(false);

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

  const dropSchema = () => {
    setSchema(null);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="App">
        <Header
          text={hideHeader ? "" : "JSON Schema Discovery"}
          className={hideHeader
            ? " bg-gray-300 h-2 p-0"
            : "opacity-100"}
          setHideHeader={setHideHeader}
        >
          {hideHeader || (schema && <UploadButton onClick={dropSchema} className="mr-2" />)}
          {hideHeader || <ModeToggle className="float-right" />}
        </Header>
        <Suspense>
          {schema ? (
            <SchemaForm schema={schema} setHideHeader={setHideHeader} />
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
