// SchemaForm.tsx
import React from "react";
import { JsonSchema, FormData } from "@/types";
import { TextEditorPane } from "@/components/text-editor";
import usePersistState from "@/hooks/use-persist-state";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FormFieldPane } from "./components/FormFieldPane";

interface SchemaFormProps {
  schema: JsonSchema;
  setHideHeader: (arg0: boolean) => void;
}

const SchemaForm: React.FC<SchemaFormProps> = ({ schema, setHideHeader }) => {
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
      <ResizablePanel defaultSize={50}>
        <FormFieldPane
          formData={formData}
          //@ts-ignore
          onChange={handleFormChange}
          schema={schema}
          setHideHeader={setHideHeader}
        />
      </ResizablePanel>
      <ResizableHandle className="w-0.5 bg-blue-100" />
      <ResizablePanel defaultSize={50}>
        <TextEditorPane value={formData} onChange={handleFormChange} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default SchemaForm;
