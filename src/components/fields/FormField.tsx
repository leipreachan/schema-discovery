import React, { useState } from "react";
import {
  ArrayValue,
  FormFieldProps,
  FormValue,
  JSONObject,
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
import { FormFieldList } from "./FormFieldList";
import { Description } from "../Description";

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

    const addNewAdditionalProperty = () => {
      if (additionalPropSchema && additionalFieldName) {
        const newValue: ObjectValue = {
          ...objectValue,
          [additionalFieldName]:
            additionalPropSchema.type === "object" ? {} : "",
        };
        onChange(name, newValue);
        setAdditionalFieldName("");
      }
    };

    function deleteByPath(obj: JSONObject, path: string): boolean {
      const keys = path.split(".");
      let current: unknown = obj;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current || typeof current !== "object") return false;
        current = (current as JSONObject)[keys[i]];
      }

      if (current && typeof current === "object") {
        delete (current as JSONObject)[keys[keys.length - 1]];
        return true;
      }

      return false;
    }

    const deleteAdditionalProperty = (subField: string) => () => {
      if (additionalPropSchema) {
        deleteByPath(objectValue, `${subField}`);
        onChange(name, objectValue);
      }
    };

    return (
      <div className="w-full pb-4 pl-4 object-field">
        <h3>{property.title || name}</h3>
        {property.description && (
          <Description description={property.description} />
        )}

        {/* Render defined properties */}
        {property.properties && (
          <FormFieldList
            fieldName={name}
            properties={property.properties}
            objectValue={objectValue}
            schema={schema}
            requiredPropertiesList={property.required || []}
            onChange={onChange}
            fieldValue={({
              objectValue,
              name,
            }: {
              objectValue: Record<string, FormValue>;
              name: string;
            }) =>
              objectValue[name] || objectValue[name] === false
                ? objectValue[name]
                : ""
            }
          />
        )}

        {/* Render existing additional properties */}
        {additionalPropSchema && (
          <FormFieldList
            fieldName={name}
            properties={objectValue}
            objectValue={objectValue}
            schema={schema}
            requiredPropertiesList={[]}
            onChange={onChange}
            fieldValue={({ value }: { value: FormValue }) => value}
            fieldProperty={additionalPropSchema}
            deleteHandler={deleteAdditionalProperty}
          />
        )}

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
                <Button onClick={addNewAdditionalProperty}>
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
        title && "grid grid-cols-2 gap-2"
      )}
    >
      {title && (
        <div className="break-words align-middle">
          <Label className="h-full" htmlFor={name}>
            {breakLongTitle(propertyData?.title || title)}{" "}
            {isRequired ? <Badge variant="destructive">required</Badge> : ""}
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
      {propertyData?.description && (
      <Description description={propertyData.description} />
    )}
    </div>
  );
};

export default FormField;
