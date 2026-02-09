import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { SearchHero } from '@/components/SearchHero';
import { AgencyCard } from '@/components/AgencyCard';
import { mockAgencies } from '@/data/mockData';

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

      <SearchHero />

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
