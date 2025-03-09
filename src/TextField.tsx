import React from 'react';

const TextField: React.FC<FormFieldProps> = ({name, onChange, value, pattern, placeHolder = ""}) => {
    return (
        <input
            className="m-1 p-1 border-1 border-gray-300 rounded-sm"
            type="text"
            id={name}
            value={value}
            onChange={onChange}
            pattern={pattern}
            placeholder={placeHolder}
      />
    )
}

export default TextField;