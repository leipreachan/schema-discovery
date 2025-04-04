import React from 'react';
import DynamicFieldArray from '@/components/fields/DynamicFieldArray';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import { FormFieldProps } from '@/types';

const InputField: React.FC<FormFieldProps> = ({ name, onChange, value, pattern, type = "text", placeHolder = "" }) => {
    if (type == "boolean") {
        const allowedValues = ["null", "false", "true"];
        // if (name == "agents.agent_1.tailscale-connect") {
        // for(const val of allowedValues) {
        //     console.log([value, val, `${value}` == val]);
        // }}
        return allowedValues.map((itemValue) =>
            <div key={`${name}_${itemValue}`} className={(value !== "" ? "bg-amber-100" : "")}>
                <Label key={`${name}_${itemValue}`}>
                    {itemValue}
                    <Input
                        key={`${name}_${itemValue}`}
                        type={"radio"}
                        id={name}
                        name={`${value}`}
                        value={itemValue}
                        onChange={onChange}
                        pattern={pattern}
                        placeholder={placeHolder}
                        checked={`${value}` == itemValue || (`${value}` == "" &&  itemValue== "null")}
                    />
                </Label>
            </div>
        );
    } else if (type == "array" ) {
        return (
            <DynamicFieldArray name={name} value={value} onChange={onChange}/>
        )
    } else {
        return (
            <Input
                className={(value  ? "bg-amber-100" : "")}
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