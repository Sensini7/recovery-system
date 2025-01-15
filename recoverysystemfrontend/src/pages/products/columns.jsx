"use client"

import { ArrowUpDown } from "lucide-react"
import { Button } from "../../components/ui/button"

export const columns = (actions) => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category")
      return <div className="capitalize">{category}</div>
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price (FCFA)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        minimumFractionDigits: 0,
      }).format(price)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "quantityInStock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("quantityInStock")
      return (
        <div className={`${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stock > 0 ? `${stock} units` : 'Out of stock'}
        </div>
      )
    },
  },
  actions && {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
            onClick={() => actions.onEdit(product)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
            onClick={() => actions.onDelete(product)}
          >
            Delete
          </Button>
        </div>
      )
    },
  },
].filter(Boolean); 