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
        variant={"outline"}
            className={cn(
                "hover:shadow-sm",
                "hover:shadow-gray-300",
                "dark:hover:shadow-gray-800",
                className)}
            onClick={onClickHandler}
            {...props}
        />
    )
}

export { CustomButton }