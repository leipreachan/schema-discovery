import { cn } from "@/lib/utils"
import { Button } from "./button"

//@ts-ignore
const CustomButton = ({ className = "", onClick, ...props }) => {
    //@ts-ignore
    const onClickHandler = (e) => {
        e.preventDefault();
        return onClick(e);
    }
    return (
        <Button
            className={cn("text-gray-400 hover:text-white bg-black",
                "hover:bg-gray-500 hover:shadow-xs",
                "hover:shadow-gray-200",
                "dark:hover:bg-gray-800 dark:hover:shadow-gray-900",
                className)}
            onClick={onClickHandler}
            {...props}
        />
    )
}

export { CustomButton }