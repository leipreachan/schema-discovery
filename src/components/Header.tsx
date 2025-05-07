import { ReactNode } from "react";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";

export const Header = ({children, className}: {children: ReactNode, className?: undefined|string}) => {
  return (
    <div className={cn("grid grid-cols-2 m-2 w-full", className)}>
      <h1 className="mb-2 text-2xl">JSON Schema Discovery</h1>
      <div className="text-right">
        {children}
        <ModeToggle className="float-right" />
      </div>
    </div>
  );
};
