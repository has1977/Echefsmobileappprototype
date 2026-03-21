import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#667c67] text-white hover:bg-[#526250] shadow-sm",
        secondary:
          "border-transparent bg-[#e4dbc4] text-[#667c67] hover:bg-[#d4c9a8]",
        destructive:
          "border-transparent bg-[#dc2626] text-white hover:bg-[#b91c1c]",
        outline: "border-[#667c67] text-[#667c67] bg-transparent",
        success: "border-transparent bg-[#16a34a] text-white shadow-sm",
        warning: "border-transparent bg-[#ea580c] text-white shadow-sm",
        info: "border-transparent bg-[#0284c7] text-white shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={`${badgeVariants({ variant })} ${className || ''}`} {...props} />
  )
}

export { Badge, badgeVariants }