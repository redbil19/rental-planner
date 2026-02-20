import { useState, useEffect } from 'react';
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
  const [agency, setAgency] = useState<any>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencyAndCars = async () => {
      try {
        setLoading(true);

        // Fetch all businesses to find the one matching the ID
        const businessResponse = await fetch('http://10.4.20.141:3000/api/businesses');
        
        if (businessResponse.ok) {
          const businesses = await businessResponse.json();
          const foundBusiness = businesses.find((b: any) => b.business_id === parseInt(id || '0'));
          
          if (foundBusiness) {
            setAgency({
              id: foundBusiness.business_id,
              name: foundBusiness.business_name,
              image: foundBusiness.cover_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b83ad8e?w=600',
              rating: foundBusiness.rating || 4.5,
              reviewCount: foundBusiness.review_count || 0,
              location: foundBusiness.location || 'City Location',
              description: foundBusiness.description || 'Premium car rental service',
              totalCars: foundBusiness.car_count || 0,
            });
          } else {
            // Fallback to mock data
            const mockAgency = mockAgencies.find((a) => a.id === id);
            setAgency(mockAgency || null);
          }
        } else {
          // Fallback to mock data
          const mockAgency = mockAgencies.find((a) => a.id === id);
          setAgency(mockAgency || null);
        }

        // Fetch cars for this business
        const carsResponse = await fetch('http://10.4.20.141:3000/api/cars');
        
        if (carsResponse.ok) {
          const allCars = await carsResponse.json();
          
          // Filter cars by business_id
          const filteredCars = allCars
            .filter((car: any) => car.business_id === parseInt(id || '0'))
            .map((car: any) => ({
              id: car.car_id,
              name: `${car.brand} ${car.model}`,
              brand: car.brand || 'Unknown',
              type: car.model || 'Sedan',
              image: car.cover_image || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
              pricePerDay: parseFloat(car.price_per_day),
              seats: 5,
              transmission: car.transmission || 'Automatic',
              fuelType: car.fuel_type || 'Petrol',
              available: true,
              agencyId: car.business_id,
              agencyName: car.business_name || 'Agency',
              description: car.description || '',
            }));
          
          setCars(filteredCars);
        } else {
          // Fallback to mock data
          const mockCarsData = mockCars.filter((c) => c.agencyId === id);
          setCars(mockCarsData);
        }
      } catch (err) {
        console.error('Error fetching agency details:', err);
        // Fallback to mock data
        const mockAgency = mockAgencies.find((a) => a.id === id);
        setAgency(mockAgency || null);
        const mockCarsData = mockCars.filter((c) => c.agencyId === id);
        setCars(mockCarsData);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencyAndCars();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-24 text-center">
          <p className="text-lg text-muted-foreground">Loading agency details...</p>
        </div>
      </div>
    );
  }

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
