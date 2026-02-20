import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, Shield, Clock, Award, MapPin, Users, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { SearchHero } from '@/components/SearchHero';
import { AgencyCard } from '@/components/AgencyCard';
import { mockAgencies } from '@/data/mockData';
import benefitsImage from '@/assets/archivio-automobile-gsNRBHH1Ij4-unsplash.jpg';
import rentplanLogo from '@/assets/rentplan.png';

const features = [
  {
    icon: Shield,
    title: 'Trusted Partners',
    description: 'All agencies are verified and rated by real customers.',
  },
  {
    icon: Clock,
    title: 'Easy Booking',
    description: 'Book your perfect car in minutes with our simple calendar system.',
  },
  {
    icon: Award,
    title: 'Best Prices',
    description: 'Compare prices across agencies to find the best deal.',
  },
];

const benefits = [
  {
    icon: MapPin,
    title: 'Multiple Locations',
    description: 'Pick up and drop off at locations convenient for you',
  },
  {
    icon: Users,
    title: '24/7 Support',
    description: 'Our dedicated team is always ready to help you',
  },
  {
    icon: TrendingUp,
    title: 'Transparent Pricing',
    description: 'No hidden fees, all costs are displayed upfront',
  },
  {
    icon: Zap,
    title: 'Instant Confirmation',
    description: 'Get your booking confirmation immediately',
  },
];

export default function Index() {
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
          // Transform API data to match Agency type and limit to 4 featured agencies
          const transformedAgencies = data.map(business => ({
            id: business.business_id,
            name: business.business_name,
            image: business.cover_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b83ad8e?w=400',
            rating: business.rating || 4.5,
            reviewCount: business.review_count || 0,
            location: business.location || 'City Location',
            carCount: business.car_count || 0,
          })).slice(0, 4); // Limit to 4 featured agencies
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

      <SearchHero />

      {/* Featured Agencies - Moved right after hero */}
      <section className="border-t bg-white py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Featured Agencies
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover our top-rated car rental partners
            </p>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-48">
              <div className="text-muted-foreground">Loading agencies...</div>
            </div>
          )}

          {!loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {displayAgencies.map((agency, index) => (
                <div
                  key={agency.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <AgencyCard agency={agency} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/agencies">
              <Button variant="outline" size="lg">
                View All Agencies
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button> 
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.93) 100%), url("https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1200&h=600&fit=crop")'}}>
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-80 h-80 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose RentPlan?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Experience the best car rental platform with unmatched benefits</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 text-blue-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:text-white">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative border-t bg-cover bg-center bg-no-repeat py-16 md:py-24 overflow-hidden" style={{backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.91) 100%), url(${benefitsImage})`}}>
        {/* Background image overlay */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%230066cc%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
        
        <div className="container relative z-10">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Unmatched Benefits
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need for a perfect car rental experience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="group flex flex-col items-center text-center animate-fade-in p-6 rounded-xl hover:bg-white/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400/20 to-cyan-400/20 text-blue-500 group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to get your perfect car
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Search & Select',
                description: 'Enter your dates and location to see available vehicles from all our partner agencies',
              },
              {
                step: '02',
                title: 'Review & Book',
                description: 'Compare prices, features, and ratings to choose the perfect car for your needs',
              },
              {
                step: '03',
                title: 'Pick Up & Drive',
                description: 'Collect your car at your chosen location and hit the road with confidence',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative flex flex-col animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white font-display text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
                {index < 2 && (
                  <div className="absolute top-7 -right-4 hidden h-0.5 w-8 bg-gradient-to-r from-blue-400 to-cyan-400/50 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-16 md:py-24">
        <div className="container">
          <div className="rounded-2xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 p-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Ready to Find Your Perfect Car?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Book now and save on your next rental. Compare prices across multiple agencies and drive with confidence.
            </p>
            <Link to="/cars">
              <Button size="lg" className="mt-8">
                Browse All Cars
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <div className="mb-4 flex items-center gap-0">
                <img src={rentplanLogo} alt="RentPlan" className="h-14 w-auto" />
                <div className="flex items-baseline gap-0 -ml-1">
                  <span className="font-black text-xl text-foreground tracking-tight">Rent</span>
                  <span className="font-black text-xl text-blue-500 tracking-tight">Plan</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Premium car rentals made simple. Find your perfect vehicle from trusted partners.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/cars" className="hover:text-foreground transition">
                    Browse Cars
                  </Link>
                </li>
                <li>
                  <Link to="/agencies" className="hover:text-foreground transition">
                    Find Agencies
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-foreground transition">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-foreground transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/contact" className="hover:text-foreground transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-foreground transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Car Rental Hub. All rights reserved. Your trusted partner in car rentals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
