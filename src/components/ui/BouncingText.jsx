'use client';

import { useRef, useEffect, useState } from 'react';

export default function BouncingText({ text, className = '' }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [shouldBounce, setShouldBounce] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const cWidth = containerRef.current.clientWidth;
        const tWidth = textRef.current.scrollWidth;
        if (tWidth > cWidth) {
          setShouldBounce(true);
          // Calculate how far to move left (negative value)
          setDistance(cWidth - tWidth - 8); // 8px extra padding
        } else {
          setShouldBounce(false);
          setDistance(0);
        }
      }
    };
    
    // Check initially and on resize
    const timeout = setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text]);

  return (
    <div ref={containerRef} className={`overflow-hidden w-full relative flex items-center ${className}`}>
      <div 
        ref={textRef}
        className={`whitespace-nowrap inline-block ${shouldBounce ? 'animate-bounce-x' : ''}`}
        style={shouldBounce ? { '--bounce-dist': `${distance}px` } : {}}
      >
        {text}
      </div>
    </div>
  );
}
