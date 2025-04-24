export type PrimitiveValue = string | number | boolean;

export interface ObjectValue {
  [key: string]: FormValue;
}

export type ArrayValue = FormValue[];

export type FormValue = PrimitiveValue | ObjectValue | ArrayValue;

export interface Items {
  type: string;
  enum?: string[];
  pattern?: string;
  $ref?: string;
}

export interface JsonSchemaProperty {
  type: string;
  description?: string;
  title?: string;
  minLength?: number;
  format?: string;
  minimum?: number;
  enum?: string[];
  pattern?: string;
  properties?: Record<string, JsonSchemaProperty>;
  additionalProperties?: boolean | JsonSchemaProperty;
  $ref?: string;
  required?: string[];
  items?: Items;
}

export interface FormData {
  [key: string]: string | number | boolean;
}

export interface FormFieldProps {
  title?: string|null;
  name: string;
  property?: JsonSchemaProperty;
  value: FormValue;
  onChange: (name: string, value: FormValue) => void;
  schema?: JsonSchema; // Pass the full schema to access definitions
  multipleSelect?: boolean;
  propertyEnum?: string[];
  pattern?: string;
  type?: string;
  placeHolder?: string;
  isRequired?: boolean;
}

export interface JsonSchema {
  title?: string;
  type: string;
  definitions?: Record<string, JsonSchemaProperty>;
  properties?: Record<string, JsonSchemaProperty>;
  additionalProperties?: boolean | JsonSchemaProperty | { $ref: string };
  $defs?: Record<string, JsonSchemaProperty>;
  description?: string;
}

export const NULL_TEXT_VALUE = "!!!###null";