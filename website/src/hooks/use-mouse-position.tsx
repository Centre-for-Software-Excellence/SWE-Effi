import { useEffect, useState } from 'react';

export function useMousePosition() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const handleMouseMove = (event: MouseEvent) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  return { mouseX, mouseY };
}
