'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { mockGatepasses } from '@/data/mock-gatepasses';
import type {
  Gatepass,
  GatepassFilterOptions,
  GatepassSortOptions,
  GatepassStatus,
  GatepassType,
  GatepassImage,
} from '@/types/gatepass';
import GatepassTable from './gatepass-table';
import GatepassCards from './gatepass-cards';
import GatepassFilters from './gatepass-filters';
import GatepassDetail from './gatepass-detail';
import GatepassForm from './gatepass-form';
import StatusUpdateModal from './status-update-modal';
import { useToast } from '@/components/ui/use-toast';

export default function GatepassManagement() {
  const [gatepasses, setGatepasses] = useState<Gatepass[]>([]);
  const [filteredGatepasses, setFilteredGatepasses] = useState<Gatepass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGatepass, setSelectedGatepass] = useState<Gatepass | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'update'>('create');
  const { toast } = useToast();

  const [filterOptions, setFilterOptions] = useState<GatepassFilterOptions>({
    search: '',
    status: 'All',
    itemType: 'All',
    dateRange: {
      from: null,
      to: null,
    },
    requestor: '',
  });

  const [sortOptions, setSortOptions] = useState<GatepassSortOptions>({
    field: 'requestDate',
    direction: 'desc',
  });

  // Load gatepass data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGatepasses(mockGatepasses);
      setFilteredGatepasses(mockGatepasses);
      setLoading(false);
    }, 500);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    if (gatepasses.length === 0) return;

    let result = [...gatepasses];

    // Apply search filter
    if (filterOptions.search) {
      const searchTerm = filterOptions.search.toLowerCase();
      result = result.filter(
        (gp) =>
          gp.requestNumber.toLowerCase().includes(searchTerm) ||
          gp.itemName.toLowerCase().includes(searchTerm) ||
          gp.requestor.name.toLowerCase().includes(searchTerm) ||
          gp.destination.toLowerCase().includes(searchTerm),
      );
    }

    // Apply status filter
    if (filterOptions.status !== 'All') {
      result = result.filter((gp) => gp.status === filterOptions.status);
    }

    // Apply item type filter
    if (filterOptions.itemType !== 'All') {
      result = result.filter((gp) => gp.itemType === filterOptions.itemType);
    }

    // Apply date range filter
    if (filterOptions.dateRange.from) {
      const fromDate = new Date(filterOptions.dateRange.from);
      result = result.filter((gp) => new Date(gp.requestDate) >= fromDate);
    }

    if (filterOptions.dateRange.to) {
      const toDate = new Date(filterOptions.dateRange.to);
      result = result.filter((gp) => new Date(gp.requestDate) <= toDate);
    }

    // Apply requestor filter
    if (filterOptions.requestor) {
      result = result.filter((gp) => gp.requestor.name.toLowerCase().includes(filterOptions.requestor.toLowerCase()));
    }

    // Apply sorting
    if (sortOptions.field) {
      result.sort((a, b) => {
        let valueA: any;
        let valueB: any;

        // Handle nested properties
        if (sortOptions.field === 'requestor') {
          valueA = a.requestor.name;
          valueB = b.requestor.name;
        } else {
          valueA = a[sortOptions.field as keyof Gatepass];
          valueB = b[sortOptions.field as keyof Gatepass];
        }

        // Compare based on direction
        if (sortOptions.direction === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }

    setFilteredGatepasses(result);
  }, [gatepasses, filterOptions, sortOptions]);

  const handleFilterChange = (newFilters: Partial<GatepassFilterOptions>) => {
    setFilterOptions((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (field: keyof Gatepass | '') => {
    setSortOptions((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleViewDetail = (gatepass: Gatepass) => {
    setSelectedGatepass(gatepass);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedGatepass(null);
  };

  const handleCreateGatepass = () => {
    setFormMode('create');
    setSelectedGatepass(null);
    setShowForm(true);
  };

  const handleUpdateGatepass = (gatepass: Gatepass) => {
    setFormMode('update');
    setSelectedGatepass(gatepass);
    setShowForm(true);
  };

  const handleStatusUpdate = (gatepass: Gatepass) => {
    setSelectedGatepass(gatepass);
    setShowStatusUpdate(true);
  };

  const handleFormSubmit = (data: Partial<Gatepass>) => {
    if (formMode === 'create') {
      // Generate a new ID and request number
      const newId = `gp-${gatepasses.length + 1}`;
      const newRequestNumber = `GP-${new Date().getFullYear()}-${(gatepasses.length + 1).toString().padStart(4, '0')}`;

      // Create a new gatepass
      const newGatepass: Gatepass = {
        id: newId,
        requestNumber: newRequestNumber,
        itemName: data.itemName || '',
        itemId: data.itemId || '',
        itemType: (data.itemType as GatepassType) || 'Item',
        quantity: data.quantity || 1,
        requestDate: data.requestDate || new Date().toISOString(),
        expectedReturnDate: data.expectedReturnDate,
        actualReturnDate: null,
        requestor: {
          id: 'req1',
          name: 'Current User',
          department: 'Current Department',
          contactNumber: '555-1234',
        },
        approver: null,
        status: 'Pending Approval',
        reason: data.reason || '',
        destination: data.destination || '',
        notes: data.notes || '',
        attachments: [],
        statusImages: [
          {
            id: `img-initial-${Math.random().toString(36).substring(2, 11)}`,
            status: 'Pending Approval',
            imageUrl: '/placeholder.svg?height=800&width=800&text=Initial+Status',
            thumbnailUrl: '/placeholder.svg?height=200&width=200&text=Initial+Status',
            uploadDate: new Date().toISOString(),
            description: 'Initial condition of the item',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setGatepasses((prev) => [newGatepass, ...prev]);
      toast({
        title: 'Gatepass Created',
        description: `Gatepass ${newRequestNumber} has been created successfully.`,
      });
    } else if (formMode === 'update' && selectedGatepass) {
      // Update existing gatepass
      const updatedGatepasses = gatepasses.map((gp) =>
        gp.id === selectedGatepass.id ? { ...gp, ...data, updatedAt: new Date().toISOString() } : gp,
      );

      setGatepasses(updatedGatepasses);
      toast({
        title: 'Gatepass Updated',
        description: `Gatepass ${selectedGatepass.requestNumber} has been updated successfully.`,
      });
    }

    setShowForm(false);
  };

  const handleStatusUpdateSubmit = (data: {
    status: GatepassStatus
    notes: string
    returnDate?: string
    images: File[]
  }) => {
    if (!selectedGatepass) return;

    // Create a new status image if provided
    const newStatusImages = [...selectedGatepass.statusImages];

    if (data.images.length > 0) {
      // In a real app, we would upload the image and get a URL
      // For this mock, we'll use a placeholder
      const newImage: GatepassImage = {
        id: `img-${data.status.toLowerCase()}-${Math.random().toString(36).substring(2, 11)}`,
        status: data.status,
        imageUrl: `/placeholder.svg?height=800&width=800&text=${data.status}+Status`,
        thumbnailUrl: `/placeholder.svg?height=200&width=200&text=${data.status}+Status`,
        uploadDate: new Date().toISOString(),
        description: data.notes || `Item condition when ${data.status.toLowerCase()}`,
      };

      newStatusImages.push(newImage);
    }

    // Update the gatepass
    const updatedGatepass: Gatepass = {
      ...selectedGatepass,
      status: data.status,
      actualReturnDate:
        data.status === 'Returned' || data.status === 'Replaced'
          ? data.returnDate || new Date().toISOString()
          : selectedGatepass.actualReturnDate,
      notes: data.notes ? `${selectedGatepass.notes}\n\n${data.notes}` : selectedGatepass.notes,
      statusImages: newStatusImages,
      updatedAt: new Date().toISOString(),
    };

    const updatedGatepasses = gatepasses.map((gp) => (gp.id === selectedGatepass.id ? updatedGatepass : gp));

    setGatepasses(updatedGatepasses);
    setShowStatusUpdate(false);

    toast({
      title: 'Status Updated',
      description: `Gatepass ${selectedGatepass.requestNumber} status changed to ${data.status}.`,
    });
  };

  if (loading) {
    return <div>Loading gatepass data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <GatepassFilters filterOptions={filterOptions} onFilterChange={handleFilterChange} />

        <Button onClick={handleCreateGatepass}>
          <Plus className="h-4 w-4 mr-2" />
          New Gatepass
        </Button>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="w-full">
          <GatepassTable
            gatepasses={filteredGatepasses}
            sortOptions={sortOptions}
            onSortChange={handleSortChange}
            onViewDetail={handleViewDetail}
            onUpdateStatus={handleStatusUpdate}
          />
        </TabsContent>

        <TabsContent value="cards">
          <GatepassCards
            gatepasses={filteredGatepasses}
            onViewDetail={handleViewDetail}
            onUpdateStatus={handleStatusUpdate}
          />
        </TabsContent>
      </Tabs>

      {showDetail && selectedGatepass && <GatepassDetail gatepass={selectedGatepass} onClose={handleCloseDetail} />}

      {showForm && (
        <GatepassForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          initialData={selectedGatepass || {}}
          mode={formMode}
        />
      )}

      {showStatusUpdate && selectedGatepass && (
        <StatusUpdateModal
          isOpen={showStatusUpdate}
          onClose={() => setShowStatusUpdate(false)}
          onSubmit={handleStatusUpdateSubmit}
          gatepass={selectedGatepass}
        />
      )}
    </div>
  );
}

