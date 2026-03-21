import * as React from "react"
import { ChevronDown } from "lucide-react"

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined)

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  defaultValue?: string
}

export function Select({ value: controlledValue, onValueChange, children, defaultValue }: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '')
  const [open, setOpen] = React.useState(false)
  
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue
  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setUncontrolledValue(newValue)
    }
    onValueChange?.(newValue)
    setOpen(false)
  }

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectTrigger must be used within Select')

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={`flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#667c67] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectValue must be used within Select')

  const selectedItem = React.Children.toArray(
    (React.Children.toArray(context.value)[0] as any)?.props?.children
  ).find((child: any) => child?.props?.value === context.value)

  return <span>{(selectedItem as any)?.props?.children || placeholder}</span>
}

export function SelectContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectContent must be used within Select')

  if (!context.open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => context.setOpen(false)}
      />
      <div className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg ${className || ''}`}>
        {children}
      </div>
    </>
  )
}

export function SelectItem({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectItem must be used within Select')

  return (
    <div
      onClick={() => context.onValueChange(value)}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
        context.value === value ? 'bg-accent text-accent-foreground' : ''
      } ${className || ''}`}
    >
      {children}
    </div>
  )
}
