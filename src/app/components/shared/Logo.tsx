import { motion } from 'motion/react';
import logoImage from 'figma:asset/adfd8eda4651c072924f6e50b75db792db118f15.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  animate?: boolean;
}

const sizeClasses = {
  sm: 'h-14 w-14',
  md: 'h-18 w-18',
  lg: 'h-28 w-28',
  xl: 'h-36 w-36',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

export function Logo({ size = 'md', className = '', showText = true, animate = false }: LogoProps) {
  const LogoIcon = () => (
    <div className={`${sizeClasses[size]} relative`}>
      <img 
        src={logoImage}
        alt="eChefs Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );

  if (animate) {
    return (
      <motion.div 
        className={`flex items-center gap-3 ${className}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 150, damping: 15 }}
      >
        <LogoIcon />
        {showText && (
          <motion.span 
            className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-[#667c67] via-[#7a927b] to-[#546352] bg-clip-text text-transparent`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            eChefs
          </motion.span>
        )}
      </motion.div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon />
      {showText && (
        <span 
          className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-[#667c67] via-[#7a927b] to-[#546352] bg-clip-text text-transparent`}
        >
          eChefs
        </span>
      )}
    </div>
  );
}