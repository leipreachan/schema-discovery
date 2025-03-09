import { JsonSchema, JsonSchemaProperty } from "./types";

export const resolveRef = (ref: string, schema: JsonSchema): JsonSchemaProperty | undefined => {
    type PathSegment = keyof typeof schema;
    const path = ref.split('/').slice(1);
    const current = schema as JsonSchema;
    for (const segment of path) {
        if (current == undefined || current[segment as PathSegment] === undefined) return undefined;
        return current[segment as PathSegment] as JsonSchemaProperty;
    }
  };

  export const getPropertyName = (ref: string) => {
    const path = ref.split('/').slice(1);
    return path[path.length - 1];
  }

  