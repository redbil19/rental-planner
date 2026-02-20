import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, logout, getStoredToken } from '@/lib/auth';
import type { User } from '@/lib/auth';
import { Mail, Phone, MapPin, Calendar, User as UserIcon, LogOut, Edit2, Plus, Building2, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const token = getStoredToken();
  const [user, setUser] = useState<User | null>(storedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [businessData, setBusinessData] = useState({
    business_name: '',
    vat_number: '',
  });
  const [formData, setFormData] = useState<Partial<User>>(user || {});

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    } as Partial<User>));
  };

  const handleSave = async () => {
    // TODO: Call update API when backend is ready
    setUser(formData as User);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateBusiness = async () => {
    if (!businessData.business_name) {
      toast.error('Please enter business name');
      return;
    }

    setBusinessLoading(true);

    try {
      const response = await fetch('http://10.4.20.141:3000/api/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(businessData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || 'Failed to create business');
        return;
      }

      const data = await response.json();
      toast.success('Business created successfully!');
      setShowBusinessModal(false);
      setBusinessData({ business_name: '', vat_number: '' });
      
      // Redirect to agency dashboard
      setTimeout(() => {
        navigate('/admin/agency');
      }, 1500);
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error('An error occurred while creating business');
    } finally {
      setBusinessLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />

      <div className="container py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
              <p className="text-muted-foreground">Manage your account information</p>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* User Card */}
            <Card className="md:col-span-1 p-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">{user.full_name}</h2>
                <p className="text-sm text-muted-foreground mb-6">{user.role}</p>
                
                {user.role === 'user' && (
                  <Button
                    onClick={() => setShowBusinessModal(true)}
                    className="w-full mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Create Business
                  </Button>
                )}
                
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </Card>

            {/* Details Card */}
            <Card className="md:col-span-2 p-6">
              <div className="space-y-6">
                {isEditing ? (
                  <>
                    {/* Edit Form */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Birthdate
                        </label>
                        <input
                          type="date"
                          name="birthdate"
                          value={formData.birthdate?.split('T')[0] || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postal_code"
                          value={formData.postal_code || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(user);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* View Mode */}
                    <div className="grid gap-4">
                      <div className="flex items-center gap-3 pb-4 border-b">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium text-foreground">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pb-4 border-b">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">{user.phone || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pb-4 border-b">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Birthdate</p>
                          <p className="font-medium text-foreground">
                            {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'Not provided'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pb-4 border-b">
                        <UserIcon className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Gender</p>
                          <p className="font-medium text-foreground capitalize">{user.gender || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pb-4 border-b">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="font-medium text-foreground">
                            {user.address && user.city ? `${user.address}, ${user.city}` : 'Not provided'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Country</p>
                          <p className="font-medium text-foreground">{user.country || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Account Info */}
          <Card className="mt-6 p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Account Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium text-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="font-medium text-foreground">
                  <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-700 text-sm">
                    Active
                  </span>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Business Creation Modal */}
      {showBusinessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Create Business</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={businessData.business_name}
                    onChange={(e) => setBusinessData({ ...businessData, business_name: e.target.value })}
                    placeholder="Your Rental Agency"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    VAT Number
                  </label>
                  <input
                    type="text"
                    value={businessData.vat_number}
                    onChange={(e) => setBusinessData({ ...businessData, vat_number: e.target.value })}
                    placeholder="VAT123456789"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  onClick={handleCreateBusiness}
                  disabled={businessLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2"
                >
                  {businessLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      Create
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowBusinessModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
