'use client';
import { motion } from 'framer-motion';

export default function LogoLoader() {
  return (
    <div className="flex items-center gap-2 text-primary">
      <motion.div
        className="h-2 w-2 rounded-full bg-primary"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
      />
      <span className="font-semibold">JA</span>
      <span className="text-muted-foreground">Tracker</span>
    </div>
  );
}
