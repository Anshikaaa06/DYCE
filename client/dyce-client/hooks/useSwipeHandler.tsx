import { useEffect, useRef, useState } from "react";

type SwipeDirection = "left" | "right";

interface UseSwipeHandlerProps {
  onSwipe: (direction: SwipeDirection) => void;
  threshold?: number;
}

export function useSwipeHandler({ onSwipe, threshold = 100 }: UseSwipeHandlerProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const dragOffsetRef = useRef(0);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      startXRef.current = e.clientX;

      const handleMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startXRef.current;
        dragOffsetRef.current = diff;
        setDragOffset(diff);
      };

      const handleMouseUp = () => {
        setIsDragging(false);

        const offset = dragOffsetRef.current;
        if (Math.abs(offset) > threshold) {
          onSwipe(offset > 0 ? "right" : "left");
        }

        setDragOffset(0);
        dragOffsetRef.current = 0;

        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const handleTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
      startXRef.current = e.touches[0].clientX;

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const currentX = e.touches[0].clientX;
        const offset = currentX - startXRef.current;
        dragOffsetRef.current = offset;
        setDragOffset(offset);
      };

      const handleTouchEnd = () => {
        setIsDragging(false);

        const offset = dragOffsetRef.current;
        if (Math.abs(offset) > threshold) {
          onSwipe(offset > 0 ? "right" : "left");
        }

        setDragOffset(0);
        dragOffsetRef.current = 0;

        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };

      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    };

    const node = ref.current;
    if (!node) return;

    node.addEventListener("mousedown", handleMouseDown);
    node.addEventListener("touchstart", handleTouchStart);

    return () => {
      node.removeEventListener("mousedown", handleMouseDown);
      node.removeEventListener("touchstart", handleTouchStart);
    };
  }, [onSwipe, threshold]);

  return {
    ref,
    dragOffset,
    isDragging,
  };
}
