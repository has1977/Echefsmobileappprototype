/**
 * eChefs Premium Component Library
 * Enterprise-grade UI components with world-class design
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { designTokens } from './tokens';
import { ArrowLeft, ShoppingCart, User, Globe, Home, UtensilsCrossed, Gift, Heart } from 'lucide-react';

// ==========================================
// PROFESSIONAL TOP NAVIGATION
// ==========================================
interface TopNavProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  showUser?: boolean;
  showLanguage?: boolean;
  cartCount?: number;
  favoritesCount?: number;
  onLanguageChange?: (lang: string) => void;
  currentLanguage?: string;
  languages?: Array<{ code: string; name: string; nativeName: string; flag: string }>;
  transparent?: boolean;
  children?: ReactNode;
}

export const TopNav = ({
  title,
  showBack = true,
  showCart = true,
  showUser = true,
  showLanguage = true,
  cartCount = 0,
  favoritesCount = 0,
  onLanguageChange,
  currentLanguage = 'en',
  languages = [],
  transparent = false,
  children,
}: TopNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLangMenu, setShowLangMenu] = React.useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const shouldShowBack = showBack && location.pathname !== '/';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-40 ${
        transparent
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50'
          : 'bg-gradient-to-r from-[#667c67] via-[#667c67] to-[#546352] text-white'
      } shadow-lg`}
    >
      <div className="flex items-center justify-between px-5 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {shouldShowBack && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                transparent
                  ? 'bg-gray-100 hover:bg-gray-200 text-[#667c67]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          )}
          {title && (
            <h1
              className={`text-lg font-bold truncate ${
                transparent ? 'text-[#1F2933]' : 'text-white'
              }`}
            >
              {title}
            </h1>
          )}
          {children}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {showLanguage && languages.length > 0 && (
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  transparent
                    ? 'bg-gray-100 hover:bg-gray-200 text-[#667c67]'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Globe className="w-5 h-5" />
              </motion.button>

              {showLangMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLangMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl py-2 min-w-[160px] z-50 border border-gray-100 overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange?.(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-[#667c67]/10 transition-all flex items-center gap-3 ${
                          currentLanguage === lang.code
                            ? 'bg-[#667c67]/10 text-[#667c67] font-bold'
                            : 'text-gray-700 font-medium'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm">{lang.nativeName}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          )}

          {showCart && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/favorites')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
                transparent
                  ? 'bg-gray-100 hover:bg-gray-200 text-[#667c67]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-[#667c67] to-[#546352] text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center font-bold shadow-lg"
                >
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </motion.span>
              )}
            </motion.button>
          )}

          {showUser && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/profile')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                transparent
                  ? 'bg-gray-100 hover:bg-gray-200 text-[#667c67]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <User className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

// ==========================================
// PROFESSIONAL BOTTOM NAVIGATION
// ==========================================
interface BottomNavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
}

interface BottomNavProps {
  items: BottomNavItem[];
}

export const BottomNav = ({ items }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (itemPath: string) => {
    if (itemPath === '/') return location.pathname === '/';
    if (itemPath.includes('/menu')) return location.pathname.includes('/menu');
    if (itemPath.includes('/promotions')) return location.pathname.includes('/promotions');
    return location.pathname === itemPath;
  };

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl safe-area-bottom"
    >
      <div className="grid h-20" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={(e) => handleNavigation(e, item.path)}
              className="relative flex flex-col items-center justify-center gap-1"
            >
              {/* Active Indicator */}
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[#667c67] to-[#546352] rounded-b-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon Container */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <motion.div
                  animate={{
                    scale: active ? 1 : 0.9,
                    y: active ? -2 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    active
                      ? 'bg-gradient-to-br from-[#667c67] to-[#546352] shadow-lg'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      active ? 'text-white' : 'text-[#9CA3AF]'
                    }`}
                  />
                </motion.div>

                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-[#DC2626] to-[#9B1A1A] text-white text-xs rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center font-bold shadow-lg border-2 border-white"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.span>
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`text-xs font-semibold transition-all ${
                  active ? 'text-[#667c67]' : 'text-[#9CA3AF]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};

// ==========================================
// GLASS CARD - Premium frosted glass effect
// ==========================================
interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'flat';
  blur?: 'sm' | 'md' | 'lg';
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, variant = 'default', blur = 'md', className = '', ...props }, ref) => {
    const variants = {
      default: 'bg-white/80 backdrop-blur-md border border-white/20',
      elevated: 'bg-white/90 backdrop-blur-lg border border-white/30 shadow-2xl',
      flat: 'bg-white/70 backdrop-blur-sm border border-white/10',
    };

    const blurClasses = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
    };

    return (
      <motion.div
        ref={ref}
        className={`${variants[variant]} rounded-2xl ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

// ==========================================
// GRADIENT BUTTON - Premium CTA
// ==========================================
interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    fullWidth = false,
    loading = false,
    className = '',
    disabled,
    ...props
  }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-[#667c67] via-[#667c67] to-[#546352] text-white shadow-lg hover:shadow-xl hover:from-[#546352] hover:via-[#667c67] hover:to-[#667c67] active:shadow-md',
      secondary: 'bg-gradient-to-r from-[#E4DBC4] to-[#D4C9A8] text-[#667c67] shadow-md hover:shadow-lg active:shadow-sm',
      ghost: 'bg-transparent border-2 border-[#667c67] text-[#667c67] hover:bg-[#667c67] hover:text-white',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-5 text-base',
      lg: 'h-14 px-6 text-base',
      xl: 'h-16 px-8 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={`
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
          font-semibold rounded-xl flex items-center justify-center gap-2
          transition-all duration-250 ease-out
          ${className}
        `}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span className="flex-1">{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

GradientButton.displayName = 'GradientButton';

// ==========================================
// SECTION HEADER - Premium page titles
// ==========================================
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const SectionHeader = ({ title, subtitle, action, icon }: SectionHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          {icon && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center shadow-lg"
            >
              <span className="text-white">{icon}</span>
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-[#1F2933] tracking-tight"
          >
            {title}
          </motion.h1>
        </div>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[#6B7280] text-sm font-medium"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {action}
        </motion.div>
      )}
    </div>
  );
};

// ==========================================
// STAT CARD - Premium metrics display
// ==========================================
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const StatCard = ({ label, value, icon, trend, variant = 'default' }: StatCardProps) => {
  const variantColors = {
    default: 'from-[#667c67] to-[#546352]',
    success: 'from-[#16A34A] to-[#0F8B3A]',
    warning: 'from-[#F59E0B] to-[#B76B00]',
    error: 'from-[#DC2626] to-[#9B1A1A]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <GlassCard variant="elevated" className="p-5 relative overflow-hidden group">
        {/* Gradient accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${variantColors[variant]}`} />
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-[#6B7280] text-sm font-medium mb-1">{label}</p>
            <p className="text-[#1F2933] text-3xl font-bold tracking-tight">{value}</p>
            
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${
                trend.direction === 'up' ? 'text-[#16A34A]' : 'text-[#DC2626]'
              }`}>
                <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${variantColors[variant]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <span className="text-white">{icon}</span>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

// ==========================================
// CHIP - Premium tag/badge component
// ==========================================
import { X } from 'lucide-react';

interface ChipProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  onRemove?: () => void;
}

export const Chip = ({ children, variant = 'default', size = 'md', icon, onRemove }: ChipProps) => {
  const variants = {
    default: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
    success: 'bg-[#DCFCE7] text-[#0F8B3A] border-[#86EFAC]',
    warning: 'bg-[#FEF3C7] text-[#B76B00] border-[#FDE68A]',
    error: 'bg-[#FEE2E2] text-[#9B1A1A] border-[#FECACA]',
    info: 'bg-[#DBEAFE] text-[#184FC5] border-[#BFDBFE]',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  };

  return (
    <span className={`
      inline-flex items-center font-semibold rounded-full border
      ${variants[variant]}
      ${sizes[size]}
    `}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 w-4 h-4 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors ml-1"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

// ==========================================
// FLOATING ACTION BUTTON - Premium FAB
// ==========================================
interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export const FAB = ({ icon, label, position = 'bottom-right', className = '', ...props }: FABProps) => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        fixed ${positions[position]} z-50
        ${label ? 'px-6 h-14 gap-3' : 'w-14 h-14'}
        bg-gradient-to-r from-[#667c67] to-[#546352]
        text-white font-semibold rounded-full
        shadow-2xl hover:shadow-3xl
        flex items-center justify-center
        ${className}
      `}
      {...props}
    >
      <span className="flex-shrink-0">{icon}</span>
      {label && <span>{label}</span>}
    </motion.button>
  );
};

