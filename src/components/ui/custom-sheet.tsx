import * as React from "react"
import { Sheet as BaseSheet } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left'
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, side = 'right', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:duration-300 data-[state=open]:duration-500',
        side === 'right' && 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
        side === 'left' && 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
        side === 'top' && 'inset-x-0 top-0 border-b',
        side === 'bottom' && 'inset-x-0 bottom-0 border-t',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
SheetContent.displayName = 'SheetContent'

export { BaseSheet as Sheet, SheetContent }
