import React from 'react';
import DynamicFieldArray from '@/components/fields/DynamicFieldArray';
import { Input } from '@/components/ui/input';
import { FormFieldProps } from '@/types';
import Select from './Select';

const InputField: React.FC<FormFieldProps> = ({ name, onChange, value, pattern, type = "text", placeHolder = "" }) => {
    if (type == "boolean") {
        const allowedValues = ["false", "true"];
        return (
            <Select
                name={name}
                value={value}
                onChange={(e) => onChange({ target: { ...e.target, type: "boolean" } })}
                propertyEnum={allowedValues}
                multipleSelect={false}
            />
        );
    } else if (type == "array") {
        return (
            <DynamicFieldArray name={name} value={value} onChange={onChange} />
        )
    } else {
        return (
            <Input
                className={"bg-white" + (value ? "bg-amber-100" : "")}
                type={"text"}
                id={name}
                value={typeof value == "object" ? JSON.stringify(value) : value}
                onChange={onChange}
                pattern={pattern}
                placeholder={placeHolder}
            />
        )
    }
}

export default InputField;