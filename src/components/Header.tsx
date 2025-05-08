import { ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const Header = ({
  children,
  className,
  text,
  setHideHeader,
}: {
  children: ReactNode;
  className?: undefined | string;
  text: string;
  setHideHeader: (arg: boolean) => void;
}) => {
  const hoverRef = useRef<HTMLDivElement | null>(null);
  // useHover(hoverRef, setHideHeader(false));
  useEffect(() => {
    const el = hoverRef.current;
    if (!el) return;

    const onMouseOver = () => {
      setHideHeader(false);
    };

    el.addEventListener("mouseover", onMouseOver);
    return () => {
      el.removeEventListener("mouseover", onMouseOver);
    };
  }, [hoverRef, setHideHeader]);

  return (
    <div
      className={cn("grid grid-cols-2 w-full p-2 mb-0.5 shadow-sm", className)}
      ref={hoverRef}
    >
      <h1 className="text-2xl">{text}</h1>
      <div className="text-right">{children}</div>
    </div>
  );
};
