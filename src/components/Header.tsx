import { ReactNode } from "react";
import { ModeToggle } from "./mode-toggle";

export const Header = ({children}: {children: ReactNode}) => {
  return (
    <div className="grid grid-cols-2 m-2">
      <h1 className="mb-2 text-2xl">JSON Schema Discovery</h1>
      <div className="text-right">
        {children}
        <ModeToggle className="float-right" />
      </div>
    </div>
  );
};
