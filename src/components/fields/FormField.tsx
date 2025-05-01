import React, { useState } from "react";
import {
  ArrayValue,
  FormFieldProps,
  FormValue,
  JsonSchemaProperty,
  ObjectValue,
} from "@/types";
import { resolveRef, getPropertyName } from "@/utils";
import InputField from "./InputField";
import { CustomButton as Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/custom-select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const FormField: React.FC<FormFieldProps> = ({
  title,
  name,
  property,
  value,
  onChange,
  schema,
  isRequired,
}) => {
  const [additionalFieldName, setAdditionalFieldName] = useState("");

  // only object with properties
  if (
    property?.type === "object" &&
    (property.additionalProperties != undefined ||
      property.properties != undefined)
  ) {
    const objectValue = value as ObjectValue;

    const additionalPropSchema =
      typeof property.additionalProperties === "object" &&
      "$ref" in property.additionalProperties &&
      property.additionalProperties.$ref != undefined
        ? resolveRef(property.additionalProperties.$ref, schema)
        : (property.additionalProperties as JsonSchemaProperty | undefined);

    const additionalPropName =
      typeof property.additionalProperties === "object" &&
      "$ref" in property.additionalProperties &&
      property.additionalProperties.$ref != undefined
        ? getPropertyName(property.additionalProperties.$ref)
        : "property";

    const dotName = name ? name + "." : "";
    const requiredProperties = property.required || [];

    return (
      <div className="w-full pt-4 pb-4 pl-4 object-field">
        <h3>{property.title || name}</h3>
        {property.description && (
          <p className="field-description font-normal">
            {property.description}
          </p>
        )}

        {/* Render defined properties */}
        {property.properties &&
          Object.entries(property.properties).map(([subName, subProperty]) => (
            <FormField
              key={`${dotName}${subName}`}
              title={`${dotName}${subName}`}
              name={`${dotName}${subName}`}
              property={subProperty}
              value={
                objectValue[subName] || objectValue[subName] === false
                  ? objectValue[subName]
                  : ""
              }
              onChange={(_, subValue) => {
                const newValue: ObjectValue = {
                  ...objectValue,
                  [subName]: subValue,
                };
                onChange(name, newValue);
              }}
              schema={schema}
              isRequired={requiredProperties.includes(subName)}
            />
          ))}

        {/* Render existing additional properties */}
        {additionalPropSchema &&
          Object.entries(objectValue).map(([subName, subValue]) => {
            if (!property.properties || !(subName in property.properties)) {
              return (
                <FormField
                  key={`${dotName}${subName}`}
                  title={`${dotName}${subName}`}
                  name={`${dotName}${subName}`}
                  property={additionalPropSchema}
                  value={subValue}
                  onChange={(_, newSubValue) => {
                    const newValue: ObjectValue = {
                      ...objectValue,
                      [subName]: newSubValue,
                    };
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
            <div className="grid w-full grid-cols-2 p-4 justify-items-end">
              <div className="w-full">
                <Input
                  type="text"
                  placeholder={`New ${additionalPropName} name`}
                  value={additionalFieldName}
                  onChange={(e) => setAdditionalFieldName(e.target.value)}
                />
              </div>
              <div>
                <Button
                  onClick={() => {
                    if (additionalFieldName) {
                      const newValue: ObjectValue = {
                        ...objectValue,
                        [additionalFieldName]:
                          additionalPropSchema.type === "object" ? {} : "",
                      };
                      onChange(name, newValue);
                      setAdditionalFieldName("");
                    }
                  }}
                >
                  Add new {additionalPropName}
                </Button>
              </div>
            </div>
          </span>
        )}
      </div>
    );
  }

  if (property?.type === "array" && property?.items?.$ref != undefined) {
    const propsSchema = resolveRef(property?.items?.$ref, schema);
    const arrayValue = (value || []) as ArrayValue;

    return (
      <div className="w-full pt-4 pb-4 pl-4 object-field">
        <h3>{schema?.title || name}</h3>
        {schema?.description && <p>{schema?.description}</p>}

        {arrayValue.map((item, index) => (
          <div key={index} className="array-item">
            <Button
              onClick={() => {
                const newArray = arrayValue.filter((_, i) => i !== index);
                onChange(name, newArray);
              }}
            >
              X
            </Button>
            <FormField
              name={`${name}[${index}]`}
              schema={schema}
              property={propsSchema}
              value={item}
              onChange={(_, newValue) => {
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
              const defaultValue = propsSchema?.type === "object" ? {} : "";
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

  const handleChange = (value: FormValue) => {
    onChange(name, value);
  };

  const propertyData =
    property?.$ref != undefined ? resolveRef(property.$ref, schema) : property;

  const placeHolder = propertyData?.pattern || propertyData?.type || "";

  const breakLongTitle = (title: string) => {
    return (
      <>
        {title
          .split(".")
          .reduce((acc, x) => (acc.length == 0 ? x : acc + "." + x), "")}
      </>
    );
  };

  return (
    <div
      className={cn(
        "w-full p-4 form-field pt",
        "hover:bg-amber-50 hover:shadow-gray-300",
        "dark:hover:bg-gray-700 dark:hover:shadow-gray-900",
        "hover:shadow-xs hover:rounded-md",
        title && "grid grid-cols-2"
      )}
    >
      {title && (
        <div className="break-words">
          <Label htmlFor={name}>
            <p>
              {breakLongTitle(propertyData?.title || title)}{" "}
              {isRequired ? <Badge variant="destructive">required</Badge> : ""}
            </p>
            {propertyData?.description && (
              <>
                <div className="basis-full h-0"></div>
                <p className="field-description font-normal bg-sidebar-accent p-2 rounded-sm">
                  {propertyData?.description}
                </p>
              </>
            )}
          </Label>
        </div>
      )}
      <div>
        {propertyData?.enum || property?.items?.enum ? (
          <Select
            name={name}
            value={value}
            //@ts-ignore
            onChange={handleChange}
            propertyEnum={propertyData?.enum || property?.items?.enum}
            multipleSelect={property?.items?.enum != undefined}
          />
        ) : (
          <InputField
            name={name}
            value={value}
            type={propertyData?.type}
            onChange={handleChange}
            pattern={propertyData?.pattern}
            placeHolder={placeHolder}
          />
        )}
      </div>
    </div>
  );
};

export default FormField;
