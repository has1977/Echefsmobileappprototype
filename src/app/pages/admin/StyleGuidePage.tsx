import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Logo } from '../../components/shared/Logo';
import { LoadingState, BrandedLoader } from '../../components/shared/LoadingState';
import { useState } from 'react';
import { 
  Check, X, AlertCircle, Info, Sparkles, Heart, Star, 
  ShoppingCart, Gift, Crown, Zap 
} from 'lucide-react';

export function StyleGuidePage() {
  const [showLoader, setShowLoader] = useState(false);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-[#667c67]">eChefs Design System</h1>
        <p className="text-gray-600 text-lg">
          A comprehensive mobile-first design system built with brand colors #667c67 and #e4dbc4
        </p>
      </div>

      {/* Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Brand Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Green */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Primary Green (#667c67)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: '50', color: '#f5f7f5' },
                { name: '100', color: '#e8ede8' },
                { name: '200', color: '#d1dcd2' },
                { name: '300', color: '#a8b5a9' },
                { name: '400', color: '#8a9d8b' },
                { name: '500', color: '#667c67' },
                { name: '600', color: '#526250' },
                { name: '700', color: '#3e4a3f' },
                { name: '800', color: '#2a312b' },
                { name: '900', color: '#171918' },
              ].map((shade) => (
                <div key={shade.name} className="space-y-2">
                  <div
                    className="h-24 rounded-xl shadow-md border border-gray-200"
                    style={{ backgroundColor: shade.color }}
                  />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{shade.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{shade.color}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accent Beige */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Accent Beige (#e4dbc4)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: '50', color: '#fdfcfa' },
                { name: '100', color: '#f8f5ef' },
                { name: '200', color: '#f0eadc' },
                { name: '300', color: '#e4dbc4' },
                { name: '400', color: '#d4c9a8' },
                { name: '500', color: '#c4b88c' },
                { name: '600', color: '#a89870' },
                { name: '700', color: '#8c7954' },
                { name: '800', color: '#6d5e42' },
                { name: '900', color: '#4e4330' },
              ].map((shade) => (
                <div key={shade.name} className="space-y-2">
                  <div
                    className="h-24 rounded-xl shadow-md border border-gray-200"
                    style={{ backgroundColor: shade.color }}
                  />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{shade.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{shade.color}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-bold">Heading 2</h2>
            <h3 className="text-2xl font-semibold">Heading 3</h3>
            <h4 className="text-xl font-semibold">Heading 4</h4>
            <p className="text-base">Body text - The quick brown fox jumps over the lazy dog</p>
            <p className="text-sm text-gray-600">Small text - Supporting information and captions</p>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Buttons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold">Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="accent">Accent Gradient</Button>
              <Button variant="light">Light</Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">With Icons</h3>
            <div className="flex flex-wrap gap-3">
              <Button>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="secondary">
                <Heart className="w-4 h-4 mr-2" />
                Favorite
              </Button>
              <Button variant="outline">
                <Star className="w-4 h-4 mr-2" />
                Rate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge className="bg-[#667c67] text-white">Primary</Badge>
            <Badge className="bg-green-500 text-white">Success</Badge>
            <Badge className="bg-yellow-500 text-white">Warning</Badge>
            <Badge className="bg-blue-500 text-white">Info</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Icons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Icon System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {[
              { Icon: ShoppingCart, name: 'Cart' },
              { Icon: Gift, name: 'Gift' },
              { Icon: Crown, name: 'Crown' },
              { Icon: Heart, name: 'Heart' },
              { Icon: Star, name: 'Star' },
              { Icon: Zap, name: 'Zap' },
              { Icon: Sparkles, name: 'Sparkles' },
              { Icon: Check, name: 'Check' },
            ].map(({ Icon, name }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#667c67]/10 flex items-center justify-center text-[#667c67]">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600">{name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Loading States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border rounded-xl p-4">
              <p className="text-sm font-semibold mb-4 text-center">Spinner</p>
              <LoadingState variant="spinner" size="md" />
            </div>
            <div className="border rounded-xl p-4">
              <p className="text-sm font-semibold mb-4 text-center">Dots</p>
              <LoadingState variant="dots" size="md" />
            </div>
            <div className="border rounded-xl p-4">
              <p className="text-sm font-semibold mb-4 text-center">Pulse</p>
              <LoadingState variant="pulse" size="md" />
            </div>
            <div className="border rounded-xl p-4">
              <p className="text-sm font-semibold mb-4 text-center">Full Screen</p>
              <Button onClick={() => setShowLoader(true)} size="sm" className="w-full">
                Show Loader
              </Button>
            </div>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm font-semibold mb-4">Skeleton</p>
            <LoadingState variant="skeleton" />
          </div>
        </CardContent>
      </Card>

      {/* Gradients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gradients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-24 rounded-xl bg-gradient-primary shadow-md" />
              <p className="text-sm font-semibold text-center">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-xl bg-gradient-accent shadow-md" />
              <p className="text-sm font-semibold text-center">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-xl bg-gradient-warm shadow-md" />
              <p className="text-sm font-semibold text-center">Warm</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Cards & Shadows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Default Card</h3>
              <p className="text-sm text-gray-600">
                Standard card with rounded corners and subtle shadow
              </p>
            </Card>
            <Card className="p-6 shadow-lg">
              <h3 className="font-semibold mb-2">Elevated Card</h3>
              <p className="text-sm text-gray-600">
                Card with larger shadow for emphasis
              </p>
            </Card>
            <Card className="p-6 shadow-2xl">
              <h3 className="font-semibold mb-2">High Elevation</h3>
              <p className="text-sm text-gray-600">
                Maximum elevation for modals and overlays
              </p>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Glass Morphism */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Glass Morphism</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-[#667c67] to-[#526250] p-8 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass p-6 rounded-2xl">
                <h3 className="font-semibold mb-2 text-gray-900">Light Glass</h3>
                <p className="text-sm text-gray-700">
                  Frosted glass effect with light background
                </p>
              </div>
              <div className="glass-dark p-6 rounded-2xl">
                <h3 className="font-semibold mb-2 text-white">Dark Glass</h3>
                <p className="text-sm text-gray-200">
                  Frosted glass effect with dark background
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Form Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Default input" />
          <Input placeholder="Email input" type="email" />
          <Input placeholder="Disabled input" disabled />
          <Input 
            placeholder="Input with icon" 
            className="pl-10"
            style={{ paddingLeft: '2.5rem' }}
          />
        </CardContent>
      </Card>

      {showLoader && <BrandedLoader />}
    </div>
  );
}
