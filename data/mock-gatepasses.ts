import type { Gatepass, GatepassStatus, GatepassType, GatepassImage } from '../types/gatepass';

// Helper function to generate random dates within a range
const getRandomDate = (start: Date, end: Date): string => {
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString();
};

// Helper function to get a random status
const getRandomStatus = (): GatepassStatus => {
  const statuses: GatepassStatus[] = ['Pending Approval', 'Approved', 'Out', 'Returned', 'Replaced'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Helper function to get a random item type
const getRandomItemType = (): GatepassType => {
  const types: GatepassType[] = ['Item', 'Machinery', 'Equipment', 'Tool', 'Vehicle', 'Other'];
  return types[Math.floor(Math.random() * types.length)];
};

// Generate mock status images based on gatepass status
const generateStatusImages = (status: GatepassStatus, requestDate: string): GatepassImage[] => {
  const images: GatepassImage[] = [];
  const now = new Date();
  const requestDateObj = new Date(requestDate);

  // Always add initial image for the request
  images.push({
    id: `img-initial-${Math.random().toString(36).substring(2, 11)}`,
    status: 'Pending Approval',
    imageUrl: '/placeholder.svg?height=800&width=800&text=Initial+Status',
    thumbnailUrl: '/placeholder.svg?height=200&width=200&text=Initial+Status',
    uploadDate: requestDate,
    description: 'Initial condition of the item',
  });

  // Add approved image if status is beyond pending
  if (status !== 'Pending Approval') {
    const approvedDate = getRandomDate(requestDateObj, now);
    images.push({
      id: `img-approved-${Math.random().toString(36).substring(2, 11)}`,
      status: 'Approved',
      imageUrl: '/placeholder.svg?height=800&width=800&text=Approved+Status',
      thumbnailUrl: '/placeholder.svg?height=200&width=200&text=Approved+Status',
      uploadDate: approvedDate,
      description: 'Item condition at approval',
    });
  }

  // Add out image if status is beyond approved
  if (status === 'Out' || status === 'Returned' || status === 'Replaced') {
    const outDate = getRandomDate(new Date(images[1].uploadDate), now);
    images.push({
      id: `img-out-${Math.random().toString(36).substring(2, 11)}`,
      status: 'Out',
      imageUrl: '/placeholder.svg?height=800&width=800&text=Out+Status',
      thumbnailUrl: '/placeholder.svg?height=200&width=200&text=Out+Status',
      uploadDate: outDate,
      description: 'Item condition when taken out',
    });
  }

  // Add returned/replaced image if status is returned or replaced
  if (status === 'Returned' || status === 'Replaced') {
    const returnDate = getRandomDate(new Date(images[2].uploadDate), now);
    images.push({
      id: `img-${status.toLowerCase()}-${Math.random().toString(36).substring(2, 11)}`,
      status: status,
      imageUrl: `/placeholder.svg?height=800&width=800&text=${status}+Status`,
      thumbnailUrl: `/placeholder.svg?height=200&width=200&text=${status}+Status`,
      uploadDate: returnDate,
      description: `Item condition when ${status.toLowerCase()}`,
    });
  }

  return images;
};

// Generate mock gatepass data
export const generateMockGatepasses = (count = 50): Gatepass[] => {
  const gatepasses: Gatepass[] = [];

  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const oneMonthLater = new Date(now);
  oneMonthLater.setMonth(now.getMonth() + 1);

  const departments = ['Engineering', 'Production', 'Maintenance', 'Quality Control', 'Administration', 'IT'];
  const approvers = [
    { id: 'app1', name: 'John Manager' },
    { id: 'app2', name: 'Sarah Supervisor' },
    { id: 'app3', name: 'Michael Director' },
    { id: 'app4', name: 'Emily Lead' },
  ];

  const requestors = [
    { id: 'req1', name: 'Alex Smith', department: departments[0], contactNumber: '555-1234' },
    { id: 'req2', name: 'Jamie Johnson', department: departments[1], contactNumber: '555-2345' },
    { id: 'req3', name: 'Taylor Brown', department: departments[2], contactNumber: '555-3456' },
    { id: 'req4', name: 'Jordan Davis', department: departments[3], contactNumber: '555-4567' },
    { id: 'req5', name: 'Casey Wilson', department: departments[4], contactNumber: '555-5678' },
    { id: 'req6', name: 'Riley Martin', department: departments[5], contactNumber: '555-6789' },
  ];

  const destinations = [
    'Main Warehouse',
    'Building A',
    'Building B',
    'Field Site Alpha',
    'Client Office',
    'Repair Center',
    'Testing Facility',
    'External Vendor',
  ];

  const reasons = [
    'Routine maintenance',
    'Repair needed',
    'Client demonstration',
    'Field work',
    'Testing and calibration',
    'Temporary relocation',
    'Replacement',
    'Upgrade installation',
  ];

  const items = [
    { name: 'Portable Generator', type: 'Equipment' },
    { name: 'Forklift', type: 'Machinery' },
    { name: 'Laptop', type: 'Item' },
    { name: 'Diagnostic Tool', type: 'Tool' },
    { name: 'Company Van', type: 'Vehicle' },
    { name: 'Projector', type: 'Equipment' },
    { name: 'Drill Press', type: 'Machinery' },
    { name: 'Safety Harness', type: 'Item' },
    { name: 'Welding Machine', type: 'Equipment' },
    { name: 'Oscilloscope', type: 'Tool' },
  ];

  for (let i = 0; i < count; i++) {
    const requestDate = getRandomDate(oneMonthAgo, now);
    const status = getRandomStatus();
    const itemType = getRandomItemType();
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const requestor = requestors[Math.floor(Math.random() * requestors.length)];

    // Determine expected and actual return dates based on status
    let expectedReturnDate: string | null = null;
    let actualReturnDate: string | null = null;

    if (status !== 'Pending Approval') {
      expectedReturnDate = getRandomDate(new Date(requestDate), oneMonthLater);

      if (status === 'Returned' || status === 'Replaced') {
        actualReturnDate = getRandomDate(new Date(requestDate), new Date(expectedReturnDate));
      }
    }

    // Determine approver based on status
    const approver = status === 'Pending Approval' ? null : approvers[Math.floor(Math.random() * approvers.length)];

    // Generate random attachments (0-3)
    const attachmentCount = Math.floor(Math.random() * 4);
    const attachments = [];

    for (let j = 0; j < attachmentCount; j++) {
      const fileTypes = ['pdf', 'jpg', 'png', 'docx'];
      const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];

      attachments.push({
        id: `att-${i}-${j}`,
        fileName: `attachment-${j + 1}.${fileType}`,
        fileType: fileType,
        fileSize: Math.floor(Math.random() * 10000000), // Random size up to 10MB
        uploadDate: requestDate,
        url: '/placeholder.svg?height=300&width=300',
      });
    }

    // Generate status images based on current status
    const statusImages = generateStatusImages(status, requestDate);

    gatepasses.push({
      id: `gp-${i + 1}`,
      requestNumber: `GP-${new Date().getFullYear()}-${(i + 1).toString().padStart(4, '0')}`,
      itemName: randomItem.name,
      itemId: `ITEM-${(i + 1).toString().padStart(4, '0')}`,
      itemType: itemType as GatepassType,
      quantity: Math.floor(Math.random() * 5) + 1,
      requestDate,
      expectedReturnDate,
      actualReturnDate,
      requestor,
      approver,
      status,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      notes: Math.random() > 0.5 ? `Additional notes for gatepass ${i + 1}` : '',
      attachments,
      statusImages,
      createdAt: requestDate,
      updatedAt: getRandomDate(new Date(requestDate), now),
    });
  }

  return gatepasses;
};

// Export mock data
export const mockGatepasses = generateMockGatepasses();

