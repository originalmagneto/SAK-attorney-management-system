import React from "react";
import { motion, useAnimation } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number; // in ms
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 800, className }) => {
  const [display, setDisplay] = React.useState(value);
  const controls = useAnimation();
  const prevValue = React.useRef(value);

  React.useEffect(() => {
    if (prevValue.current !== value) {
      controls.start({
        number: value,
        transition: { duration: duration / 1000, ease: "easeInOut" },
      });
      prevValue.current = value;
    }
  }, [value, duration, controls]);

  React.useEffect(() => {
    controls.set({ number: prevValue.current });
    controls.start({ number: value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.span
      className={className}
      animate={controls}
      initial={{ number: value }}
      onUpdate={(latest) => {
        if (typeof latest.number === "number") {
          setDisplay(Math.round(latest.number));
        }
      }}
    >
      {display}
    </motion.span>
  );
};

export default AnimatedNumber;
