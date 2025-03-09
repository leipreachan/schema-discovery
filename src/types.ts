// types.ts
export interface JsonSchema {
    type: string;
    definitions?: Record<string, JsonSchemaProperty>;
    properties?: Record<string, JsonSchemaProperty>;
    additionalProperties?: boolean | JsonSchemaProperty | { $ref: string };
    $defs?: Record<string, JsonSchemaProperty>;
}

// types.ts
export type PrimitiveValue = string | number | boolean;

export interface ObjectValue {
  [key: string]: FormValue;
}

export type FormValue = PrimitiveValue | ObjectValue;

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
  [key: string]: string | number;
}