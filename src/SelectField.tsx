const SelectField: React.FC<FormFieldProps> = ({name, value, onChange, propertyEnum, multipleSelect}) => {
    return (
        <select
          className="m-1 p-1 border-1 border-gray-300 rounded-sm"
          multiple={multipleSelect}
          id={name} 
          value={multipleSelect ? null : value }
          onChange={onChange}
        >
          {propertyEnum.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
      </select>
    )
}

export default SelectField;