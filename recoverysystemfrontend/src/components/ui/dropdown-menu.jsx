import * as React from "react"

const DropdownMenu = ({ children }) => {
  return <div className="relative inline-block text-left">{children}</div>
}

const DropdownMenuTrigger = ({ children, asChild }) => {
  return <div className="cursor-pointer">{children}</div>
}

const DropdownMenuContent = ({ children, align = "right" }) => {
  return (
    <div className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
      <div className="py-1">{children}</div>
    </div>
  )
}

const DropdownMenuItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`w-full text-left block px-4 py-2 text-sm hover:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuLabel = ({ children }) => {
  return <div className="px-4 py-2 text-sm font-semibold text-gray-900">{children}</div>
}

const DropdownMenuSeparator = () => {
  return <div className="my-1 h-px bg-gray-200" />
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} 