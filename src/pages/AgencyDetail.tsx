import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Car as CarIcon, ArrowLeft } from 'lucide-react';
import { Car } from '@/types';
import { Header } from '@/components/Header';
import { CarCard } from '@/components/CarCard';
import { BookingDialog } from '@/components/BookingDialog';
import { Button } from '@/components/ui/button';
import { mockAgencies, mockCars } from '@/data/mockData';

export default function AgencyDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const agency = mockAgencies.find((a) => a.id === id);
  const cars = mockCars.filter((c) => c.agencyId === id);

  if (!agency) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-24 text-center">
          <h1 className="font-display text-3xl font-bold">Agency not found</h1>
          <Link to="/agencies">
            <Button variant="accent" className="mt-4">
              Back to Agencies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBook = (car: Car) => {
    setSelectedCar(car);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Agency Hero */}
      <section className="relative h-64 overflow-hidden md:h-80">
        <img
          src={agency.image}
          alt={agency.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
        
        <div className="container relative h-full">
          <Link to="/agencies" className="absolute top-6">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agencies
            </Button>
          </Link>
          
          <div className="absolute bottom-8">
            <h1 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
              {agency.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-primary-foreground/90">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{agency.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-semibold">{agency.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <CarIcon className="h-4 w-4" />
                <span>{cars.length} vehicles available</span>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-primary-foreground/80">
              {agency.description}
            </p>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <main className="container py-12">
        <h2 className="mb-8 font-display text-2xl font-bold text-foreground">
          Available Vehicles
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cars.map((car, index) => (
            <div
              key={car.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CarCard car={car} onBook={handleBook} />
            </div>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No vehicles available at this time.
            </p>
          </div>
        )}
      </main>

      <BookingDialog
        car={selectedCar}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}
