import React, { useState } from 'react';
import { FormFieldProps, JsonSchemaProperty, ObjectValue } from '@/types';
import { resolveRef, getPropertyName } from '@/utils';
import InputField from './InputField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SelectField from './SelectField';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';

const FormField: React.FC<FormFieldProps> = ({title, name, property, value, onChange, schema }) => {
  const [additionalFieldName, setAdditionalFieldName] = useState('');

  // only object with properties
  if (property?.type === 'object'
    && (property.additionalProperties != undefined || property.properties != undefined)) {
    const objectValue = value as ObjectValue;

    const additionalPropSchema = typeof property.additionalProperties === 'object'
      && '$ref' in property.additionalProperties
      && property.additionalProperties.$ref != undefined
      ? resolveRef(property.additionalProperties.$ref, schema)
      : (property.additionalProperties as JsonSchemaProperty | undefined);

    const additionalPropName = typeof property.additionalProperties === 'object'
      && '$ref' in property.additionalProperties
      && property.additionalProperties.$ref != undefined
      ? getPropertyName(property.additionalProperties.$ref) : "property"

    return (
      <div className="object-field p-2 pl-8 hover:bg-gray-100 w-full">
        <h3>{property.title || name}</h3>
        {property.description && <p className="field-description">{property.description}</p>}

        {/* Render defined properties */}
        {property.properties && Object.entries(property.properties).map(([subName, subProperty]) => (
          <FormField
            key={`${name}.${subName}`}
            title={`${name}.${subName}`}
            name={`${name}.${subName}`}
            property={subProperty}
            value={(objectValue[subName] || objectValue[subName] === false) ? objectValue[subName] : ''}
            onChange={(subFieldName, subValue) => {
              const newValue: ObjectValue = { ...objectValue, [subName]: subValue };
              onChange(name, newValue);
            }}
            schema={schema}
          />
        ))}

        {/* Render existing additional properties */}
        {additionalPropSchema && Object.entries(objectValue).map(([subName, subValue]) => {
          if (!property.properties || !(subName in property.properties)) {
            return (
              <FormField
                key={`${name}.${subName}`}
                title={`${name}.${subName}`}
                name={`${name}.${subName}`}
                property={additionalPropSchema}
                value={subValue}
                onChange={(subFieldName, newSubValue) => {
                  const newValue: ObjectValue = { ...objectValue, [subName]: newSubValue };
                  onChange(name, newValue);
                }}
                schema={schema}
              />
            );
          }
          return null;
        })}

        {/* Add new additional property */}
        {additionalPropSchema && (
          <span>
            <Separator orientation="horizontal" className="my-4"/>
            <div className='pl-8 grid grid-cols-2 w-full justify-items-end'>
              <div className='w-full'>
                <Input
                className='bg-white'
                type="text"
                placeholder={`New ${additionalPropName} name`}
                value={additionalFieldName}
                onChange={(e) => setAdditionalFieldName(e.target.value)}
              /></div>
              <div>
              <Button
                className="shadow-xs"
                onClick={() => {
                  if (additionalFieldName) {
                    const newValue: ObjectValue = {
                      ...objectValue,
                      [additionalFieldName]: additionalPropSchema.type === 'object' ? {} : ''
                    };
                    onChange(name, newValue);
                    setAdditionalFieldName('');
                  }
                }}>Add new {additionalPropName}</Button>
              </div>
            </div>
          </span>
        )}
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(e);
    switch (e.target.type) {
      case "select": {
        const selected = e.target.multiple ? 
        Array.from(e.target?.selectedOptions).map((item) => item) : e.target?.selectedOptions;
        onChange(name, selected);
        break;
      }
      case "checkbox": {
        onChange(name, e.target.checked);
        break;
      }
      case "radio": {
        onChange(name, JSON.parse(e.target.value));
        break;
      }
      case "text": {
        const value = e?.target?.value;
        onChange(name, (e.target.placeholder == "integer") ? Number.parseInt(value) : value);
      }
    }
  };

  if (property?.type === 'array' && property?.items?.$ref != undefined) {
    // const items = resolveRef(property.items.$ref);
    return (
      <div className="form-field pl-8 pt-2">
        <Button
          onClick={() => {
            if (additionalFieldName) {
              const newValue: ObjectValue = {
                ...objectValue,
                [additionalFieldName]: additionalPropSchema.type === 'object' ? {} : ''
              };
              onChange(name, newValue);
              setAdditionalFieldName('');
            }
          }}>Add {property.title || name}</Button>
      </div>
    )
  }

  if (name.endsWith("additionalProperties")) {
    return;
  }

  const propertyData = property.$ref != undefined ? resolveRef(property.$ref, schema) : property;

  const placeHolder = propertyData?.pattern || propertyData?.type || "";


  const breakLongTitle = (title: string) => {
    const wbr = (<wbr />);

    return (
      <span>
        {
        title.split(".")
          .reduce((acc, x) => acc === null ? [x] : [acc, ".", wbr, x], null)
          }
      </span>
    )
  };

  return (
    <div className="form-field pt grid grid-cols-2 p-2 hover:bg-amber-50 hover:shadow-gray-300 hover:shadow-xs hover:rounded-md">
      {
        title && (
          <div className='break-words'>
            <Label htmlFor={name}>
              {breakLongTitle(propertyData?.title || title)}
              <span>{propertyData?.description && <p className="field-description">{propertyData?.description}</p>}</span>
            </Label>
          </div>
        )
      }
      <div>
        {(propertyData?.enum || property?.items?.enum) ? (
          <SelectField
            name={name}
            value={value}
            onChange={handleChange}
            propertyEnum={propertyData?.enum || property?.items?.enum}
            multipleSelect={property?.items?.enum != undefined}
          />
        ) :
          <InputField
            name={name}
            value={value}
            type={propertyData?.type}
            onChange={handleChange}
            pattern={propertyData?.pattern}
            placeHolder={placeHolder}
          />
        }
      </div>
    </div >
  );
}

export default FormField;
