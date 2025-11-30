"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Download, Printer, Search } from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface StockTransaction {
  no: number
  transactionNo: string
  date: Date
  quantityIn: number
  quantityOut: number
  amountIn: number
  amountOut: number
}

interface StockItem {
  code: string
  description: string
  openingBalance: {
    quantity: number
    amount: number
  }
  transactions: StockTransaction[]
}

// Sample data
const stockItems: StockItem[] = [
  {
    code: "AW0011",
    description: "LIFT CYLINDER PUMP SEAL KIT",
    openingBalance: {
      quantity: 0,
      amount: 0,
    },
    transactions: [
      {
        no: 1,
        transactionNo: "DL2412203",
        date: new Date(2024, 11, 14),
        quantityIn: 2,
        quantityOut: 0,
        amountIn: 430,
        amountOut: 0,
      },
    ],
  },
  {
    code: "AW0076",
    description: "SWING ARM",
    openingBalance: {
      quantity: 2,
      amount: 164.59,
    },
    transactions: [
      {
        no: 1,
        transactionNo: "DL2412224",
        date: new Date(2024, 11, 18),
        quantityIn: 1,
        quantityOut: 0,
        amountIn: 75,
        amountOut: 0,
      },
    ],
  },
  {
    code: "AW0145",
    description: "SEAT COVER",
    openingBalance: {
      quantity: 13,
      amount: 139.37,
    },
    transactions: [
      {
        no: 1,
        transactionNo: "DL2412224",
        date: new Date(2024, 11, 18),
        quantityIn: 1,
        quantityOut: 0,
        amountIn: 9,
        amountOut: 0,
      },
    ],
  },
]

export function StockLedgerCard() {
  const [date, setDate] = React.useState<Date>(new Date())
  const [search, setSearch] = React.useState("")
  const componentRef = React.useRef(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const filteredItems = stockItems.filter(
    (item) =>
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="mx-auto max-w-[2000px] space-y-4 p-4 xl:p-8">
      {/* Controls Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-2 lg:col-span-3">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM yyyy") : "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stock code or description..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 flex justify-end gap-2 lg:col-span-1">
          <Button variant="outline" onClick={handlePrint} className="w-[100px]">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" className="w-[100px]">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stock Ledger Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between print:hidden">
          <div>
            <h2 className="text-lg font-semibold">Stock Ledger Card</h2>
            <p className="text-sm text-muted-foreground">For the month of {format(date, "MMMM yyyy")}</p>
          </div>
        </CardHeader>
        <CardContent ref={componentRef}>
          {/* Company Header - Only visible in print */}
          <div className="hidden space-y-1 print:block print:text-center">
            <h1 className="text-xl font-bold">HAVYS OIL MILL SDN. BHD.</h1>
            <p className="text-sm">O PARAMOUNT ESTATE, KM 31 JALAN BAHAU-KERATONG,</p>
            <p className="text-sm">KARUNG BERKUNCI NO.4, POS MALAYSIA, BAHAU, 72100 NEGERI SEMBILAN</p>
            <p className="text-sm">TEL: 012-6367717 FAX: 06-4665357</p>
            <h2 className="mt-4 text-lg font-semibold">
              STOCK LEDGER CARD FOR THE MONTH OF {format(date, "MMMM yyyy").toUpperCase()}
            </h2>
          </div>

          {/* Responsive Grid for Stock Items */}
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredItems.map((item) => {
              let runningQuantity = item.openingBalance.quantity
              let runningAmount = item.openingBalance.amount

              return (
                <div key={item.code} className="space-y-2 rounded-lg border p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">
                      {item.code} - {item.description}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">No</TableHead>
                          <TableHead className="w-[120px]">Transaction</TableHead>
                          <TableHead className="w-[100px]">Date</TableHead>
                          <TableHead className="w-[100px] text-right">Qty In</TableHead>
                          <TableHead className="w-[100px] text-right">Qty Out</TableHead>
                          <TableHead className="w-[120px] text-right">Balance Qty</TableHead>
                          <TableHead className="w-[120px] text-right">Balance (RM)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={7} className="font-medium">
                            Opening Balance
                          </TableCell>
                        </TableRow>
                        {item.transactions.map((transaction) => {
                          runningQuantity += transaction.quantityIn - transaction.quantityOut
                          runningAmount += transaction.amountIn - transaction.amountOut

                          return (
                            <TableRow key={transaction.transactionNo}>
                              <TableCell>{transaction.no}</TableCell>
                              <TableCell>{transaction.transactionNo}</TableCell>
                              <TableCell>{format(transaction.date, "dd MMM yyyy")}</TableCell>
                              <TableCell className="text-right">{transaction.quantityIn.toFixed(2)}</TableCell>
                              <TableCell className="text-right">{transaction.quantityOut.toFixed(2)}</TableCell>
                              <TableCell className="text-right">{runningQuantity.toFixed(2)}</TableCell>
                              <TableCell className="text-right">{runningAmount.toFixed(2)}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

