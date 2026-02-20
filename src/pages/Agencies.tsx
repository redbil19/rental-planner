import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { AgencyCard } from '@/components/AgencyCard';
import { mockAgencies } from '@/data/mockData';

export default function Agencies() {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://10.4.20.141:3000/api/businesses');
        
        if (!response.ok) {
          console.error('Failed to fetch businesses:', response.status);
          // Use mock data if API fails
          setAgencies(mockAgencies);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          // Transform API data to match Agency type
          const transformedAgencies = data.map(business => ({
            id: business.business_id,
            name: business.business_name,
            image: business.cover_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b83ad8e?w=400',
            rating: business.rating || 4.5,
            reviewCount: business.review_count || 0,
            location: business.location || 'City Location',
            carCount: business.car_count || 0,
          }));
          setAgencies(transformedAgencies);
        } else {
          // Use mock data if no agencies returned
          setAgencies(mockAgencies);
        }
      } catch (err) {
        console.error('Error fetching agencies:', err);
        // Fallback to mock data on error
        setAgencies(mockAgencies);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  const displayAgencies = agencies.length > 0 ? agencies : mockAgencies;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            All Car Rental Agencies
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse {displayAgencies.length} trusted partners
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading agencies...</div>
          </div>
        )}

        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayAgencies.map((agency, index) => (
              <div
                key={agency.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AgencyCard agency={agency} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
