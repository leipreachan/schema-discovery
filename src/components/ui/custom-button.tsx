import { cn } from "@/lib/utils"
import { Button } from "./button"

const CustomButton = ({ className = "", ...props }) => {
    return (
        <Button
            className={cn("text-white bg-black hover:bg-gray-600", className)}
            {...props}
        />
    )
}

export { CustomButton }