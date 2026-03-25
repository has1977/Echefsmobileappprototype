import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Star, Send, X, Heart, ThumbsUp, CheckCircle } from 'lucide-react';

export function RateWaiterPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Get order details from localStorage
  const orders = JSON.parse(localStorage.getItem('echefs_waiter_orders') || '[]');
  const order = orders.find((o: any) => o.id === orderId);
  
  // Get waiter info
  const waiters = JSON.parse(localStorage.getItem('echefs_waiters') || '[]');
  const waiter = waiters.find((w: any) => w.id === order?.waiter_id) || waiters[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    // Save rating
    const ratings = JSON.parse(localStorage.getItem('echefs_waiter_ratings') || '[]');
    const newRating = {
      id: `rating-${Date.now()}`,
      waiter_id: waiter?.id || 'unknown',
      waiter_name: waiter?.name || 'Unknown Waiter',
      order_id: orderId || 'unknown',
      customer_name: customerName || 'Anonymous',
      rating,
      comment: comment.trim() || undefined,
      created_at: new Date().toISOString(),
    };

    ratings.push(newRating);
    localStorage.setItem('echefs_waiter_ratings', JSON.stringify(ratings));

    // Update waiter performance
    if (waiter) {
      const waiterRatings = ratings.filter((r: any) => r.waiter_id === waiter.id);
      const avgRating = waiterRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / waiterRatings.length;
      
      waiter.performance = {
        ...waiter.performance,
        avg_rating: avgRating,
      };

      const updatedWaiters = waiters.map((w: any) => 
        w.id === waiter.id ? waiter : w
      );
      localStorage.setItem('echefs_waiters', JSON.stringify(updatedWaiters));
    }

    setSubmitted(true);
    
    // Redirect after 2 seconds
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#FBF8F4] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-[#1F2933] mb-3">Thank You!</h2>
          <p className="text-[#6B7280] text-lg">
            Your feedback helps us improve our service
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#FBF8F4] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#667c67] to-[#546352] p-8 text-white relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
              {waiter?.name?.charAt(0) || 'W'}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Rate Your Service</h1>
              <p className="text-white/80 text-lg">
                How was {waiter?.name || 'your waiter'}?
              </p>
            </div>
          </div>
          
          {order && (
            <div className="flex items-center gap-4 text-sm text-white/70 mt-4">
              <span>Order: {order.order_number || orderId}</span>
              {order.table_number && <span>• Table: {order.table_number}</span>}
            </div>
          )}
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Star Rating */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-[#1F2933] mb-4 text-center">
              Rate Your Experience
            </label>
            <div className="flex items-center justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-16 h-16 transition-all ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-4"
              >
                <p className="text-2xl font-bold text-[#667c67]">
                  {rating === 5 && '🌟 Excellent!'}
                  {rating === 4 && '😊 Great!'}
                  {rating === 3 && '🙂 Good'}
                  {rating === 2 && '😐 Fair'}
                  {rating === 1 && '😞 Poor'}
                </p>
              </motion.div>
            )}
          </div>

          {/* Quick Feedback Buttons */}
          {rating >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <label className="block text-sm font-semibold text-[#1F2933] mb-3">
                What did you like? (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: ThumbsUp, label: 'Friendly' },
                  { icon: Star, label: 'Professional' },
                  { icon: CheckCircle, label: 'Fast Service' },
                  { icon: Heart, label: 'Attentive' },
                ].map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      const text = item.label;
                      setComment(prev => {
                        if (prev.includes(text)) {
                          return prev.replace(text, '').replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim();
                        }
                        return prev ? `${prev}, ${text}` : text;
                      });
                    }}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                      comment.includes(item.label)
                        ? 'bg-[#667c67] text-white shadow-md'
                        : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Customer Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1F2933] mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Anonymous"
              className="w-full px-4 py-3 bg-[#F9FAFB] border-0 rounded-xl focus:ring-2 focus:ring-[#667c67]/20"
            />
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1F2933] mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              rows={4}
              className="w-full px-4 py-3 bg-[#F9FAFB] border-0 rounded-xl resize-none focus:ring-2 focus:ring-[#667c67]/20"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={rating === 0}
            className="w-full bg-gradient-to-r from-[#667c67] to-[#546352] hover:from-[#546352] hover:to-[#667c67] text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Submit Rating
          </button>

          <p className="text-center text-sm text-[#9CA3AF] mt-4">
            Your feedback is anonymous and helps us improve
          </p>
        </form>
      </motion.div>
    </div>
  );
}
