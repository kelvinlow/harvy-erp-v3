'use client';

import { format } from 'date-fns';
import { Download, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface StoreIssue {
  machineNo: string;
  description: string;
  mtd: {
    direct: number;
    normal: number;
  };
  ytd: {
    direct: number;
    normal: number;
  };
}

interface StationData {
  name: string;
  items: StoreIssue[];
}

const mockData: StationData[] = [
  {
    name: 'CAGES',
    items: [
      {
        machineNo: 'AC',
        description: 'CAGES - GENERAL',
        mtd: { direct: 0.0, normal: 0.0 },
        ytd: { direct: 0.0, normal: 3745.39 }
      }
    ]
  },
  {
    name: 'DIESEL TANK',
    items: [
      {
        machineNo: 'G-DT1',
        description: 'DIESEL TANK (HAVYS OIL MILL)',
        mtd: { direct: 0.0, normal: 0.0 },
        ytd: { direct: 0.0, normal: 23.24 }
      }
    ]
  },
  {
    name: 'EFFLUENT POND',
    items: [
      {
        machineNo: 'EF-EPL',
        description: 'EFFLUENT PIPE LINE EF-OUTSIDE',
        mtd: { direct: 0.0, normal: 0.0 },
        ytd: { direct: 0.0, normal: 410.8 }
      },
      {
        machineNo: 'AEF',
        description: 'EFFLUENT - GENERAL',
        mtd: { direct: 0.0, normal: 0.0 },
        ytd: { direct: 0.0, normal: 57385.93 }
      },
      {
        machineNo: 'EFF-FLO',
        description: 'EFFLUENT FLOWMETER',
        mtd: { direct: 0.0, normal: 0.0 },
        ytd: { direct: 0.0, normal: 3537.6 }
      },
      {
        machineNo: 'EF-MDS',
        description: 'MDS EFFLUENT',
        mtd: { direct: 0.0, normal: 0.0 },
        ytd: { direct: 0.0, normal: 211.02 }
      },
      {
        machineNo: 'EF-RP',
        description: 'ROBIN PUMP',
        mtd: { direct: 0.0, normal: 0.0 },
        ytd: { direct: 0.0, normal: 674.42 }
      },
      {
        machineNo: 'EF-ARE',
        description: 'WATER PUMP HOUSE',
        mtd: { direct: 0.0, normal: 0.0 },
        ytd: { direct: 0.0, normal: 1699.54 }
      }
    ]
  }
];

export function StoreIssuesReport() {
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const calculateStationTotal = (items: StoreIssue[]) => {
    return items.reduce(
      (acc, item) => ({
        mtd: {
          direct: acc.mtd.direct + item.mtd.direct,
          normal: acc.mtd.normal + item.mtd.normal
        },
        ytd: {
          direct: acc.ytd.direct + item.ytd.direct,
          normal: acc.ytd.normal + item.ytd.normal
        }
      }),
      {
        mtd: { direct: 0, normal: 0 },
        ytd: { direct: 0, normal: 0 }
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">
          Store Issues Report By Machines
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div ref={componentRef} className="rounded-md border p-6">
        {/* Report Header - Only visible in print */}
        <div className="hidden print:block text-center space-y-1 mb-6">
          <h1 className="text-2xl font-bold">HAVYS OIL MILL SDN. BHD.</h1>
          <h2 className="text-xl">Store Issues Report By Machines</h2>
          <p className="text-sm">
            FOR THE MONTH OF {format(new Date(), 'MMMM yyyy').toUpperCase()}
          </p>
          <div className="text-sm text-right">
            Printing Date: {format(new Date(), 'dd MMM yyyy HH:mm:ss')}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[150px]">Machine No</TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead className="text-right">MTD Direct</TableHead>
              <TableHead className="text-right">MTD Normal</TableHead>
              <TableHead className="text-right">Total (MTD)</TableHead>
              <TableHead className="text-right">YTD Direct</TableHead>
              <TableHead className="text-right">YTD Normal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((station) => {
              const stationTotal = calculateStationTotal(station.items);

              return (
                <>
                  {/* Station Header */}
                  <TableRow key={station.name}>
                    <TableCell colSpan={7} className="font-medium bg-muted">
                      Station : {station.name}
                    </TableCell>
                  </TableRow>

                  {/* Station Items */}
                  {station.items.map((item) => (
                    <TableRow key={item.machineNo}>
                      <TableCell>{item.machineNo}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">
                        {item.mtd.direct.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.mtd.normal.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(item.mtd.direct + item.mtd.normal).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.ytd.direct.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.ytd.normal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Station Total */}
                  <TableRow>
                    <TableCell colSpan={2} className="font-medium">
                      {station.name} Total:
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {stationTotal.mtd.direct.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {stationTotal.mtd.normal.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {(
                        stationTotal.mtd.direct + stationTotal.mtd.normal
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {stationTotal.ytd.direct.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {stationTotal.ytd.normal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
