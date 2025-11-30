"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Download, Loader2, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import type { TransactionData } from "@/app/api/daily-transaction/route"

interface TransactionReportFormValues {
  fromDate: Date
  toDate: Date
  stockCode: string
  transactionNo: string
  sorting: string
}

export function TransactionReportDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { toast } = useToast()
  const form = useForm<TransactionReportFormValues>({
    defaultValues: {
      fromDate: new Date(),
      toDate: new Date(),
      stockCode: "",
      transactionNo: "",
      sorting: "SIC No",
    },
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["transactions", form.watch()],
    queryFn: async () => {
      const values = form.getValues()
      const params = new URLSearchParams({
        fromDate: values.fromDate.toISOString(),
        toDate: values.toDate.toISOString(),
        sorting: values.sorting,
        ...(values.stockCode && { stockCode: values.stockCode }),
        ...(values.transactionNo && { transactionNo: values.transactionNo }),
      })

      const response = await fetch(`/api/daily-transaction?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }
      const json = await response.json()
      return json.data as TransactionData[]
    },
    enabled: open,
  })

  React.useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch transaction data",
      })
    }
  }, [error, toast])

  async function onSubmit(values: TransactionReportFormValues) {
    await refetch()
  }

  const handleExport = () => {
    if (!data) return

    const headers = ["Date", "Stock Code", "Description", "Quantity", "SIC No", "Receipt By", "Machine", "Station"]

    const csvData = [
      headers.join(","),
      ...data.map((item) =>
        [
          format(new Date(item.date), "dd-MMM-yyyy"),
          item.stockCode,
          `"${item.description}"`,
          item.quantity,
          item.sicNo,
          item.receiptBy,
          `"${item.machine}"`,
          item.station,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `daily-transactions-${format(new Date(), "dd-MM-yyyy")}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Report Daily Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-4 text-sm font-medium">Please Select Date</h4>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="fromDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>From:</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
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
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="toDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>And:</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
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
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-medium">Please Select Stock Code</h4>
                  <FormField
                    control={form.control}
                    name="stockCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code:</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <Button type="button" variant="outline" size="icon">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-medium">Please Select Transaction</h4>
                  <FormField
                    control={form.control}
                    name="transactionNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No:</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sorting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sorting:</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sorting" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SIC No">SIC No</SelectItem>
                          <SelectItem value="Date">Date</SelectItem>
                          <SelectItem value="Stock Code">Stock Code</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium">Results</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    disabled={!data || data.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Stock Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead>SIC No</TableHead>
                        <TableHead>Receipt By</TableHead>
                        <TableHead>Machine</TableHead>
                        <TableHead>Station</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                          </TableCell>
                        </TableRow>
                      ) : data && data.length > 0 ? (
                        data.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{format(new Date(item.date), "dd-MMM-yyyy")}</TableCell>
                            <TableCell>{item.stockCode}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell>{item.sicNo}</TableCell>
                            <TableCell>{item.receiptBy}</TableCell>
                            <TableCell>{item.machine}</TableCell>
                            <TableCell>{item.station}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No results found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Record
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

