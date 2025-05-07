import { useScrollDirection } from "@/hooks/use-scroll-direction";
import FormField from "./fields/FormField";
import { FormValue, JsonSchema, JsonSchemaProperty } from "@/types";
import { useRef } from "react";

interface SchemaFormProps {
  formData: FormValue;
  schema: JsonSchema;
  onChange: (name: string, value: FormData) => void;
  setHideHeader: unknown;
}

export const FormFieldPane: React.FC<SchemaFormProps> = ({formData, onChange, schema, setHideHeader}) => {
  const scrollRef = useRef(null);

  useScrollDirection(scrollRef, (dir) => {
    setHideHeader(dir === "down");
  });
  
  return (
    <div className="h-screen overflow-y-scroll" ref={scrollRef}>
      <FormField
        title={""}
        name={""}
        property={schema as JsonSchemaProperty}
        value={formData}
        //@ts-ignore
        onChange={onChange}
        schema={schema}
      />
    </div>
  );
};
