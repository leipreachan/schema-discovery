import { Button } from "../ui/button";
import FormField from "./FormField";
import { ObjectValue } from "@/types";

export const FormFieldList = (props) => {
  const {
    properties,
    fieldName,
    objectValue,
    schema,
    requiredPropertiesList,
    onChange,
    fieldValue,
    fieldProperty,
    deleteHandler,
  } = { ...props };
  const dotName = fieldName ? fieldName + "." : "";
  return Object.entries(properties).map(
    ([subName, subProperty]: [string, unknown]) => {
      const key = `${dotName}${subName}`;

      const props = {
        title: key,
        name: key,
        property: fieldProperty || subProperty,
        value: fieldValue(objectValue, subName, subProperty),
        schema,
        isRequired: requiredPropertiesList.includes(subName),
      };

      return (
        <span key={key}>
          {deleteHandler && (
            <Button
              onClick={deleteHandler(subName)}
            >
              Delete {key}
            </Button>
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
