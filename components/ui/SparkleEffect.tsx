import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface SparkleEffectProps {
  trigger: boolean;
  duration?: number;
  style?: React.CSSProperties;
}

const random = (min: number, max: number) => Math.random() * (max - min) + min;

export const SparkleEffect: React.FC<SparkleEffectProps> = ({ trigger, duration = 800, style }) => {
  const controls = useAnimation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (trigger) {
      controls.start('visible');
      timeoutRef.current = setTimeout(() => {
        controls.start('hidden');
      }, duration);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [trigger, controls, duration]);

  const sparkles = Array.from({ length: 18 }).map((_, i) => {
    const size = random(8, 18);
    return (
      <motion.div
        key={i}
        initial={{
          opacity: 0,
          scale: 0.6,
          x: 0,
          y: 0,
        }}
        animate={controls}
        variants={{
          visible: {
            opacity: [0, 1, 0],
            scale: [0.6, 1.1, 0.6],
            x: random(-40, 40),
            y: random(-40, 40),
            transition: { duration: duration / 1000, ease: 'easeInOut' },
          },
          hidden: { opacity: 0, scale: 0.6, x: 0, y: 0 },
        }}
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, #fff7b2 60%, #ffd700 100%)`,
          pointerEvents: 'none',
          ...style,
        }}
      />
    );
  });

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30 }}>
      {sparkles}
    </div>
  );
};
