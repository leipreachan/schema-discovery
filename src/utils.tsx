import { JsonSchema, JsonSchemaProperty } from "@/types";

export const resolveRef = (ref: string, schema: JsonSchema | undefined): JsonSchemaProperty | undefined => {
  type PathSegment = keyof JsonSchemaProperty;
  const path = ref.split('/').slice(1);
  let current = schema as JsonSchemaProperty;
  for (const segment of path) {
    if (current == undefined || current[segment as PathSegment] === undefined) return undefined;
    current = current[segment as PathSegment] as JsonSchemaProperty;
  }
  return current as JsonSchemaProperty;
};

export const getPropertyName = (ref: string) => {
  const path = ref.split('/').slice(1);
  return path[path.length - 1];
}

  