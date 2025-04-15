import React from "react";
import { motion, useAnimation } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number; // in ms
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 800, className }) => {
  const nodeRef = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(value);
  const prevValue = React.useRef(value);
  const animationRef = React.useRef<Animation>();

  React.useEffect(() => {
    if (prevValue.current !== value && nodeRef.current) {
      if (animationRef.current) {
        animationRef.current.cancel();
      }

      animationRef.current = nodeRef.current.animate(
        [
          { opacity: 1 },
          { opacity: 1 }
        ],
        {
          duration: duration,
          easing: 'ease-in-out',
        }
      );

      const startValue = prevValue.current;
      const diff = value - startValue;
      const startTime = performance.now();

      const updateValue = () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + diff * progress;
        setDisplay(Math.round(currentValue));

        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };

      requestAnimationFrame(updateValue);
      prevValue.current = value;
    }
  }, [value, duration]);

  return (
    <span ref={nodeRef} className={className}>
      {display}
    </span>
  );
};

export default AnimatedNumber;
