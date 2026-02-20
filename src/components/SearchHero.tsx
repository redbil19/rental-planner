import { useState } from 'react';
import { Search, MapPin, Users, Zap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/obi-aZKJEvydrNM-unsplash.jpg';
import rentplanLogo from '@/assets/rentplan.png';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { mockCars, mockBookings, mockAgencies } from '@/data/mockData';

interface FilteredCar {
  id: string;
  name: string;
  type: string;
  image: string;
  pricePerDay: number;
  seats: number;
  transmission: string;
  fuelType: string;
  agencyName: string;
  agencyId: string;
}

export function SearchHero() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [carType, setCarType] = useState('all');
  const [carBrand, setCarBrand] = useState('all');
  const [location, setLocation] = useState('all');
  const [passengers, setPassengers] = useState('all');
  const [carName, setCarName] = useState('');
  const [searchResults, setSearchResults] = useState<FilteredCar[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  // Get all booked dates from bookings
  const getBookedDates = (): Date[] => {
    const bookedDates: Date[] = [];
    mockBookings.forEach((booking) => {
      if (booking.status === 'cancelled') return;
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        bookedDates.push(new Date(d));
      }
    });
    return bookedDates;
  };

  const bookedDates = getBookedDates();

  // Check if a date is booked
  const isDateBooked = (date: Date): boolean => {
    return bookedDates.some(
      (bookedDate) =>
        bookedDate.toDateString() === date.toDateString()
    );
  };

  // Format date for display
  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isCarAvailable = (carId: string, start: Date, end: Date): boolean => {
    return !mockBookings.some((booking) => {
      if (booking.carId !== carId) return false;
      if (booking.status === 'cancelled') return false;
      
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      return !(end < bookingStart || start > bookingEnd);
    });
  };

  const handleSearch = () => {
    // Allow search with just filters if dates aren't selected
    if (!startDate || !endDate) {
      // Allow if car name is entered or other filters are active
      if (location === 'all' && carType === 'all' && passengers === 'all' && carName === '') {
        alert('Please select at least dates, enter a car name, or apply filters');
        return;
      }
      // Allow location-only or car-name search
      const filtered = mockCars
        .filter((car) => {
          // Filter by car name if entered
          if (carName) {
            const searchLower = carName.toLowerCase();
            const matchesName = car.name.toLowerCase().includes(searchLower) || 
                              car.brand?.toLowerCase().includes(searchLower) ||
                              car.type?.toLowerCase().includes(searchLower);
            if (!matchesName) return false;
          }
          
          if (carType !== 'all' && car.type !== carType) return false;
          if (carBrand !== 'all' && car.brand !== carBrand) return false;
          if (passengers !== 'all' && car.seats < parseInt(passengers)) return false;
          return car.available; // Show available cars by default
        })
        .map((car) => {
          const agency = mockAgencies.find((a) => a.id === car.agencyId);
          return {
            ...car,
            agencyName: agency?.name || 'Unknown Agency',
          };
        });

      if (location !== 'all') {
        filtered.sort((a, b) => {
          const aMatch = mockAgencies.find((ag) => ag.id === a.agencyId)?.location.includes(location) ? 0 : 1;
          const bMatch = mockAgencies.find((ag) => ag.id === b.agencyId)?.location.includes(location) ? 0 : 1;
          return aMatch - bMatch;
        });
      }

      setSearchResults(filtered);
      setHasSearched(true);
      setFilterActive(true);
      return;
    }

    if (startDate >= endDate) {
      alert('End date must be after start date');
      return;
    }

    const filtered = mockCars
      .filter((car) => {
        // Filter by car name if entered
        if (carName) {
          const searchLower = carName.toLowerCase();
          const matchesName = car.name.toLowerCase().includes(searchLower) || 
                            car.brand?.toLowerCase().includes(searchLower) ||
                            car.type?.toLowerCase().includes(searchLower);
          if (!matchesName) return false;
        }
        
        if (carType !== 'all' && car.type !== carType) return false;
        if (carBrand !== 'all' && car.brand !== carBrand) return false;
        if (passengers !== 'all' && car.seats < parseInt(passengers)) return false;
        return isCarAvailable(car.id, startDate, endDate);
      })
      .map((car) => {
        const agency = mockAgencies.find((a) => a.id === car.agencyId);
        return {
          ...car,
          agencyName: agency?.name || 'Unknown Agency',
        };
      })
      .sort((a, b) => a.pricePerDay - b.pricePerDay);

    if (location !== 'all') {
      filtered.sort((a, b) => {
        const aMatch = mockAgencies.find((ag) => ag.id === a.agencyId)?.location.includes(location) ? 0 : 1;
        const bMatch = mockAgencies.find((ag) => ag.id === b.agencyId)?.location.includes(location) ? 0 : 1;
        return aMatch - bMatch;
      });
    }

    setSearchResults(filtered);
    setHasSearched(true);
    setFilterActive(false);
  };

  const calculateDays = (start: Date | undefined, end: Date | undefined): number => {
    if (!start || !end) return 0;
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const days = calculateDays(startDate, endDate);

  return (
    <div className="w-full">
      {/* Hero Section - Modern Design with Cars Background Image */}
      <section className="relative overflow-hidden -mt-20 pt-20 min-h-[650px] flex items-center" style={{ backgroundImage: `linear-gradient(135deg, rgba(30, 41, 59, 0.55) 0%, rgba(15, 23, 42, 0.45) 100%), url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900"></div>

        {/* Logo Accent - Left side */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none hidden lg:block">
          <img src={rentplanLogo} alt="RentPlan" className="h-64 w-auto drop-shadow-lg" />
        </div>

        {/* Logo Accent - Right side */}
        <div className="absolute right-0 top-1/4 opacity-20 pointer-events-none hidden lg:block">
          <img src={rentplanLogo} alt="RentPlan" className="h-48 w-auto drop-shadow-lg" />
        </div>

        <div className="container relative z-10 w-full">
          <div className="max-w-3xl mx-auto text-center">
            {/* Hero Heading */}
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white mb-4 leading-tight drop-shadow-lg">
              Premium Car
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Rentals Made Simple</span>
            </h1>
            
            {/* Hero Subtitle */}
            <p className="text-base md:text-lg text-white/90 mb-12 leading-relaxed drop-shadow-md font-light">
              Discover an elegant selection of premium vehicles from trusted partners. Book instantly, drive confidently.
            </p>

            {/* Search Bar - Centered Below */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 flex flex-col sm:flex-row items-center gap-3 justify-center">
              {/* Search Text Field */}
              <div className="relative w-full sm:flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search car..."
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  className="h-11 w-full border border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 text-gray-900 placeholder-gray-400 rounded-lg transition-colors text-sm pl-9"
                />
              </div>

              {/* Pick-up Date Calendar */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 sm:w-32 border border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-400 focus:border-blue-500 justify-center sm:justify-start text-left font-normal text-gray-800 rounded-lg transition-colors text-sm px-3 whitespace-nowrap w-full"
                  >
                    {startDate ? formatDate(startDate) : 'Pick-up'}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) =>
                      date < new Date() || isDateBooked(date)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Drop-off Date Calendar */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 sm:w-32 border border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-400 focus:border-blue-500 justify-center sm:justify-start text-left font-normal text-gray-800 rounded-lg transition-colors text-sm px-3 whitespace-nowrap w-full"
                  >
                    {endDate ? formatDate(endDate) : 'Drop-off'}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) =>
                      date < new Date() || 
                      (startDate && date <= startDate) ||
                      isDateBooked(date)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Search Button */}
              <Button
                className="h-11 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg px-6 w-full sm:w-auto"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            {/* Header */}
            <div className="mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 px-4 py-2 border border-blue-400/20">
                <span className="text-2xl">✨</span>
                <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Search Results</span>
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                {searchResults.length > 0 ? (
                  <>Found <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{searchResults.length}</span> Available Car{searchResults.length !== 1 ? 's' : ''}</>
                ) : (
                  'No Cars Found'
                )}
              </h2>
              
              {startDate && endDate && (
                <p className="text-lg text-muted-foreground flex items-center gap-2">
                  <span className="inline-block">📅</span>
                  <span>{days} day{days !== 1 ? 's' : ''} rental • {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}</span>
                </p>
              )}
            </div>

            {searchResults.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((car, index) => {
                  const totalPrice = days > 0 ? car.pricePerDay * days : 0;
                  const pricePerDayStr = `$${car.pricePerDay}`;
                  const totalPriceStr = totalPrice > 0 ? `$${totalPrice}` : '';

                  return (
                    <Card 
                      key={car.id} 
                      className="group overflow-hidden border border-muted/50 transition-all duration-300 hover:shadow-2xl hover:border-accent/30 hover:-translate-y-1 bg-white/50 backdrop-blur-sm"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Image Section */}
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-125"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Badge */}
                        <div className="absolute right-4 top-4">
                          <div className="inline-flex items-center rounded-full border border-transparent bg-gradient-to-r from-accent to-accent/80 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                            ✓ Available
                          </div>
                        </div>

                        {/* Type Badge */}
                        <div className="absolute left-4 top-4">
                          <div className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-foreground">
                            {car.type}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5 p-5">
                        {/* Title & Agency */}
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                            {car.name}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {car.agencyName}
                          </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-muted/50 p-2 text-center">
                            <div className="text-sm font-semibold text-foreground">{car.seats}</div>
                            <div className="text-xs text-muted-foreground">Seats</div>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-2 text-center">
                            <div className="text-sm font-semibold text-foreground">{car.transmission === 'automatic' ? 'Auto' : 'Manual'}</div>
                            <div className="text-xs text-muted-foreground">Transmission</div>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-2 text-center col-span-2">
                            <div className="text-sm font-semibold text-foreground flex items-center justify-center gap-1">
                              {car.fuelType === 'Electric' ? (
                                <>
                                  <Zap className="h-3.5 w-3.5" />
                                  Electric
                                </>
                              ) : (
                                car.fuelType
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">Fuel Type</div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-muted/50"></div>

                        {/* Pricing */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-baseline">
                            <span className="text-sm text-muted-foreground">Per Day:</span>
                            <span className="text-2xl font-bold text-accent">{pricePerDayStr}</span>
                          </div>
                          {days > 0 && totalPriceStr && (
                            <div className="flex justify-between items-baseline bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-lg px-3 py-2 border border-blue-400/20">
                              <span className="text-sm font-medium text-foreground">Total ({days} days):</span>
                              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{totalPriceStr}</span>
                            </div>
                          )}
                        </div>

                        {/* Book Button */}
                        <Button 
                          className="w-full h-11 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                          size="lg"
                        >
                          Reserve Now
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-muted-foreground/30 bg-white/50 backdrop-blur p-16 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20">
                  <Search className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">No Cars Available</h3>
                <p className="mt-3 text-lg text-muted-foreground max-w-sm mx-auto">
                  We couldn't find any cars matching your criteria. Try adjusting your dates, location, or filters.
                </p>
                <Button 
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setHasSearched(false);
                    setStartDate(undefined);
                    setEndDate(undefined);
                  }}
                >
                  New Search
                </Button>
              </Card>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
