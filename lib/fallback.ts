import type { Product } from './catalog';

// Used only if Kai's shop can't be reached (e.g. while building offline).
// Names and prices taken from ToyTake2's listings, November 2026. No photos: the live shop supplies those.
const f = (handle: string, title: string, price: number, wasPrice: number | undefined, category: Product['category']): Product => ({
  id: handle, handle, title, price, wasPrice, images: [], available: true, category,
});

export const fallbackProducts: Product[] = [
  f('industrial-dining-table', '120cm Industrial Dining Table | Rustic Brown', 59, 99, 'Kitchen'),
  f('industrial-dining-chair', 'Industrial Dining Chair | Rustic Brown', 30, 39, 'Kitchen'),
  f('industrial-chest-of-drawers', 'Industrial 9 Drawer Chest of Drawers | Brown & Black', 69, undefined, 'Bedroom'),
  f('industrial-bookshelf', '4-Tier Industrial Bookshelf | Oak & Black', 39, undefined, 'Study'),
  f('kettle-toaster-set', 'Stainless Steel Kettle and Toaster Set, 1.7L, 2 Slice', 20, 45, 'Appliances'),
  f('kettle-toaster-set-4', 'Kettle and 4 Slice Toaster Set, White', 39, undefined, 'Appliances'),
  f('air-fryer-oven-24l', '24L Air Fryer Oven, 1600W', 39, 85, 'Appliances'),
  f('mini-convection-oven', '20L Mini Convection Oven with Air Fry Function', 49, undefined, 'Appliances'),
  f('computer-desk-120', '120cm Computer Desk with 6-Tier Storage Bookshelves, Grey', 59, 99, 'Study'),
  f('mesh-office-chair', 'Ergonomic Mesh Office Chair with Headrest', 49, 90, 'Study'),
  f('executive-office-chair', 'Swivel Executive Office Chair, PU Leather, Black', 39, 69, 'Study'),
  f('wall-shelf', 'Wall-Mounted Storage Shelf, White', 15, undefined, 'Living room'),
  f('sofa-bed-two-seater', 'Three-Way Two-Seater Sofa Bed, Light Grey', 159, 299, 'Living room'),
  f('click-clack-sofa-bed', 'Double Click Clack Sofa Bed, Grey', 159, 305, 'Living room'),
  f('kitchen-cabinet', 'Freestanding Multi-Storage Kitchen Cabinet, Black', 129, 189, 'Kitchen'),
  f('storage-trolley', 'Modern Kitchen Trolley with Wine Rack, Grey', 59, 99, 'Kitchen'),
  f('bar-stools-grey', 'Bar Stools Set of 2, Swivel with Footrest, Grey', 50, 89, 'Kitchen'),
  f('bar-stools-cream', 'Bar Stools Set of 2, Swivel, Cream', 59, 109, 'Kitchen'),
  f('under-counter-fridge', '91L Under Counter Fridge, White', 79, 119, 'Appliances'),
  f('table-top-dishwasher', 'Table Top Dishwasher, 6 Programs', 109, 199, 'Appliances'),
  f('sensor-bin', '50L Sensor Bin with Soft-Close Lid', 39, undefined, 'Kitchen'),
  f('coffee-table', 'Farmhouse Wood Coffee Table with Storage Shelf', 50, 90, 'Living room'),
  f('recliner-footstool', 'Swivel Recliner Chair with Footstool, Black', 89, 164, 'Living room'),
  f('kids-ride-on-bmw', 'BMW i4 Licensed 12V Kids Electric Ride-On Car', 79, 139, 'Outdoor & kids'),
];
