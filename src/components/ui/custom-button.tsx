import { cn } from "@/lib/utils"
import { Button } from "./button"

const CustomButton = ({ className = "", onClick, ...props }) => {
    const onClickHandler = (e) => {
        e.preventDefault();
        return onClick(e);
    }
    return (
        <Button
            className={cn("text-gray-400 hover:text-white bg-black hover:bg-gray-600", className)}
            onClick={onClickHandler}
            {...props}
        />
    )
}

export { CustomButton }