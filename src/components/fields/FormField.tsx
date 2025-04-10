import React, { useState } from 'react';
import { ArrayValue, FormFieldProps, JsonSchemaProperty, ObjectValue } from '@/types';
import { resolveRef, getPropertyName } from '@/utils';
import InputField from './InputField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import Select from '@/components/ui/select';

const FormField: React.FC<FormFieldProps> = ({ title, name, property, value, onChange, schema }) => {
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

    const dotName = name ? name + "." : "";

    return (
      <div className="object-field pt-4 pb-4 pl-4 hover:bg-gray-100 w-full">
        <h3>{property.title || name}</h3>
        {property.description && <p className="field-description">{property.description}</p>}

        {/* Render defined properties */}
        {property.properties && Object.entries(property.properties).map(([subName, subProperty]) => (
          <FormField
            key={window.crypto.randomUUID()}
            title={`${dotName}${subName}`}
            name={`${dotName}${subName}`}
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
                key={window.crypto.randomUUID()}
                title={`${dotName}${subName}`}
                name={`${dotName}${subName}`}
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
            <Separator orientation="horizontal" className="my-4" />
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

  if (property?.type === 'array' && property?.items?.$ref != undefined) {
    const propsSchema = resolveRef(property?.items?.$ref, schema);
    const arrayValue = (value || []) as ArrayValue;

    return (
      <div className="object-field p-2 pl-8 hover:bg-gray-100 w-full">
        <h3>{schema?.title || name}</h3>
        {schema?.description && <p>{schema?.description}</p>}

        {arrayValue.map((item, index) => (
          <div key={window.crypto.randomUUID()} className="array-item">
            <Button
              onClick={() => {
                const newArray = arrayValue.filter((_, i) => i !== index);
                onChange(name, newArray);
              }}
            >
              X
            </Button>
            <FormField
              key={window.crypto.randomUUID()}
              name={`${name}[${index}]`}
              schema={schema}
              property={propsSchema}
              value={item}
              onChange={(subName, newValue) => {
                const newArray = [...arrayValue];
                newArray[index] = newValue;
                onChange(name, newArray);
              }}
            />
          </div>
        ))}

        <div className="add-array-item">
          <Button
            onClick={() => {
              const defaultValue = propsSchema?.type === 'object' ? {} : '';
              onChange(name, [...arrayValue, defaultValue]);
            }}
          >
            Add Item
          </Button>
        </div>
      </div>
    );

  }

  if (name.endsWith("additionalProperties")) {
    return;
  }

  const handleChange = (value) => {
    onChange(name, value);
  };

  const propertyData = property?.$ref != undefined ? resolveRef(property.$ref, schema) : property;

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
    <div className={"form-field p-4 hover:bg-amber-50 hover:shadow-gray-300 hover:shadow-xs hover:rounded-md " + (title ? "grid grid-cols-2" : "") }>
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
          <Select
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
