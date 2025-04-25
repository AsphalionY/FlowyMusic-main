import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RecordingVisualizerProps {
  isPlaying: boolean;
  isPaused: boolean;
}

const RecordingVisualizer = ({ isPlaying, isPaused }: RecordingVisualizerProps) => {
  // Générer un tableau de valeurs aléatoires stables pour les barres
  const visualBars = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      id: Math.random().toString(36).substring(2, 9), // ID unique pour chaque barre
      height: Math.random() * 80 + 20,
      duration: 0.5 + Math.random() * 0.5,
    }));
  }, []);

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
          repeatType: 'reverse',
        }}
        className="flex items-end gap-1 h-full"
      >
        {visualBars.map(bar => (
          <motion.div
            key={bar.id}
            className="w-1.5 bg-primary/80 rounded-full"
            animate={{
              height: isPaused ? '30%' : `${bar.height}%`,
            }}
            transition={{
              duration: bar.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: (visualBars.indexOf(bar) * 0.05) % 0.5,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default RecordingVisualizer;
