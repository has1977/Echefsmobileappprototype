import { motion } from 'motion/react';
import { Loader2, UtensilsCrossed } from 'lucide-react';
import { Logo } from './Logo';

interface LoadingStateProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ 
  variant = 'spinner', 
  size = 'md',
  message,
  fullScreen = false 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#e4dbc4] via-[#f0eadc] to-[#e4dbc4] z-50'
    : 'flex flex-col items-center justify-center p-8';

  if (variant === 'spinner') {
    return (
      <div className={containerClasses}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={sizeClasses[size]}
        >
          <Loader2 className="w-full h-full text-[#667c67]" />
        </motion.div>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[#667c67] font-medium text-sm"
          >
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={containerClasses}>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className={`rounded-full bg-[#667c67] ${
                size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
              }`}
            />
          ))}
        </div>
        {message && (
          <p className="mt-4 text-[#667c67] font-medium text-sm">{message}</p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={containerClasses}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <UtensilsCrossed className={`${sizeClasses[size]} text-[#667c67]`} />
        </motion.div>
        {message && (
          <p className="mt-4 text-[#667c67] font-medium text-sm">{message}</p>
        )}
      </div>
    );
  }

  // Skeleton variant
  return (
    <div className="space-y-4 p-4 w-full">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl animate-shimmer"
          style={{
            backgroundSize: '200% 100%',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

// Full screen branded loading
export function BrandedLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#e4dbc4] via-[#f0eadc] to-[#e4dbc4] z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center p-4">
          <Logo size="lg" showText={false} />
        </div>
        
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-4 border-[#667c67]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 space-y-2 text-center"
      >
        <h2 className="text-2xl font-bold text-[#667c67]">eChefs</h2>
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-2 h-2 rounded-full bg-[#667c67]"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
