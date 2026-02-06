import { Header } from '@/components/Header';
import { AgencyCard } from '@/components/AgencyCard';
import { mockAgencies } from '@/data/mockData';

export default function Agencies() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            All Car Rental Agencies
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse {mockAgencies.length} trusted partners
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockAgencies.map((agency, index) => (
            <div
              key={agency.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <AgencyCard agency={agency} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
