import { MouseEventHandler } from "react";
import { Button } from "../ui/button";
import FormField from "./FormField";
import {
  FormValue,
  JsonSchema,
  JsonSchemaProperty,
  ObjectValue,
} from "@/types";

interface FormFieldListProps {
  properties: Record<string, JsonSchemaProperty> | ObjectValue;
  fieldName: string;
  objectValue: ObjectValue;
  schema: JsonSchema | undefined;
  requiredPropertiesList: string[];
  onChange: (name: string, value: FormValue) => void;
  fieldValue: (arg0: {
    objectValue: Record<string, FormValue>;
    name: string;
    value: FormValue;
  }) => FormValue;
  fieldProperty?: JsonSchemaProperty;
  deleteHandler?: (
    arg0: string
  ) => MouseEventHandler<HTMLButtonElement> | undefined;
}
export const FormFieldList = ({
  properties,
  fieldName,
  objectValue,
  schema,
  requiredPropertiesList,
  onChange,
  fieldValue,
  fieldProperty,
  deleteHandler,
}: FormFieldListProps) => {
  const dotName = fieldName ? fieldName + "." : "";
  return Object.entries(properties).map(
    ([subName, subProperty]: [string, FormValue]) => {
      const key = `${dotName}${subName}`;

      const props = {
        title: key,
        name: key,
        property: (fieldProperty || subProperty) as JsonSchemaProperty,
        value: fieldValue({ objectValue, name: subName, value: subProperty }),
        schema,
        isRequired: requiredPropertiesList.includes(subName),
      };

      return (
        <span key={key}>
          {deleteHandler && (
            <Button onClick={deleteHandler(subName)}>Delete {key}</Button>
          )}
          <FormField
            {...props}
            onChange={(_, subValue) => {
              const newValue: ObjectValue = {
                ...objectValue,
                [subName]: subValue,
              };
              onChange(fieldName, newValue);
            }}
          />
        </span>
      );
    }
  );
};
