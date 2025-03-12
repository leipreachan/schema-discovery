import { useState } from "react";

const DynamicFieldArray: React.FC<FormFieldProps> = ({name, value, onChange}) => {
  const [fields, setFields] = useState(value);

  const globalHandler = () => {
    onChange({target: {
      type: "text",
      value: fields
    }});
  }
  // Handle value update
  const handleChange = (index, event) => {
    const newFields = [...fields];
    newFields[index] = event.target.value;
    setFields(newFields);
    globalHandler();
  };

  // Add new field
  const handleAdd = () => {
    setFields([...fields, '']);
    globalHandler();
  };

  // Remove field
  const handleRemove = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    globalHandler();
  };

  return (
    <span>
      {fields.length > 0 && fields.map((field, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            value={field}
            onChange={(event) => handleChange(index, event)}
            className={"m-1 p-1 border-1 border-gray-300 rounded-sm " + (value  ? "bg-amber-100" : "")}
            placeholder={`Field ${index + 1}`}
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
        Add value
      </button>
    </span>
  );
}

export default DynamicFieldArray;