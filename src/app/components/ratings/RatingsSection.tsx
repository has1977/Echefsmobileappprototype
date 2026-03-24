import { useState, useEffect } from 'react';
import { Star, MessageSquare, User, Clock, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../ui/badge';

interface ItemRatingData {
  itemId: string;
  orderId: string;
  rating: number;
  comment: string;
  timestamp?: string;
  approved?: boolean;
  customerName?: string;
  tasteRating?: number;
  presentationRating?: number;
}

interface RatingsSectionProps {
  itemId: string;
  currentLanguage: string;
  refreshTrigger?: number;
}

export function RatingsSection({ itemId, currentLanguage, refreshTrigger }: RatingsSectionProps) {
  const [ratings, setRatings] = useState<ItemRatingData[]>([]);
  const [showAll, setShowAll] = useState(false);

  const translations = {
    en: {
      reviews: 'Reviews',
      noReviews: 'No reviews yet',
      beFirst: 'Be the first to review this item',
      taste: 'Taste',
      presentation: 'Presentation',
      helpful: 'Helpful',
      viewAll: 'View all reviews',
      showLess: 'Show less',
      verified: 'Verified Purchase',
    },
    ar: {
      reviews: 'التقييمات',
      noReviews: 'لا توجد تقييمات بعد',
      beFirst: 'كن أول من يقيم هذا العنصر',
      taste: 'المذاق',
      presentation: 'العرض',
      helpful: 'مفيد',
      viewAll: 'عرض جميع التقييمات',
      showLess: 'عرض أقل',
      verified: 'عملية شراء موثقة',
    },
    ru: {
      reviews: 'Отзывы',
      noReviews: 'Пока нет отзывов',
      beFirst: 'Будьте первым, кто оценит этот товар',
      taste: 'Вкус',
      presentation: 'Подача',
      helpful: 'Полезно',
      viewAll: 'Все отзывы',
      showLess: 'Скрыть',
      verified: 'Подтвержденная покупка',
    },
    ky: {
      reviews: 'Баалоолор',
      noReviews: 'Али баалоо жок',
      beFirst: 'Биринчи болуп баа берүүчү болуңуз',
      taste: 'Даамы',
      presentation: 'Көрсөтүү',
      helpful: 'Пайдалуу',
      viewAll: 'Бардык баалоолорду көрүү',
      showLess: 'Азыраак көрсөтүү',
      verified: 'Ырасталган сатып алуу',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  useEffect(() => {
    loadRatings();
  }, [itemId, refreshTrigger]);

  const loadRatings = () => {
    const savedRatings = localStorage.getItem('echefs_item_ratings');
    if (savedRatings) {
      const allRatings = JSON.parse(savedRatings) as Record<string, ItemRatingData>;
      const itemRatings = Object.values(allRatings)
        .filter(r => r.itemId === itemId && r.approved === true)
        .sort((a, b) => {
          const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return timeB - timeA;
        });
      setRatings(itemRatings);
    }
  };

  const calculateAverageRating = () => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / ratings.length;
  };

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 
                                   currentLanguage === 'ru' ? 'ru-RU' :
                                   currentLanguage === 'ky' ? 'ky-KG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const displayedRatings = showAll ? ratings : ratings.slice(0, 3);
  const averageRating = calculateAverageRating();

  if (ratings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">{t.noReviews}</h3>
        <p className="text-gray-600">{t.beFirst}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t.reviews}</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-600">
              ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = ratings.filter(r => Math.round(r.rating) === stars).length;
          const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
          
          return (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm font-semibold text-gray-700">{stars}</span>
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="h-full bg-yellow-400 rounded-full"
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <AnimatePresence>
          {displayedRatings.map((review, index) => (
            <motion.div
              key={`${review.itemId}_${review.orderId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-50 rounded-xl p-4 space-y-3"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#667c67] to-[#546352] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {review.customerName || 'Guest'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(review.timestamp)}</span>
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                        {t.verified}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Sub-ratings */}
              {(review.tasteRating || review.presentationRating) && (
                <div className="flex items-center gap-4 text-sm">
                  {review.tasteRating && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{t.taste}:</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.tasteRating!
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {review.presentationRating && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{t.presentation}:</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.presentationRating!
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Comment */}
              {review.comment && (
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              )}

              {/* Helpful Button */}
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#667c67] transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>{t.helpful}</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* View All Button */}
        {ratings.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-3 rounded-xl font-semibold text-[#667c67] bg-[#667c67]/10 hover:bg-[#667c67]/20 transition-all"
          >
            {showAll ? t.showLess : `${t.viewAll} (${ratings.length})`}
          </button>
        )}
      </div>
    </div>
  );
}