import ReactSelect, { Props as ReactSelectProps } from 'react-select';
import { cn } from '@/lib/utils'
import { forwardRef } from "react";


//@ts-ignore
const Select = forwardRef<unknown, ReactSelectProps<unknown>>(({ error, placeholder, ...props }, ref) => {

    //@ts-ignore
    const { name, multipleSelect, onChange, value, propertyEnum } = props;
    const placeHolder = placeholder || `Select (${multipleSelect ? "multiple" : "single"})`;
    const defaultValue = value ? (Array.isArray(value) ? value.map(item => ({ value: item, label: item })) : { value: value, label: value }) : null;
    //@ts-ignore
    const onChangeHandler = (e: any) => {
        //@ts-ignore
        return onChange(multipleSelect ? e?.map((item: {key: string, value: string}) => item.value) : e?.value)
    }

    return (
        <ReactSelect
            //@ts-ignore
            ref={ref}
            name={name}
            placeholder={placeHolder}
            value={defaultValue}
            onChange={onChangeHandler}
            options={propertyEnum?.map((item: string) => ({ "value": item, "label": item }))}
            isMulti={multipleSelect}
            unstyled
            closeMenuOnSelect={!multipleSelect}
            isClearable={true}
            classNames={{
                control: ({ isFocused }) =>
                    cn(
                        'flex w-full !min-h-0 rounded-md border border-input bg-background px-3 py-[3px] text-sm shadow-xs transition-colors',
                        'placeholder:text-muted-foreground focus-visible:outline-none',
                        'disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
                        isFocused && 'ring-1 ring-ring',
                        error && 'border-destructive ring-destructive',
                        ((!Array.isArray(value) && value !== null && value !== "") || (Array.isArray(value) && value.length > 0)) && "bg-amber-100 dark:border-blue-300 dark:bg-gray-600"
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
                multiValue: () => 'inline-flex items-center bg-secondary text-secondary-foreground mr-1 rounded-sm',
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

export default Select;