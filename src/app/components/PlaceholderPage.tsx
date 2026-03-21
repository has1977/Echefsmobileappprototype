import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { ChevronLeft, Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-[#667c67] text-white p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md"
        >
          <Card className="p-8">
            <div className="w-24 h-24 mx-auto bg-[#667c67]/10 rounded-full flex items-center justify-center mb-6">
              {icon || <Construction className="w-12 h-12 text-[#667c67]" />}
            </div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground mb-6">
              {description || 'This page is being built with love. Check back soon!'}
            </p>
            <Button
              onClick={() => navigate(-1)}
              className="bg-[#667c67] hover:bg-[#526250]"
            >
              Go Back
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
