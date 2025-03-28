import { Select, SelectContent, SelectItem } from "@/components/ui/select";

const SimpleSelectField: React.FC<FormFieldProps> = ({name, value, onChange, propertyEnum}) => {
    return (
        <Select
          className={(value ? "bg-amber-100" : "")}
          id={name} 
          value={value}
          onChange={onChange}
        >
          <SelectContent>
          {propertyEnum.map((option: string) => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
          </SelectContent>
      </Select>
    )
}

export default SimpleSelectField;