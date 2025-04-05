import ReactSelect, { Props as ReactSelectProps, GroupBase } from 'react-select';
import { cn } from '@/lib/utils'
import { forwardRef } from "react";

export type MultiSelectProps<
  Option,
  IsMulti extends boolean = true,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = Omit<ReactSelectProps<Option, IsMulti, Group>, 'theme' | 'classNames'> & {
  error?: boolean;
};

const MultiSelectField = forwardRef<any, MultiSelectProps<any>>(({ error, ...props }, ref) => {
    return (
        <ReactSelect
          ref={ref}
          placeholder="Select (multiple)..."
          // className={(value?.length > 0 ? "bg-amber-100" : "")}
          defaultValue={props.value || []}
          onChange={(e) => props.onChange({target: { type: "select", multiple: true, selectedOptions: e?.map(item => item.value)}})}
          options={props.propertyEnum?.map((item: string) => ({"value": item, "label": item}))}
          isMulti
          unstyled
          closeMenuOnSelect={false}
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
            multiValue: () => 'inline-flex items-center bg-secondary text-secondary-foreground mr-1',
            multiValueLabel: () => 'px-2 text-xs leading-none',
            multiValueRemove: () =>
              cn('flex items-center justify-center p-1', 'hover:bg-destructive hover:text-destructive-foreground'),
            valueContainer: () => 'gap-1 flex flex-wrap items-center',
            clearIndicator: () => 'p-1 text-muted-foreground hover:text-foreground',
            dropdownIndicator: () => 'p-1 text-muted-foreground hover:text-foreground',
            indicatorSeparator: () => 'bg-input mx-2 my-2 w-[1px]',
            noOptionsMessage: () => 'text-muted-foreground p-2 text-sm',
          }}
        />
    )
});

export default MultiSelectField;