import ReactSelect, { Props as ReactSelectProps, GroupBase } from 'react-select';
import { cn } from '@/lib/utils'
import { forwardRef } from "react";

export type SimpleSelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = Omit<ReactSelectProps<Option, IsMulti, Group>, 'theme' | 'classNames'> & {
  error?: boolean;
};

const SimpleSelectField = forwardRef<any, SimpleSelectProps<any>>(({ error, ...props }, ref) => {
    return (
      <ReactSelect
          ref={ref}
          placeholder="Select (single)..."
          // className={(value?.length > 0 ? "bg-amber-100" : "")}
          defaultValue={props?.value || ""}
          onChange={(e) => props.onChange({target: { type: "select", multiple: false, selectedOptions: e?.value}})}
          options={props.propertyEnum?.map((item: string) => ({"value": item, "label": item}))}
          unstyled
          closeMenuOnSelect={true}
          isClearable={true}
          classNames={{
            control: ({ isFocused }) =>
              cn(
                'flex w-full !min-h-0 rounded-md border border-input bg-background px-3 py-[3px] text-sm shadow-xs transition-colors',
                'placeholder:text-muted-foreground focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
                isFocused && 'ring-1 ring-ring',
                error && 'border-destructive ring-destructive',
              ),
            placeholder: () => 'text-muted-foreground',
            input: () => 'text-sm',
            menu: () => 'mt-2 rounded-md border bg-popover text-popover-foreground shadow-md py-1',
            menuList: () => 'text-sm',
            option: ({ isFocused, isSelected }) =>
              cn(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors',
                isSelected && 'bg-primary text-primary-foreground',
                isFocused && !isSelected && 'bg-accent text-accent-foreground',
                !isFocused && !isSelected && 'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
              ),
            valueContainer: () => 'gap-1 flex flex-wrap items-center',
            clearIndicator: () => 'p-1 text-muted-foreground hover:text-foreground',
            dropdownIndicator: () => 'p-1 text-muted-foreground hover:text-foreground',
            indicatorSeparator: () => 'bg-input mx-2 my-2 w-[1px]',
            noOptionsMessage: () => 'text-muted-foreground p-2 text-sm',
          }}
        />
    )
});
    /**
     *     
      <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select value ..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
        {propertyEnum.map((option: string) => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
     */

export default SimpleSelectField;