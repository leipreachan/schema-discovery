import React, { useState } from 'react';
import { JsonSchema, JsonSchemaProperty, FormValue, ObjectValue } from './types';
import SelectField from './SelectField';
import { resolveRef, getPropertyName } from './utils';
import InputField from './InputField';

interface FormFieldProps {
  name: string;
  property: JsonSchemaProperty;
  value: FormValue;
  onChange: (name: string, value: FormValue) => void;
  schema: JsonSchema; // Pass the full schema to access definitions
}

const FormField: React.FC<FormFieldProps> = ({ name, property, value, onChange, schema }) => {
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
            name={`${name}.${subName}`}
            property={subProperty}
            value={objectValue[subName] || ''}
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
          <div>
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
              }}>Add Group</button>
          </div>
        )}
      </div>
    );
  }

  if (property.type === 'array' && property.items != undefined) {
    if (property.items.enum != undefined) {
      return (
        <div className="form-field ml-8 pl-1 pt-2 border-8 border-transparent hover:border-l-amber-300">
          <label htmlFor={name}>{property.title || name}</label>
          {property.description && <p className="field-description">{property.description}</p>}
          <SelectField
            name={name}
            value={property.items.enum}
            onChange={() => { }}
            propertyEnum={property.items.enum}
            multipleSelect={true}
          />
        </div>
      )
    }
    if (property.items.$ref != undefined) {
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
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(name, e.target.value);
  };

  if (name.endsWith("additionalProperties")) {
    return;
  }

  let propertyData = property;

  if (property.$ref != undefined) {
    propertyData = resolveRef(property.$ref, schema);
  }

  const placeHolder = propertyData.pattern != undefined ? propertyData.pattern : `${propertyData.type} value`;

  return (
    <div className="form-field ml-8 pl-1 pt-2 border-8 border-transparent hover:border-l-amber-300">
      <label htmlFor={name}>{propertyData.title || name}</label>
      {propertyData.description && <p className="field-description">{propertyData.description}</p>}
      <span className='pl-2'>
      {propertyData.enum ? (
        <SelectField
          name={name}
          value={value}
          onChange={handleChange}
          propertyEnum={propertyData.enum}
          multipleSelect={false}
        />
      ) :
        <InputField
          name={name}
          value={value}
          type={propertyData.type == "boolean" ? "checkbox" : "text"}
          onChange={handleChange}
          pattern={propertyData.pattern}
          placeHolder={placeHolder}
        />
      }
      </span>
    </div>
  );
}

export default FormField;
