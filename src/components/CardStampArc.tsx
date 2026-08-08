import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PhotoStamp {
  id: number;
  src?: string;
  alt?: string;
  caption?: string;
  color?: string;
}

export interface CardStampArcProps {
  arc?: number;
  spread?: number;
  yOffset?: number;
  isColorful?: boolean;
  duration?: number;
  hoverIntensity?: number;
  className?: string;
  photos?: PhotoStamp[];
}

const defaultStamps: PhotoStamp[] = [
  { id: 0, caption: 'Life & Moments', color: 'from-amber-500/20 to-rose-500/20' },
  { id: 1, caption: 'Travels & Places', color: 'from-sky-500/20 to-indigo-500/20' },
  { id: 2, caption: 'Off Screen', color: 'from-emerald-500/20 to-teal-500/20' },
  { id: 3, caption: 'Costa Rica', color: 'from-purple-500/20 to-pink-500/20' },
  { id: 4, caption: 'Everyday Notes', color: 'from-orange-500/20 to-yellow-500/20' }
];

export default function CardStampArc({
  arc = 25,
  spread = 180,
  yOffset = 40,
  isColorful = false,
  duration = 0.5,
  hoverIntensity = 1,
  className = '',
  photos
}: CardStampArcProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stampsList = photos && photos.length > 0 ? photos : defaultStamps;
  const count = stampsList.length;
  const centerIdx = (count - 1) / 2;

  // Responsive spread and offsets for Mobile First design
  const effectiveSpread = isMobile ? Math.min(spread, 105) : spread;
  const effectiveYOffset = isMobile ? yOffset * 0.65 : yOffset;
  const effectiveArc = isMobile ? arc * 0.75 : arc;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredCardId(null);
      }}
      onClick={() => setIsHovered(prev => !prev)}
      className={`relative w-[7.5rem] h-[10.5rem] sm:w-[9.5rem] sm:h-[13rem] cursor-pointer flex items-center justify-center select-none ${className}`}
    >
      {stampsList.map((stamp, i) => {
        const dist = i - centerIdx;
        const normalizedDist = centerIdx > 0 ? dist / centerIdx : 0; // scale -1 to +1
        
        let targetRotate = 0;
        let targetX = 0;
        let targetY = 0;

        if (isHovered) {
          if (count === 5) {
            if (i === 0) {
              targetRotate = -1 * effectiveArc;
              targetX = -1 * effectiveSpread;
              targetY = effectiveYOffset;
            } else if (i === 1) {
              targetRotate = -0.48 * effectiveArc;
              targetX = -0.5 * effectiveSpread;
              targetY = 0.25 * effectiveYOffset;
            } else if (i === 2) {
              targetRotate = 0;
              targetX = 0;
              targetY = -0.25 * effectiveYOffset;
            } else if (i === 3) {
              targetRotate = 0.48 * effectiveArc;
              targetX = 0.5 * effectiveSpread;
              targetY = 0.25 * effectiveYOffset;
            } else if (i === 4) {
              targetRotate = effectiveArc;
              targetX = effectiveSpread;
              targetY = effectiveYOffset;
            }
          } else {
            targetRotate = normalizedDist * effectiveArc;
            targetX = normalizedDist * effectiveSpread;
            targetY = Math.abs(normalizedDist) * effectiveYOffset * 0.8;
          }

          targetRotate *= hoverIntensity;
          targetX *= hoverIntensity;
          targetY *= hoverIntensity;
        }

        const isThisCardHovered = hoveredCardId === stamp.id || (hoveredCardId === null && isHovered && i === Math.floor(centerIdx));

        return (
          <motion.div
            key={stamp.id}
            onMouseEnter={() => setHoveredCardId(stamp.id)}
            animate={{
              rotate: targetRotate,
              x: targetX,
              y: targetY,
              scale: isHovered ? (hoveredCardId === stamp.id ? 1.08 : (dist === 0 ? 1.04 : 0.98)) : 1
            }}
            transition={{
              type: "spring",
              stiffness: 190,
              damping: 22,
              mass: 0.8,
              duration
            }}
            style={{
              zIndex: hoveredCardId === stamp.id ? 20 : 10 - Math.round(Math.abs(dist)),
              originX: 0.5,
              originY: 1
            }}
            className={`absolute inset-0 rounded-xl sm:rounded-2xl p-2 pb-5 sm:p-2.5 sm:pb-7 flex flex-col bg-white text-zinc-900 border border-zinc-200/90 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.18)] dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800 dark:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.4)] ${
              isColorful && stamp.color ? `bg-gradient-to-br ${stamp.color}` : ''
            }`}
          >
            {/* Polaroid Tooltip Caption */}
            <AnimatePresence>
              {isHovered && isThisCardHovered && stamp.caption && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: -38, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none z-30"
                >
                  <span className="px-2.5 py-1 rounded-full bg-zinc-900/95 text-white dark:bg-white/95 dark:text-zinc-900 text-[10px] sm:text-[11px] font-medium shadow-md border border-white/20 dark:border-black/20 whitespace-nowrap flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500 animate-pulse"></span>
                    {stamp.caption}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Photo Container Area */}
            <div className="relative w-full flex-1 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/50 flex flex-col items-center justify-center">
              {stamp.src ? (
                <img
                  src={stamp.src}
                  alt={stamp.alt || stamp.caption || `Photo ${stamp.id + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                /* Elegant Photo Placeholder Slot */
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-200/80 dark:bg-zinc-700/60 flex items-center justify-center mb-1 text-zinc-400 dark:text-zinc-500">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M68 400" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 dark:text-zinc-500 tracking-tight">
                    Photo {stamp.id + 1}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Polaroid Margin Label */}
            <div className="h-4 sm:h-5 w-full flex items-center justify-between px-1 mt-1">
              <span className="text-[8px] sm:text-[9px] font-mono text-zinc-400 dark:text-zinc-500 truncate">
                {stamp.caption || `stamp #${stamp.id + 1}`}
              </span>
              <span className="text-[7px] sm:text-[8px] font-mono text-zinc-300 dark:text-zinc-600">
                0{stamp.id + 1}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
