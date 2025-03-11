import React from 'react';

const InputField: React.FC<FormFieldProps> = ({ name, onChange, value, pattern, type = "text", placeHolder = "" }) => {
    if (type == "radio") {
        return [null, false, true].map((itemValue) =>
            <div key={`${name}_${itemValue}`}>
                <label key={`${name}_${itemValue}`}>
                    {JSON.stringify(itemValue)}
                    <input
                        key={`${name}_${itemValue}`}
                        className="m-1 p-1 border-1 border-gray-300 rounded-sm"
                        type={type}
                        id={name}
                        name={value}
                        value={JSON.stringify(itemValue)}
                        onChange={onChange}
                        pattern={pattern}
                        placeholder={placeHolder}
                    />
                </label>
            </div>
        );
    } else {
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
}

export default InputField;