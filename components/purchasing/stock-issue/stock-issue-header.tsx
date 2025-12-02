import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function StockIssueHeader() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stock Issue</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Print</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company1">Company 1</SelectItem>
                  <SelectItem value="company2">Company 2</SelectItem>
                  <SelectItem value="company3">Company 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input placeholder="Search by issue number, item, or department" />
            </div>
            <div className="flex space-x-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button>Search</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

