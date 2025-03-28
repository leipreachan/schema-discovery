import { FormFieldProps } from "@/types";
import MultiSelectField from "./MultiSelectField";
import SimpleSelectField from "./SimpleSelectField";

const SelectField: React.FC<FormFieldProps> = ({name, value, onChange, propertyEnum, multipleSelect}) => {
    return multipleSelect ? (
        <MultiSelectField
          className={(value ? "bg-amber-100" : "")}
          id={name} 
          value={value || []}
          onChange={onChange}
          />
    ) : (
        <SimpleSelectField
            className={(value ? "bg-amber-100" : "")}
            id={name} 
            value={value}
            onChange={onChange}
        />
    ) 
}

export default SelectField;