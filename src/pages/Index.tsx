import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { AgencyCard } from '@/components/AgencyCard';
import { mockAgencies } from '@/data/mockData';
import heroBg from '@/assets/hero-bg.jpg';

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

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Luxury cars"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        </div>

        <div className="container relative py-24 md:py-32">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Plan Your Perfect
              <span className="block text-accent">Car Rental</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 md:text-xl">
              Compare and book from multiple trusted car rental agencies in one place. 
              Find the perfect vehicle for your journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/agencies">
                <Button variant="hero" size="xl">
                  Browse All Agencies
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="heroOutline" size="xl">
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground">
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

      {/* Featured Agencies */}
      <section className="border-t bg-muted/50 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Featured Agencies
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover our top-rated car rental partners
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockAgencies.map((agency, index) => (
              <div
                key={agency.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AgencyCard agency={agency} />
              </div>
            ))}
          </div>

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

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Car Rental Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
