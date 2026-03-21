import * as React from "react"
import { X } from "lucide-react"

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ children, asChild, className, ...props }: { children: React.ReactNode; asChild?: boolean; className?: string; [key: string]: any }) {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error('DialogTrigger must be used within Dialog')

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ...children.props,
      className: `${children.props.className || ''} ${className || ''}`.trim(),
      onClick: (e: any) => {
        children.props.onClick?.(e)
        props.onClick?.(e)
        context.onOpenChange(true)
      },
    })
  }

  return (
    <button onClick={() => context.onOpenChange(true)} className={className} {...props}>
      {children}
    </button>
  )
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error('DialogContent must be used within Dialog')

  if (!context.open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => context.onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className={`relative z-50 w-full max-w-lg rounded-2xl border bg-background p-6 shadow-lg ${className || ''}`}>
        <button
          onClick={() => context.onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}>
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-sm text-muted-foreground ${className || ''}`}>
      {children}
    </p>
  )
}