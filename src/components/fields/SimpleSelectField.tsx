import { Select, SelectContent, SelectItem } from "@/components/ui/select";

const SelectField: React.FC<FormFieldProps> = ({name, value, onChange, propertyEnum, multipleSelect}) => {
    return (
        <Select
          className={(value ? "bg-amber-100" : "")}
          id={name} 
          value={multipleSelect ? (value || []) : value }
          onChange={onChange}
          multiple={multipleSelect}
        >
          <SelectContent>
          {propertyEnum.map((option: string) => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
          </SelectContent>
      </Select>
    )
}

export default SelectField;