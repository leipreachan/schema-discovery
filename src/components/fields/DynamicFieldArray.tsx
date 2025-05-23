import { useEffect, useState } from "react";
import FormField from "@/components/fields/FormField";
import { CustomButton as Button } from "@/components/ui/custom-button";
import { FormFieldProps, FormValue, NULL_TEXT_VALUE } from "@/types";

const DynamicFieldArray: React.FC<FormFieldProps> = ({
  name,
  value,
  onChange,
}) => {
  const [fields, setFields] = useState([] as string[]);

  useEffect(() => {
    setFields(value as string[]);
  }, [value]);

  const globalHandler = (values: string[]) => {
    //@ts-expect-error
    onChange(values);
  };

  // Handle value update
  const handleChange = (fieldNumberAsString: string, fieldValue: FormValue) => {
    const newFields = fields;
    newFields[Number.parseInt(fieldNumberAsString)] = String(fieldValue);
    setFields(newFields);
    globalHandler(newFields);
  };

  // Add new field
  const handleAdd = () => {
    const newFields = [...fields, ''];
    setFields(newFields);
    globalHandler(newFields);
  };

  // Remove field
  const handleRemove = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    globalHandler(newFields);
  };

  const arraySchema = { type: "text" };

  return (
    <>
      {fields.length > 0 &&
        Array.from(fields).map((field, index) => (
          <div key={index} className="flex items-center mb-2">
            <FormField
              key={`${name}_${index}`}
              title={null}
              name={`${index}`}
              value={`${field == null ? NULL_TEXT_VALUE : field}`}
              onChange={handleChange}
              property={arraySchema}
              schema={arraySchema}
            />
            <Button onClick={() => handleRemove(index)}>X</Button>
          </div>
        ))}
      <div className="text-right">
        <Button onClick={handleAdd}>+</Button>
      </div>
    </>
  );
};

export default DynamicFieldArray;
