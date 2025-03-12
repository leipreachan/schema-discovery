import React from 'react';
import DynamicFieldArray from './DynamicFieldArray';

const InputField: React.FC<FormFieldProps> = ({ name, onChange, value, pattern, type = "text", placeHolder = "" }) => {
    if (type == "boolean") {
        const fieldType = "radio";
        return [null, false, true].map((itemValue) =>
            <div key={`${name}_${itemValue}`}>
                <label key={`${name}_${itemValue}`}>
                    {JSON.stringify(itemValue)}
                    <input
                        key={`${name}_${itemValue}`}
                        className="m-1 p-1 border-1 border-gray-300 rounded-sm"
                        type={fieldType}
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
    } else if (type == "array" ) {
        return (
            <DynamicFieldArray name={name} value={value} onChange={onChange}/>
        )
    } else {
        const fieldType = "text";
        return (
            <input
                className={"m-1 p-1 border-1 border-gray-300 rounded-sm " + (value  ? "bg-amber-100" : "")}
                type={fieldType}
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