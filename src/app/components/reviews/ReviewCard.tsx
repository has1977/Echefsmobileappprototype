import { Star, ThumbsUp, User } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { useState } from 'react';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
  response?: {
    text: string;
    date: string;
    author: string;
  };
}

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
}

export function ReviewCard({ review, onHelpful }: ReviewCardProps) {
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = () => {
    if (!hasVoted && onHelpful) {
      onHelpful(review.id);
      setHasVoted(true);
    }
  };

  return (
    <Card className="p-4 space-y-3">
      {/* User Info */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {review.userAvatar ? (
            <img src={review.userAvatar} alt={review.userName} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-primary" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm">{review.userName}</h4>
            {review.verified && (
              <Badge variant="secondary" className="text-xs">
                ✓ Verified
              </Badge>
            )}
          </div>
          
          {/* Rating & Date */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>

      {/* Helpful Button */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHelpful}
          disabled={hasVoted}
          className={`h-8 text-xs ${hasVoted ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 mr-1.5 ${hasVoted ? 'fill-primary' : ''}`} />
          Helpful ({review.helpful + (hasVoted ? 1 : 0)})
        </Button>
      </div>

      {/* Manager Response */}
      {review.response && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-muted/50 rounded-lg p-3 border-l-2 border-primary"
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              Response from {review.response.author}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(review.response.date).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm">{review.response.text}</p>
        </motion.div>
      )}
    </Card>
  );
}
