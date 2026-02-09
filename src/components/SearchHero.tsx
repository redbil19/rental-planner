import { useState } from 'react';
import { Search, MapPin, Users, Zap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import heroBg from '@/assets/hero-bg.jpg';

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
  const [location, setLocation] = useState('all');
  const [passengers, setPassengers] = useState('all');
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
      // Only filter by location/type/passengers if at least one filter is active
      if (location === 'all' && carType === 'all' && passengers === 'all') {
        alert('Please select at least dates or apply filters');
        return;
      }
      // Allow location-only search
      const filtered = mockCars
        .filter((car) => {
          if (carType !== 'all' && car.type !== carType) return false;
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
        if (carType !== 'all' && car.type !== carType) return false;
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
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroBg})` }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/75 via-primary/60 to-primary/50"></div>

        <div className="container relative py-20 md:py-28 z-10">
          {/* Hero Content */}
          <div className="mx-auto max-w-4xl text-center mb-16 animate-fade-in">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-foreground mb-6 leading-tight">
              Discover & Book
              <span className="block text-transparent bg-gradient-to-r from-accent via-accent to-yellow-400 bg-clip-text">
                Premium Cars
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto leading-relaxed">
              Compare prices across multiple trusted rental agencies and find the perfect vehicle for your journey at the best price.
            </p>
          </div>

          {/* Advanced Search Section */}
          <div className="mx-auto max-w-5xl">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl overflow-hidden">
              <div className="space-y-6 p-6 md:p-8">
                
                {/* Header with icons */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Search className="h-5 w-5 text-accent" />
                    Search Available Cars
                  </h3>
                </div>

                {/* Dates Row - Premium styling */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Pick-up Date Calendar */}
                  <div className="group flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
                      📅 Pick-up Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-11 w-full border-2 border-muted hover:border-accent/50 focus:border-accent justify-start text-left font-normal bg-white"
                        >
                          {startDate ? formatDate(startDate) : 'Select date'}
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
                  </div>

                  {/* Drop-off Date Calendar */}
                  <div className="group flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
                      📅 Drop-off Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-11 w-full border-2 border-muted hover:border-accent/50 focus:border-accent justify-start text-left font-normal bg-white"
                        >
                          {endDate ? formatDate(endDate) : 'Select date'}
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
                  </div>

                  {/* Search Button - Spans on smaller screens */}
                  <div className="flex flex-col justify-end">
                    <Button
                      size="lg"
                      className="h-11 w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                      onClick={handleSearch}
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Search Now
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-muted-foreground">Or filter by preferences</span>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Car Type Filter */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
                      🚙 Car Type
                    </label>
                    <Select value={carType} onValueChange={setCarType}>
                      <SelectTrigger className="h-11 border-2 border-muted bg-white hover:border-accent/50 focus:border-accent transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Sports Car">Sports Car</SelectItem>
                        <SelectItem value="Convertible">Convertible</SelectItem>
                        <SelectItem value="Luxury Sedan">Luxury Sedan</SelectItem>
                        <SelectItem value="Electric Sedan">Electric Sedan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Passengers Filter */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
                      👥 Passengers
                    </label>
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger className="h-11 border-2 border-muted bg-white hover:border-accent/50 focus:border-accent transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="2">2+ Seats</SelectItem>
                        <SelectItem value="4">4+ Seats</SelectItem>
                        <SelectItem value="5">5+ Seats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
                      📍 Location
                    </label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="h-11 border-2 border-muted bg-white hover:border-accent/50 focus:border-accent transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="Miami">Miami</SelectItem>
                        <SelectItem value="San Francisco">San Francisco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Info text */}
                <div className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-3 text-sm text-foreground/70">
                  💡 <strong>Tip:</strong> You can search by location alone without dates, or set dates for precise availability checking.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            {/* Header */}
            <div className="mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 border border-accent/20">
                <span className="text-2xl">✨</span>
                <span className="text-sm font-semibold text-accent">Search Results</span>
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                {searchResults.length > 0 ? (
                  <>Found <span className="text-accent">{searchResults.length}</span> Available Car{searchResults.length !== 1 ? 's' : ''}</>
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
                            <div className="flex justify-between items-baseline bg-accent/5 rounded-lg px-3 py-2 border border-accent/20">
                              <span className="text-sm font-medium text-foreground">Total ({days} days):</span>
                              <span className="text-xl font-bold text-accent">{totalPriceStr}</span>
                            </div>
                          )}
                        </div>

                        {/* Book Button */}
                        <Button 
                          className="w-full h-11 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold shadow-md hover:shadow-lg transition-all"
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
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                  <Search className="h-8 w-8 text-accent" />
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
