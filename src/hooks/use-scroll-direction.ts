import { useEffect, useRef } from "react";

export function useScrollDirection(
  scrollRef: React.RefObject<HTMLElement>,
  onScrollDirectionChange: (dir: "up" | "down") => void
) {
  const lastY = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const y = el.scrollTop;
      if (y > lastY.current + 10) onScrollDirectionChange("down");
      else if (y < lastY.current - 10) onScrollDirectionChange("up");
      lastY.current = y;
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollRef, onScrollDirectionChange]);
}
