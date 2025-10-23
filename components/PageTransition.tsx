import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export type TransitionType =
  | 'fade'           // 부드러운 페이드
  | 'slideUp'        // 아래에서 위로 슬라이드
  | 'slideDown'      // 위에서 아래로 슬라이드
  | 'slideLeft'      // 오른쪽에서 왼쪽으로
  | 'slideRight'     // 왼쪽에서 오른쪽으로
  | 'scale'          // 확대 효과
  | 'zoom'           // 줌 인/아웃
  | 'flip';          // 플립 효과

interface PageTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
  type?: TransitionType;
}

const transitionVariants: Record<TransitionType, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  },
  slideDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  flip: {
    initial: { opacity: 0, rotateY: -45, scale: 0.95 },
    animate: { opacity: 1, rotateY: 0, scale: 1 },
    exit: { opacity: 0, rotateY: 45, scale: 0.95 },
  },
};

const transitionConfig: Record<TransitionType, any> = {
  fade: {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1],
  },
  slideUp: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  slideDown: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  slideLeft: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  slideRight: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  scale: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  zoom: {
    duration: 0.35,
    ease: [0.4, 0, 0.2, 1],
  },
  flip: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1],
  },
};

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  transitionKey,
  type = 'fade'
}) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={transitionKey}
        variants={transitionVariants[type]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transitionConfig[type]}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          willChange: 'opacity, transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
