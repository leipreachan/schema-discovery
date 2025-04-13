import React from 'react';
import DynamicFieldArray from '@/components/fields/DynamicFieldArray';
import { Input } from '@/components/ui/input';
import { FormFieldProps } from '@/types';
import Select from '../ui/custom-select';
import DynamicFieldObject from './DynamicFieldObject';

const InputField: React.FC<FormFieldProps> = ({ name, onChange, value, pattern, type, placeHolder = "" }) => {
    if (type == "boolean") {
        const allowedValues = ["false", "true"];
        return (
            <Select
                name={name}
                value={value === "" ? null : (value ? "true" : "false")}
                onChange={(e) => onChange(e === undefined ? null : e === "true")}
                propertyEnum={allowedValues}
                multipleSelect={false}
            />
        );
    } else if (type == "array") {
        return (
            <DynamicFieldArray name={name} value={value} onChange={onChange} />
        )
    } else if (type == "object") {
        return (
            <DynamicFieldObject name={name} value={value} onChange={onChange} />
        )
    } else {
        let regexPattern = "";
        if (pattern != undefined) {
            try {
                new RegExp(pattern as string);
                regexPattern = pattern;
            } catch(e) {
                console.log(`String ${pattern} seems to be an invalid RegExp pattern`, e);
            }
        }
        return (
            <Input
                className={"bg-white" + (value ? "bg-amber-100" : "")}
                type={"text"}
                id={name}
                value={`${value}`}
                onChange={(e) => onChange(e.target.value)}
                pattern={regexPattern}
                placeholder={placeHolder}
            />
        )
    }
}

export default InputField;