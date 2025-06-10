import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useSystem } from '@/contexts/SystemContext';
import { Home, Plus, Edit, Trash2, Search, MapPin } from 'lucide-react';

const HouseSelector: React.FC = () => {
  const { houses, currentHouse, setCurrentHouse, addHouse, updateHouse, deleteHouse } = useSystem();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [postcode, setPostcode] = useState('');
  const [addresses, setAddresses] = useState<string[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  const handleAddHouse = () => {
    if (formData.name && formData.address) {
      addHouse(formData);
      setFormData({ name: '', address: '' });
      setPostcode('');
      setAddresses([]);
      setShowManualEntry(false);
      setIsAddDialogOpen(false);
    }
  };

  const handleEditHouse = () => {
    if (editingHouse && formData.name && formData.address) {
      updateHouse(editingHouse.id, formData);
      setIsEditDialogOpen(false);
      setEditingHouse(null);
      setFormData({ name: '', address: '' });
    }
  };

  const openEditDialog = (house: any) => {
    setEditingHouse(house);
    setFormData({ name: house.name, address: house.address });
    setIsEditDialogOpen(true);
  };

  const searchAddresses = async () => {
    if (!postcode.trim()) return;
    
    setLoadingAddresses(true);
    try {
      // Using a free UK postcode lookup API (Postcodes.io)
      const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.trim())}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          // Create a formatted address from the postcode data
          const formattedAddress = [
            data.result.admin_district,
            data.result.admin_county,
            data.result.country,
            data.result.postcode
          ].filter(Boolean).join(', ');
          
          setAddresses([formattedAddress]);
        } else {
          setAddresses([]);
        }
      } else {
        console.error('Postcode lookup failed');
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error looking up postcode:', error);
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const selectAddress = (address: string) => {
    setFormData(prev => ({ ...prev, address }));
    setAddresses([]);
    setPostcode('');
  };

  const resetAddressForm = () => {
    setPostcode('');
    setAddresses([]);
    setShowManualEntry(false);
    setFormData(prev => ({ ...prev, address: '' }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          House Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="house-select">Current House</Label>
            <Select value={currentHouse?.id || ''} onValueChange={(value) => {
              const house = houses.find(h => h.id === value);
              setCurrentHouse(house || null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a house" />
              </SelectTrigger>
              <SelectContent>
                {houses.map((house) => (
                  <SelectItem key={house.id} value={house.id}>
                    {house.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              resetAddressForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="mt-6">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New House</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="house-name">House Name</Label>
                  <Input
                    id="house-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Main House, Holiday Home"
                  />
                </div>
                
                <div>
                  <Label htmlFor="house-address">Address</Label>
                  
                  {!showManualEntry && !formData.address && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          id="postcode"
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                          placeholder="Enter postcode (e.g. SW1A 1AA)"
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          onClick={searchAddresses}
                          disabled={loadingAddresses || !postcode.trim()}
                          size="sm"
                        >
                          {loadingAddresses ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      {addresses.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Select an address:</p>
                          {addresses.map((address, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full text-left justify-start h-auto p-3"
                              onClick={() => selectAddress(address)}
                            >
                              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">{address}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowManualEntry(true)}
                        className="w-full text-sm"
                      >
                        Enter address manually
                      </Button>
                    </div>
                  )}
                  
                  {(showManualEntry || formData.address) && (
                    <div className="space-y-2">
                      <Textarea
                        id="house-address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Full address including postcode"
                      />
                      {!showManualEntry && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={resetAddressForm}
                          className="w-full text-sm"
                        >
                          Use postcode lookup instead
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                <Button onClick={handleAddHouse} className="w-full">
                  Add House
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {currentHouse && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{currentHouse.name}</h3>
                <p className="text-sm text-muted-foreground">{currentHouse.address}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Added: {currentHouse.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditDialog(currentHouse)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteHouse(currentHouse.id)}
                  disabled={houses.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit House</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-house-name">House Name</Label>
                <Input
                  id="edit-house-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-house-address">Address</Label>
                <Textarea
                  id="edit-house-address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <Button onClick={handleEditHouse} className="w-full">
                Update House
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default HouseSelector;
