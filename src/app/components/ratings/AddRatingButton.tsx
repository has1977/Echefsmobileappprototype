import { useState, useEffect } from 'react';
import { Star, MessageSquare, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';

interface AddRatingButtonProps {
  itemId: string;
  itemName: string;
  currentLanguage: string;
  onRatingAdded?: () => void;
}

export function AddRatingButton({ 
  itemId, 
  itemName, 
  currentLanguage,
  onRatingAdded 
}: AddRatingButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [rating, setRating] = useState(0);
  const [tasteRating, setTasteRating] = useState(0);
  const [presentationRating, setPresentationRating] = useState(0);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [hoverTaste, setHoverTaste] = useState(0);
  const [hoverPresentation, setHoverPresentation] = useState(0);

  const translations = {
    en: {
      addReview: 'Write a Review',
      rateItem: 'Rate This Item',
      overallRating: 'Overall Rating',
      tasteRating: 'Taste Rating',
      presentationRating: 'Presentation',
      yourName: 'Your Name',
      namePlaceholder: 'Enter your name (optional)',
      yourReview: 'Your Review',
      reviewPlaceholder: 'Share your thoughts about this item...',
      submit: 'Submit Review',
      cancel: 'Cancel',
      thankYou: 'Thank you for your review!',
      pending: 'Your review is pending approval',
      alreadyRated: 'You have already rated this item',
      required: 'Please provide an overall rating',
    },
    ar: {
      addReview: 'كتابة تقييم',
      rateItem: 'قيّم هذا العنصر',
      overallRating: 'التقييم العام',
      tasteRating: 'تقييم المذاق',
      presentationRating: 'العرض',
      yourName: 'اسمك',
      namePlaceholder: 'أدخل اسمك (اختياري)',
      yourReview: 'تقييمك',
      reviewPlaceholder: 'شارك رأيك حول هذا العنصر...',
      submit: 'إرسال التقييم',
      cancel: 'إلغاء',
      thankYou: 'شكراً لك على تقييمك!',
      pending: 'تقييمك قيد المراجعة',
      alreadyRated: 'لقد قيّمت هذا العنصر بالفعل',
      required: 'يرجى تقديم تقييم عام',
    },
    ru: {
      addReview: 'Написать отзыв',
      rateItem: 'Оценить товар',
      overallRating: 'Общая оценка',
      tasteRating: 'Вкус',
      presentationRating: 'Подача',
      yourName: 'Ваше имя',
      namePlaceholder: 'Введите ваше имя (необязательно)',
      yourReview: 'Ваш отзыв',
      reviewPlaceholder: 'Поделитесь своим мнением об этом блюде...',
      submit: 'Отправить отзыв',
      cancel: 'Отмена',
      thankYou: 'Спасибо за ваш отзыв!',
      pending: 'Ваш отзыв ожидает модерации',
      alreadyRated: 'Вы уже оценили этот товар',
      required: 'Пожалуйста, поставьте общую оценку',
    },
    ky: {
      addReview: 'Баа жазуу',
      rateItem: 'Буга баа берүү',
      overallRating: 'Жалпы баа',
      tasteRating: 'Даамы',
      presentationRating: 'Көрсөтүү',
      yourName: 'Атыңыз',
      namePlaceholder: 'Атыңызды киргизиңиз (милдеттүү эмес)',
      yourReview: 'Сиздин баа',
      reviewPlaceholder: 'Бул нерсе жөнүндө оюңузду бөлүшүңүз...',
      submit: 'Баа жөнөтүү',
      cancel: 'Жокко чыгаруу',
      thankYou: 'Баа бергениңиз үчүн рахмат!',
      pending: 'Сиздин баа текшерүүдө',
      alreadyRated: 'Сиз бул нерсеге баа бердиңиз',
      required: 'Жалпы баа бериңиз',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  useEffect(() => {
    checkIfRated();
  }, [itemId]);

  const checkIfRated = () => {
    const savedRatings = localStorage.getItem('echefs_item_ratings');
    if (savedRatings) {
      const allRatings = JSON.parse(savedRatings) as Record<string, any>;
      const userRating = Object.values(allRatings).find(
        (r: any) => r.itemId === itemId
      );
      setHasRated(!!userRating);
    }
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert(t.required);
      return;
    }

    const newRating = {
      itemId,
      orderId: `guest-${Date.now()}`,
      rating,
      tasteRating,
      presentationRating,
      comment,
      customerName: customerName || 'Guest',
      timestamp: new Date().toISOString(),
      approved: false, // Pending approval
    };

    const savedRatings = localStorage.getItem('echefs_item_ratings');
    const allRatings = savedRatings ? JSON.parse(savedRatings) : {};
    const ratingKey = `${itemId}_guest-${Date.now()}`;
    allRatings[ratingKey] = newRating;
    
    localStorage.setItem('echefs_item_ratings', JSON.stringify(allRatings));

    // Reset form
    setShowModal(false);
    setRating(0);
    setTasteRating(0);
    setPresentationRating(0);
    setComment('');
    setCustomerName('');
    setHasRated(true);

    if (onRatingAdded) {
      onRatingAdded();
    }

    alert(t.thankYou + '\n' + t.pending);
  };

  const StarRating = ({ 
    value, 
    hover, 
    onChange, 
    onHover 
  }: { 
    value: number; 
    hover: number; 
    onChange: (v: number) => void; 
    onHover: (v: number) => void;
  }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={() => onHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              star <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  if (hasRated) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <Check className="w-5 h-5 text-green-600" />
        <span className="text-green-700 font-medium">{t.alreadyRated}</span>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="w-full h-12 bg-gradient-to-r from-[#667c67] to-[#546352] hover:from-[#546352] hover:to-[#667c67] text-white font-semibold rounded-xl shadow-lg transition-all"
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        {t.addReview}
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{t.rateItem}</h3>
                  <p className="text-sm text-gray-600 mt-1">{itemName}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Overall Rating */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    {t.overallRating} <span className="text-red-500">*</span>
                  </label>
                  <StarRating
                    value={rating}
                    hover={hoverRating}
                    onChange={setRating}
                    onHover={setHoverRating}
                  />
                </div>

                {/* Taste Rating */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    {t.tasteRating}
                  </label>
                  <StarRating
                    value={tasteRating}
                    hover={hoverTaste}
                    onChange={setTasteRating}
                    onHover={setHoverTaste}
                  />
                </div>

                {/* Presentation Rating */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    {t.presentationRating}
                  </label>
                  <StarRating
                    value={presentationRating}
                    hover={hoverPresentation}
                    onChange={setPresentationRating}
                    onHover={setHoverPresentation}
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    {t.yourName}
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] outline-none transition-all"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    {t.yourReview}
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.reviewPlaceholder}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] outline-none resize-none transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-12 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className={`flex-1 h-12 rounded-xl font-semibold transition-all ${
                      rating === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#667c67] to-[#546352] hover:from-[#546352] hover:to-[#667c67] text-white shadow-lg'
                    }`}
                  >
                    {t.submit}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
