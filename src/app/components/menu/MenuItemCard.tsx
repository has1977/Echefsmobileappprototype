import { Star, Plus, Flame, Sparkles, TrendingUp, Percent } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { MenuItem } from '../../lib/types';

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  onClick: (item: MenuItem) => void;
  language: string;
}

export function MenuItemCard({ item, onAdd, onClick, language }: MenuItemCardProps) {
  const translation = item.translations[language];
  const hasDiscount = item.discount && item.discount > 0;
  const discountedPrice = hasDiscount ? item.price * (1 - item.discount! / 100) : item.price;

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'hot': return <Flame className="w-3 h-3" />;
      case 'new': return <Sparkles className="w-3 h-3" />;
      case 'popular': return <TrendingUp className="w-3 h-3" />;
      case 'discount': return <Percent className="w-3 h-3" />;
      default: return null;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'hot': return 'bg-red-500 text-white';
      case 'new': return 'bg-blue-500 text-white';
      case 'popular': return 'bg-purple-500 text-white';
      case 'discount': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
        <div onClick={() => onClick(item)}>
          {/* Image */}
          <div className="relative h-44 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={translation.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Badges */}
            {item.badges && item.badges.length > 0 && (
              <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                {item.badges.map((badge, index) => (
                  <Badge 
                    key={index}
                    className={`${getBadgeColor(badge)} border-none shadow-lg text-xs font-semibold flex items-center gap-1`}
                  >
                    {getBadgeIcon(badge)}
                    {badge.charAt(0).toUpperCase() + badge.slice(1)}
                  </Badge>
                ))}
              </div>
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-red-500 text-white border-none shadow-lg font-bold">
                  -{item.discount}%
                </Badge>
              </div>
            )}

            {/* Rating */}
            {item.rating && (
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-white text-xs font-semibold">{item.rating.toFixed(1)}</span>
                <span className="text-white/70 text-xs">({item.reviewCount || 0})</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-2">
            {/* Name & Description */}
            <div>
              <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                {translation.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {translation.description}
              </p>
            </div>

            {/* Dietary Info */}
            {item.dietary && item.dietary.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.dietary.map((diet, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {diet === 'vegetarian' && '🥬'}
                    {diet === 'vegan' && '🌱'}
                    {diet === 'glutenFree' && '🌾'}
                    {diet === 'halal' && '☪️'}
                    {diet}
                  </Badge>
                ))}
              </div>
            )}

            {/* Price & Add Button */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${item.price.toFixed(2)}
                  </span>
                )}
                <span className={`font-bold ${hasDiscount ? 'text-red-500 text-lg' : 'text-primary text-base'}`}>
                  ${discountedPrice.toFixed(2)}
                </span>
              </div>

              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(item);
                }}
                className="bg-primary hover:bg-primary/90 rounded-full h-9 px-4"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
