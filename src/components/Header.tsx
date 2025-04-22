import { ModeToggle } from "./mode-toggle";
import { ReloadButton } from "@/components/ui/reload-button";

export const Header = ({dropSchema}: {dropSchema: () => void}) => {
  return (
    <div className="grid grid-cols-2 m-2">
      <h1 className="mb-2 text-2xl">JSON Schema Discovery</h1>
      <div className="text-right">
      <ReloadButton onClick={dropSchema} className="mr-2"/>
        <ModeToggle className="float-right"/>
      </div>
    </div>
  );
};
