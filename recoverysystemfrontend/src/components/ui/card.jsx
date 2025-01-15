import * as React from "react"
import { cn } from "../../lib/utils"

// Define all components first, then export them
const CardComponent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
CardComponent.displayName = "Card"

const CardHeaderComponent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeaderComponent.displayName = "CardHeader"

const CardTitleComponent = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitleComponent.displayName = "CardTitle"

const CardDescriptionComponent = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescriptionComponent.displayName = "CardDescription"

const CardContentComponent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContentComponent.displayName = "CardContent"

const CardFooterComponent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooterComponent.displayName = "CardFooter"

// Export the components with their final names
export const Card = CardComponent;
export const CardHeader = CardHeaderComponent;
export const CardTitle = CardTitleComponent;
export const CardDescription = CardDescriptionComponent;
export const CardContent = CardContentComponent;
export const CardFooter = CardFooterComponent; 