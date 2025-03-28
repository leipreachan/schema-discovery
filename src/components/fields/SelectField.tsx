import { FormFieldProps } from "@/types";
import MultiSelectField from "./MultiSelectField";
import SimpleSelectField from "./SimpleSelectField";

const SelectField: React.FC<FormFieldProps> = ({name, value, onChange, propertyEnum, multipleSelect}) => {
    return multipleSelect ? (
        <MultiSelectField
            name={name}
            value={value || []}
            onChange={onChange}
            propertyEnum={propertyEnum}
          />
    ) : (
        <SimpleSelectField
            name={name}
            value={value}
            onChange={onChange}
            propertyEnum={propertyEnum}
        />
    ) 
}

export default SelectField;