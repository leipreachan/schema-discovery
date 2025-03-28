import { FormFieldProps } from "@/types";

const MultiSelectField: React.FC<FormFieldProps> = ({name, value, onChange, propertyEnum}) => {
    return (
        <select
          className={(value?.length > 0 ? "bg-amber-100" : "")}
          id={name} 
          value={value || []}
          onChange={onChange}
          multiple={true}
        >
          {propertyEnum.map((option: string) => (
            <option key={option} value={option}>{option}</option>
          ))}
      </select>
    )
}

export default MultiSelectField;