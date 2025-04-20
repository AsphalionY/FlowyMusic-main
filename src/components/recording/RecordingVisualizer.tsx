
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RecordingVisualizerProps {
  isPlaying: boolean;
  isPaused: boolean;
}

const RecordingVisualizer = ({ isPlaying, isPaused }: RecordingVisualizerProps) => {
  if (!isPlaying) return null;

  return (
    <div className="w-full h-24 mb-8 flex items-center justify-center">
      <motion.div 
        animate={{ 
          scaleY: isPaused ? [1, 1] : [1, 1.5, 1, 0.5, 1, 1.8, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="flex items-end gap-1 h-full"
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 bg-primary/80 rounded-full"
            animate={{ 
              height: isPaused ? "30%" : `${Math.random() * 80 + 20}%`,
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.05 % 0.5
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default RecordingVisualizer;
