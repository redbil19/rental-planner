export interface Agency {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  rating: number;
  totalCars: number;
}

export interface Car {
  id: string;
  agencyId: string;
  name: string;
  type: string;
  image: string;
  pricePerDay: number;
  seats: number;
  transmission: 'automatic' | 'manual';
  fuelType: string;
  available: boolean;
}

export interface Booking {
  id: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
