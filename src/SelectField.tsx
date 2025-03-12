const SelectField: React.FC<FormFieldProps> = ({name, value, onChange, propertyEnum, multipleSelect}) => {
    return (
        <select
          className={"m-1 p-1 border-1 border-gray-300 rounded-sm " + (value ? "bg-amber-100" : "")}
          id={name} 
          value={multipleSelect ? (value || []) : value }
          onChange={onChange}
          multiple={multipleSelect}
        >
          {propertyEnum.map((option: string) => (
            <option key={option} value={option}>{option}</option>
          ))}
      </select>
    )
}

export default SelectField;