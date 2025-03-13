import { useState } from "react";
import FormField from "./FormField";

const DynamicFieldArray: React.FC<FormFieldProps> = ({ name, value, onChange }) => {
  const [fields, setFields] = useState(value);

  const globalHandler = (values) => {
    onChange({
      target: {
        type: "text",
        value: Array.from(values)
      }
    });
  }
  // Handle value update
  const handleChange = (fieldName, fieldValue) => {
    const newFields = fields;
    newFields[fieldName] = fieldValue;
    setFields(newFields);
    globalHandler(newFields);
  };

  // Add new field
  const handleAdd = () => {
    const newFields = [...fields, ''];
    setFields(newFields);
    globalHandler(newFields);
  };

  // Remove field
  const handleRemove = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    globalHandler(newFields);
  };

  const arraySchema = {type: "text"};

  return (
    <span>
      {fields.length > 0 && Array.from(fields).map((field, index) => (
        <div key={index} className="flex items-center mb-2">
          <FormField
            key={`${name}_${index}`}
            title={null}
            name={`${index}`}
            value={`${field}`}
            onChange={handleChange}
            property={arraySchema}
            schema={arraySchema}
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className='rounded-full bg-gray-500 px-5 py-2 text-sm leading-5 font-semibold text-black hover:bg-sky-700'
          >
            X
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className='rounded-full bg-gray-500 px-5 py-2 text-sm leading-5 font-semibold text-black hover:bg-sky-700'
      >
        Add value to array
      </button>
    </span>
  );
}

export default DynamicFieldArray;