import { FormFieldProps } from "@/types";
import Select from 'react-select'

const MultiSelectField: React.FC<FormFieldProps> = ({name, value, onChange, propertyEnum}) => {
    return (
        <Select
          className={(value?.length > 0 ? "bg-amber-100" : "")}
          id={name} 
          defaultValue={value || []}
          // onChange={onChange}
          isMulti={true}
          options={propertyEnum?.map(item => ({"value": item, "label": item}))}
        />
    )
}

export default MultiSelectField;