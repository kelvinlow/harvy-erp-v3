"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Search } from "lucide-react"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

interface StockItem {
  stockCode: string
  description: string
  quantityOnHand: number
  totalCost: number
  date: string
}

// Mock data
const stockItems: StockItem[] = [
  {
    stockCode: "BN0013",
    description: '1"X 5" M/S BOLT & NUT',
    quantityOnHand: 44,
    totalCost: 253.44,
    date: "2024-01-01",
  },
  {
    stockCode: "BN0014",
    description: '1"X 7" M/S BOLT & NUT',
    quantityOnHand: 17,
    totalCost: 111.18,
    date: "2024-01-01",
  },
  {
    stockCode: "BN0017",
    description: '5/8"X 4-1/2" M/S BOLT & NUT',
    quantityOnHand: 25.8,
    totalCost: 127.74,
    date: "2024-01-01",
  },
]

interface StockAdjustmentFormValues {
  transactionType: string
  date: Date
  stockCode: string
  quantity: number
  description: string
  unitCost: number
}

export function StockAdjustmentForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])

  const form = useForm<StockAdjustmentFormValues>({
    defaultValues: {
      transactionType: "STOCK ADJUSTMENT",
      date: new Date(),
      stockCode: "",
      quantity: 0,
      description: "",
      unitCost: 0,
    },
  })

  const quantity = form.watch("quantity")
  const unitCost = form.watch("unitCost")

  const total = React.useMemo(() => {
    return quantity * unitCost
  }, [quantity, unitCost])

  async function onSubmit(data: StockAdjustmentFormValues) {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(data)
      toast({
        title: "Success",
        description: "Stock adjustment has been saved.",
      })
      form.reset()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save stock adjustment.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select items to delete.",
      })
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: `${selectedItems.length} items have been deleted.`,
      })
      setSelectedItems([])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete items.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Entry</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="transactionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STOCK ADJUSTMENT">STOCK ADJUSTMENT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "dd MMM yyyy") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Stock Code and Quantity */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="stockCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Stock Code:</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Search className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Search stock..." />
                            <CommandList>
                              <CommandEmpty>No stock found.</CommandEmpty>
                              <CommandGroup>
                                {stockItems.map((item) => (
                                  <CommandItem
                                    key={item.stockCode}
                                    value={item.stockCode}
                                    onSelect={(value) => {
                                      form.setValue("stockCode", value)
                                      form.setValue("description", item.description)
                                      form.setValue("unitCost", item.totalCost / item.quantityOnHand)
                                    }}
                                  >
                                    {item.stockCode} - {item.description}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity:</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description and Unit Cost */}
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Description:</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Cost:</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-right">
              <span className="text-sm font-medium">Total: {total.toFixed(2)}</span>
            </div>

            {/* Table with horizontal scroll on mobile */}
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedItems.length === stockItems.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(stockItems.map((item) => item.stockCode))
                          } else {
                            setSelectedItems([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Stock Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantity On Hand</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockItems.map((item) => (
                    <TableRow key={item.stockCode}>
                      <TableCell>
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={selectedItems.includes(item.stockCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, item.stockCode])
                            } else {
                              setSelectedItems(selectedItems.filter((code) => code !== item.stockCode))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{item.stockCode}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantityOnHand}</TableCell>
                      <TableCell className="text-right">{item.totalCost.toFixed(2)}</TableCell>
                      <TableCell>{format(new Date(item.date), "dd MMM yyyy")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={selectedItems.length === 0}>
              Delete
            </Button>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button type="button" variant="outline" onClick={() => form.reset()} className="flex-1 sm:flex-none">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

