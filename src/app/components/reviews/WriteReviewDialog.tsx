import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface WriteReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  itemName: string;
}

export function WriteReviewDialog({ isOpen, onClose, onSubmit, itemName }: WriteReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (comment.trim().length < 10) {
      toast.error('Please write at least 10 characters');
      return;
    }
    
    onSubmit(rating, comment);
    toast.success('Review submitted successfully!');
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-primary text-white p-4 flex items-center justify-between">
                <h3 className="font-semibold">Write a Review</h3>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Item Name */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Rating for</p>
                  <h4 className="font-semibold text-lg">{itemName}</h4>
                </div>

                {/* Star Rating */}
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm font-medium">Tap to rate</p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileTap={{ scale: 1.2 }}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-10 h-10 transition-all ${
                            star <= (hoverRating || rating)
                              ? 'fill-yellow-400 text-yellow-400 scale-110'
                              : 'text-gray-300'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium text-primary"
                    >
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                    </motion.p>
                  )}
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Review</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience... (minimum 10 characters)"
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {comment.length} characters
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-muted/30 flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={rating === 0 || comment.trim().length < 10}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
