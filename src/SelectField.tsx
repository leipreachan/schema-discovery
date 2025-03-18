import { Select } from "./components/ui/select";

const SelectField: React.FC<FormFieldProps> = ({name, value, onChange, propertyEnum, multipleSelect}) => {
    return (
        <Select
          className={(value ? "bg-amber-100" : "")}
          id={name} 
          value={multipleSelect ? (value || []) : value }
          onChange={onChange}
          multiple={multipleSelect}
        >
          {propertyEnum.map((option: string) => (
            <option key={option} value={option}>{option}</option>
          ))}
      </Select>
    )
}

export default SelectField;