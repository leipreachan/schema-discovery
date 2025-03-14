import React, { useState } from 'react';
import { FormFieldProps, JsonSchemaProperty, ObjectValue } from './types';
import SelectField from './SelectField';
import { resolveRef, getPropertyName } from './utils';
import InputField from './InputField';

const FormField: React.FC<FormFieldProps> = ({title, name, property, value, onChange, schema }) => {
  const [additionalFieldName, setAdditionalFieldName] = useState('');

  // only object with properties
  if (property.type === 'object'
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
      <div className="object-field pl-8 pt-2 hover:bg-gray-100">
        <h3>{property.title || name}</h3>
        {property.description && <p className="field-description">{property.description}</p>}

        {/* Render defined properties */}
        {property.properties && Object.entries(property.properties).map(([subName, subProperty]) => (
          <FormField
            key={subName}
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
                key={subName}
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
          <div className='pl-8'>
            <input
              className="m-4 p-1 border-1 border-gray-300 rounded-sm"
              type="text"
              placeholder={`New ${additionalPropName} name`}
              value={additionalFieldName}
              onChange={(e) => setAdditionalFieldName(e.target.value)}
            />
            <button
              className='rounded-full bg-gray-500 px-5 py-2 text-sm leading-5 font-semibold text-black hover:bg-sky-700'
              onClick={() => {
                if (additionalFieldName) {
                  const newValue: ObjectValue = {
                    ...objectValue,
                    [additionalFieldName]: additionalPropSchema.type === 'object' ? {} : ''
                  };
                  onChange(name, newValue);
                  setAdditionalFieldName('');
                }
              }}>Add new {additionalPropName}</button>
          </div>
        )}
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.tagName == "SELECT") {
      const selected = Array.from(e.target?.selectedOptions).map((item) => item.value);
      onChange(name, e.target.multiple ? selected : selected[0]);
    } else {
      switch (e.target.type) {
        case "checkbox": {
          onChange(name, e.target.checked);
          break;
        }
        case "radio": {
          onChange(name, JSON.parse(e.target.value));
          break;
        }
        case "text": {
          onChange(name, e.target.value || "");
        }
      }
    }
  };

  if (property?.type === 'array' && property?.items?.$ref != undefined) {
    // const items = resolveRef(property.items.$ref);
    return (
      <div className="form-field pl-8 pt-2">
        <button
          className='rounded-full bg-gray-500 px-5 py-2 text-sm leading-5 font-semibold text-black hover:bg-sky-700'
          onClick={() => {
            if (additionalFieldName) {
              const newValue: ObjectValue = {
                ...objectValue,
                [additionalFieldName]: additionalPropSchema.type === 'object' ? {} : ''
              };
              onChange(name, newValue);
              setAdditionalFieldName('');
            }
          }}>Add {property.title || name}</button>
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
    <div className="form-field pt grid grid-cols-2 pt-1 pb-1 hover:bg-amber-50">
      {
        title && (
          <div className='break-words'>
            <label htmlFor={name}>
              {breakLongTitle(propertyData?.title || title)}
              <span>{propertyData?.description && <p className="field-description">{propertyData?.description}</p>}</span>
            </label>
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
