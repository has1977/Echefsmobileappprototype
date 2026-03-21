import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-[#667c67] text-white hover:bg-[#526250] shadow-md hover:shadow-lg",
        destructive:
          "bg-[#dc2626] text-white hover:bg-[#b91c1c] shadow-md hover:shadow-lg",
        outline:
          "border-2 border-[#667c67] bg-transparent text-[#667c67] hover:bg-[#667c67] hover:text-white shadow-sm",
        secondary:
          "bg-[#e4dbc4] text-[#667c67] hover:bg-[#d4c9a8] shadow-md hover:shadow-lg font-semibold",
        ghost: "hover:bg-[#667c67]/10 hover:text-[#667c67]",
        link: "text-[#667c67] underline-offset-4 hover:underline hover:text-[#526250]",
        success: "bg-[#16a34a] text-white hover:bg-[#15803d] shadow-md hover:shadow-lg",
        warning: "bg-[#ea580c] text-white hover:bg-[#c2410c] shadow-md hover:shadow-lg",
        accent: "bg-gradient-to-r from-[#667c67] to-[#526250] text-white hover:from-[#526250] hover:to-[#667c67] shadow-lg hover:shadow-xl",
        light: "bg-white text-[#667c67] hover:bg-[#f9f9f9] border-2 border-[#e4dbc4] shadow-md hover:shadow-lg font-semibold",
      },
      size: {
        default: "h-11 px-4 py-2 text-sm",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    return (
      <button
        className={`${buttonVariants({ variant, size })} ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }