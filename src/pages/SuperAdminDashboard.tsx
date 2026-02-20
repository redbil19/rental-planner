import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, CheckCircle, XCircle, AlertCircle, Building2, Mail, MapPin, Eye, X, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface CarData {
  id: string;
  name: string;
  type: string;
  image: string;
  pricePerDay: number;
  seats: number;
  transmission: string;
  fuelType: string;
  status: 'available' | 'booked' | 'out_of_service';
}

interface PendingAgency {
  id: string;
  name: string;
  email: string;
  location: string;
  description: string;
  image: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  cars?: CarData[];
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState<PendingAgency[]>([]);

  const [selectedAgency, setSelectedAgency] = useState<PendingAgency | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [agencyDetailsOpen, setAgencyDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  const handleApprove = (id: string) => {
    setAgencies(agencies.map(a => 
      a.id === id ? { ...a, status: 'approved' as const } : a
    ));
    toast.success('Agency approved successfully!');
  };

  const handleReject = (id: string) => {
    setAgencies(agencies.map(a => 
      a.id === id ? { ...a, status: 'rejected' as const } : a
    ));
    toast.success('Agency rejected');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const pendingCount = agencies.filter(a => a.status === 'pending').length;
  const approvedCount = agencies.filter(a => a.status === 'approved').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">RentPlan Superadmin</h1>
            <p className="text-sm text-muted-foreground">Manage agencies and platform</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border-l-4 border-l-blue-400">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-2">Agencies waiting for review</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-400">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved Agencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600">{approvedCount}</div>
              <p className="text-xs text-muted-foreground mt-2">Active on platform</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-400">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Agencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{agencies.length}</div>
              <p className="text-xs text-muted-foreground mt-2">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="approved">Approved Agencies</TabsTrigger>
          </TabsList>

          {/* Pending Agencies Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      Pending Agency Approvals
                    </CardTitle>
                    <CardDescription>Review and approve new agencies</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {agencies.filter(a => a.status === 'pending').length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agencies.filter(a => a.status === 'pending').map(agency => (
                      <div key={agency.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <img
                            src={agency.image}
                            alt={agency.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{agency.name}</h3>
                            <div className="text-sm text-muted-foreground space-y-1 mt-2">
                              <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {agency.email}
                              </p>
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {agency.location}
                              </p>
                              <p>{agency.description}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-col">
                            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedAgency(agency)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{selectedAgency?.name}</DialogTitle>
                                </DialogHeader>
                                {selectedAgency && (
                                  <div className="space-y-4">
                                    <img
                                      src={selectedAgency.image}
                                      alt={selectedAgency.name}
                                      className="w-full h-48 rounded-lg object-cover"
                                    />
                                    <div>
                                      <h4 className="font-semibold text-foreground mb-2">Details</h4>
                                      <div className="space-y-2 text-sm">
                                        <p><span className="font-semibold">Email:</span> {selectedAgency.email}</p>
                                        <p><span className="font-semibold">Location:</span> {selectedAgency.location}</p>
                                        <p><span className="font-semibold">Description:</span> {selectedAgency.description}</p>
                                        <p><span className="font-semibold">Applied:</span> {selectedAgency.createdAt}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white"
                              onClick={() => handleApprove(agency.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(agency.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Agencies Tab */}
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Approved Agencies
                </CardTitle>
                <CardDescription>View all approved agencies and their car inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {agencies.filter(a => a.status === 'approved').map(agency => (
                    <div key={agency.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={agency.image}
                            alt={agency.name}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">{agency.name}</h3>
                            <div className="text-sm text-muted-foreground space-y-1 mt-2">
                              <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {agency.email}
                              </p>
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {agency.location}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Badge variant="default">Approved</Badge>
                      </div>

                      {/* Agency Cars Section */}
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          Cars in Inventory ({agency.cars?.length || 0})
                        </h4>
                        {!agency.cars || agency.cars.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-4">No cars in inventory yet</p>
                        ) : (
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {agency.cars.map(car => (
                              <div key={car.id} className="border rounded-lg p-3 hover:bg-white transition-colors">
                                <img
                                  src={car.image}
                                  alt={car.name}
                                  className="w-full h-32 rounded object-cover mb-3"
                                />
                                <h5 className="font-semibold text-sm text-foreground">{car.name}</h5>
                                <p className="text-xs text-muted-foreground">{car.type}</p>
                                <div className="mt-2 space-y-1 text-xs">
                                  <p><span className="font-semibold">Price:</span> ${car.pricePerDay}/day</p>
                                  <p><span className="font-semibold">Seats:</span> {car.seats}</p>
                                  <p><span className="font-semibold">Transmission:</span> {car.transmission}</p>
                                  <p><span className="font-semibold">Fuel:</span> {car.fuelType}</p>
                                </div>
                                <Badge 
                                  variant={car.status === 'available' ? 'default' : car.status === 'booked' ? 'secondary' : 'destructive'}
                                  className="mt-2"
                                >
                                  {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
