// SchemaForm.tsx
import React from "react";
import FormField from "@/components/fields/FormField";
import { JsonSchema, FormData, JsonSchemaProperty } from "@/types";
import { TextEditor } from "@/components/text-editor";
import usePersistState from "@/lib/usePersistStateHook";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface SchemaFormProps {
  schema: JsonSchema;
}

const SchemaForm: React.FC<SchemaFormProps> = ({ schema }) => {
  const [formData, setFormData] = usePersistState<FormData>({}, "formData");

  const handleFormChange = (name: string, value: FormData) => {
    const newValue = name ? { ...formData, [name]: value } : { ...value };
    setFormData(newValue as FormData);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen dark:bg-zinc-800"
    >
      <ResizablePanel defaultSize={50} style={{overflow: "auto"}} className="h-screen">
        <div className="h-screen">
          <FormField
            title={""}
            name={""}
            property={schema as JsonSchemaProperty}
            value={formData}
            //@ts-ignore
            onChange={handleFormChange}
            schema={schema}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle className="w-0.5 bg-blue-100" />
      <ResizablePanel defaultSize={50}>
        <TextEditor value={formData} onChange={handleFormChange} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default SchemaForm;