// ==========================================
// SKELETON LOADER - Premium loading state
// ==========================================
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton = ({ variant = 'text', width, height, className = '' }: SkeletonProps) => {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <motion.div
      className={`
        bg-gradient-to-r from-[#F3F4F6] via-[#E5E7EB] to-[#F3F4F6]
        ${variants[variant]}
        ${className}
      `}
      style={{ width: width || '100%', height }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

// ==========================================
// EMPTY STATE - Premium placeholder
// ==========================================
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] flex items-center justify-center mb-4 shadow-md"
      >
        <span className="text-[#9CA3AF] text-4xl">{icon}</span>
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-[#1F2933] mb-2"
      >
        {title}
      </motion.h3>
      
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[#6B7280] text-sm max-w-xs mb-6"
        >
          {description}
        </motion.p>
      )}
      
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

// ==========================================
// PREMIUM SWITCH - Professional Toggle
// ==========================================
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  showStatus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'primary';
}

export const Switch = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  showStatus = false,
  size = 'md',
  variant = 'primary',
}: SwitchProps) => {
  const sizes = {
    sm: { track: 'h-6 w-10', thumb: 'h-4 w-4', translate: 16 },
    md: { track: 'h-8 w-14', thumb: 'h-6 w-6', translate: 24 },
    lg: { track: 'h-10 w-[4.5rem]', thumb: 'h-8 w-8', translate: 32 },
  };

  const variants = {
    default: 'from-[#667c67] to-[#546352]',
    success: 'from-[#16A34A] to-[#0F8B3A]',
    primary: 'from-[#667c67] via-[#667c67] to-[#546352]',
  };

  const sizeConfig = sizes[size];
  const variantColor = variants[variant];

  return (
    <div className="flex items-start gap-3">
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          ${sizeConfig.track} relative inline-flex items-center rounded-full
          transition-all duration-300 ease-in-out flex-shrink-0
          focus:outline-none focus:ring-2 focus:ring-[#667c67] focus:ring-offset-2
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${
            checked
              ? `bg-gradient-to-r ${variantColor} shadow-lg`
              : 'bg-[#E5E7EB] hover:bg-[#D1D5DB]'
          }
        `}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        {/* Thumb */}
        <motion.span
          className={`
            ${sizeConfig.thumb} inline-block rounded-full bg-white
            shadow-lg transform transition-transform duration-300 ease-in-out
          `}
          animate={{
            x: checked ? sizeConfig.translate : 4,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {/* Inner checkmark or X */}
          <motion.span
            className="w-full h-full flex items-center justify-center"
            initial={false}
            animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {checked && (
              <svg
                className="w-3 h-3 text-[#667c67]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </motion.span>
        </motion.span>
      </motion.button>

      {/* Label and Description */}
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <div className="flex items-center gap-2 mb-0.5">
              <label
                className={`font-semibold text-[#374151] ${disabled ? 'opacity-50' : ''} cursor-pointer`}
                onClick={() => !disabled && onChange(!checked)}
              >
                {label}
              </label>
              {showStatus && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    checked
                      ? 'bg-[#DCFCE7] text-[#0F8B3A]'
                      : 'bg-[#F3F4F6] text-[#6B7280]'
                  }`}
                >
                  {checked ? 'ON' : 'OFF'}
                </motion.span>
              )}
            </div>
          )}
          {description && (
            <p className={`text-sm text-[#6B7280] ${disabled ? 'opacity-50' : ''}`}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};