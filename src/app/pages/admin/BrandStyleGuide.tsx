import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { ChevronLeft, Palette, Check, X, AlertCircle, Info, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';

export function BrandStyleGuide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white p-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Palette className="w-8 h-8" />
                eChefs Brand Style Guide
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Official color palette and component guidelines
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Brand Colors */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Brand Colors</h2>
            <p className="text-sm text-muted-foreground">
              Core colors that define the eChefs brand identity
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-32 bg-[#667c67] rounded-lg shadow-lg mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">#667c67</span>
                </div>
                <h3 className="font-bold text-lg mb-1">Primary - Sage Green</h3>
                <p className="text-sm text-muted-foreground">
                  Main brand color for primary actions, headers, and key UI elements
                </p>
              </div>
              
              <div>
                <div className="h-32 bg-[#e4dbc4] rounded-lg shadow-lg mb-3 flex items-center justify-center border">
                  <span className="text-[#667c67] font-bold text-2xl">#e4dbc4</span>
                </div>
                <h3 className="font-bold text-lg mb-1">Accent - Cream</h3>
                <p className="text-sm text-muted-foreground">
                  Secondary brand color for accents, backgrounds, and subtle highlights
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <div className="h-20 bg-[#526250] rounded-lg shadow mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">#526250</span>
                </div>
                <p className="text-xs font-medium">Primary Dark</p>
              </div>
              <div>
                <div className="h-20 bg-[#8a9d8b] rounded-lg shadow mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">#8a9d8b</span>
                </div>
                <p className="text-xs font-medium">Primary Light</p>
              </div>
              <div>
                <div className="h-20 bg-[#d4c9a8] rounded-lg shadow mb-2 flex items-center justify-center border">
                  <span className="text-[#667c67] text-sm font-semibold">#d4c9a8</span>
                </div>
                <p className="text-xs font-medium">Accent Dark</p>
              </div>
              <div>
                <div className="h-20 bg-[#f0eadc] rounded-lg shadow mb-2 flex items-center justify-center border">
                  <span className="text-[#667c67] text-sm font-semibold">#f0eadc</span>
                </div>
                <p className="text-xs font-medium">Accent Light</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Button Variants</h2>
            <p className="text-sm text-muted-foreground">
              Different button styles for various use cases
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Default */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">Default (Primary)</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" size="sm">Small Button</Button>
                <Button variant="default">Default Button</Button>
                <Button variant="default" size="lg">Large Button</Button>
                <Button variant="default" size="xl">Extra Large</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use for primary actions like "Save", "Submit", "Confirm"
              </p>
            </div>

            {/* Secondary */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">Secondary</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm">Small Button</Button>
                <Button variant="secondary">Default Button</Button>
                <Button variant="secondary" size="lg">Large Button</Button>
                <Button variant="secondary" size="xl">Extra Large</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use for secondary actions or to complement primary buttons
              </p>
            </div>

            {/* Outline */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">Outline</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm">Small Button</Button>
                <Button variant="outline">Default Button</Button>
                <Button variant="outline" size="lg">Large Button</Button>
                <Button variant="outline" size="xl">Extra Large</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use for tertiary actions or when you need a subtle button
              </p>
            </div>

            {/* Light */}
            <div className="bg-gradient-to-r from-[#667c67] to-[#526250] p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-sm uppercase text-white/80">Light (On Dark Backgrounds)</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="light" size="sm">Small Button</Button>
                <Button variant="light">Default Button</Button>
                <Button variant="light" size="lg">Large Button</Button>
                <Button variant="light" size="xl">Extra Large</Button>
              </div>
              <p className="text-xs text-white/70 mt-2">
                Use on dark backgrounds like headers and banners
              </p>
            </div>

            {/* Accent */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">Accent (Gradient)</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="accent" size="sm">Small Button</Button>
                <Button variant="accent">Default Button</Button>
                <Button variant="accent" size="lg">Large Button</Button>
                <Button variant="accent" size="xl">Extra Large</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use for special call-to-action buttons to draw attention
              </p>
            </div>

            {/* Ghost */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">Ghost</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="ghost" size="sm">Small Button</Button>
                <Button variant="ghost">Default Button</Button>
                <Button variant="ghost" size="lg">Large Button</Button>
                <Button variant="ghost" size="xl">Extra Large</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use for minimal actions or in navigation
              </p>
            </div>

            {/* Link */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">Link</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="link" size="sm">Small Link</Button>
                <Button variant="link">Default Link</Button>
                <Button variant="link" size="lg">Large Link</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use for text links and navigation elements
              </p>
            </div>

            {/* Semantic Variants */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">Semantic States</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="success">
                  <Check className="w-4 h-4 mr-2" />
                  Success
                </Button>
                <Button variant="warning">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Warning
                </Button>
                <Button variant="destructive">
                  <X className="w-4 h-4 mr-2" />
                  Destructive
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use for actions with specific semantic meaning (confirm, warn, delete)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Badge Variants */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Badge Variants</h2>
            <p className="text-sm text-muted-foreground">
              Status indicators and labels
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">All Badge Styles</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">With Icons</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="success">
                  <Check className="w-3 h-3 mr-1" />
                  Active
                </Badge>
                <Badge variant="warning">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
                <Badge variant="destructive">
                  <X className="w-3 h-3 mr-1" />
                  Inactive
                </Badge>
                <Badge variant="info">
                  <Info className="w-3 h-3 mr-1" />
                  New
                </Badge>
                <Badge variant="default">
                  <Zap className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Usage Guidelines</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-[#667c67] pl-4 py-2">
              <h3 className="font-semibold mb-1">✅ Do's</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use the primary color (#667c67) for main actions and branding</li>
                <li>• Use the accent color (#e4dbc4) for backgrounds and secondary elements</li>
                <li>• Maintain sufficient contrast for accessibility</li>
                <li>• Use semantic colors (success, warning, destructive) consistently</li>
                <li>• Prefer "default" button variant for primary CTAs</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h3 className="font-semibold mb-1">❌ Don'ts</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Don't use custom colors outside the brand palette</li>
                <li>• Don't mix too many button variants on one screen</li>
                <li>• Don't use destructive variant for non-destructive actions</li>
                <li>• Don't override brand colors without good reason</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-semibold mb-1">💡 Best Practices</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Limit to 1-2 primary buttons per screen</li>
                <li>• Use consistent button sizes within a group</li>
                <li>• Add icons to buttons when it enhances clarity</li>
                <li>• Test color combinations for accessibility (WCAG AA)</li>
                <li>• Use loading states for async actions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
