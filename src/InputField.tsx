import React from 'react';

const InputField: React.FC<FormFieldProps> = ({name, onChange, value, pattern, type = "text", placeHolder = ""}) => {
    return (
        <input
            className="m-1 p-1 border-1 border-gray-300 rounded-sm"
            type={type}
            id={name}
            value={value}
            onChange={onChange}
            pattern={pattern}
            placeholder={placeHolder}
      />
    )
}

export default InputField;