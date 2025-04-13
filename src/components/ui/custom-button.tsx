import { cn } from "@/lib/utils"
import { Button } from "./button"

const CustomButton = ({ className = "", ...props }) => {
    return (
        <Button
            className={cn("text-gray-400 hover:text-white bg-black hover:bg-gray-600", className)}
            {...props}
        />
    )
}

export { CustomButton }