import React from 'react';
import DynamicFieldArray from '@/components/fields/DynamicFieldArray';
import { Input } from '@/components/ui/input';
import { FormFieldProps, NULL_TEXT_VALUE } from '@/types';
import Select from '@/components/ui/custom-select';
import DynamicFieldObject from './DynamicFieldObject';

const InputField: React.FC<FormFieldProps> = ({ name, onChange, value, pattern, type, placeHolder = "" }) => {
    switch (type) {
        case "boolean": {
            const allowedValues = ["false", "true"];
            return (
                <Select
                    name={name}
                    value={value === "" ? null : (value ? "true" : "false")}
                    onChange={(e) => onChange(e === undefined ? null : e === "true")}
                    placeholder="Select (boolean)"
                    propertyEnum={allowedValues}
                    multipleSelect={false}
                />
            );
        }
        case "array":
            return (
                <DynamicFieldArray name={name} value={value} onChange={onChange} />
            );
        case "object":
            return (
                <DynamicFieldObject name={name} value={value} onChange={onChange} />
            )
        case "integer":
            return (
                <Input
                    type={"text"}
                    id={name}
                    value={`${value == NULL_TEXT_VALUE ? "" : value}`}
                    onChange={(e) => onChange(e.target.value == "" ? NULL_TEXT_VALUE: Number.parseInt(e.target.value))}
                    placeholder={placeHolder}
                />
            )
        default:
            { let regexPattern = "";
            if (pattern != undefined) {
                try {
                    new RegExp(pattern as string);
                    regexPattern = pattern;
                } catch (e) {
                    console.log(`String ${pattern} seems to be an invalid RegExp pattern`, e);
                }
            }
            return (
                <Input
                    type={"text"}
                    id={name}
                    value={`${value == NULL_TEXT_VALUE ? "" : value}`}
                    onChange={(e) => onChange(e.target.value == "" ? NULL_TEXT_VALUE : e.target.value)}
                    pattern={regexPattern}
                    placeholder={placeHolder}
                />
            ) }
    }
}

export default InputField;