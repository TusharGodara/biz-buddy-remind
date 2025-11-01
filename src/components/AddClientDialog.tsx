import { useState, useEffect } from 'react';
import { Client, CustomEvent } from '@/types/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editClient?: Client | null;
}

const AddClientDialog = ({ open, onOpenChange, onSave, editClient }: AddClientDialogProps) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthday, setBirthday] = useState('');
  const [anniversary, setAnniversary] = useState('');
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
  
  useEffect(() => {
    if (editClient) {
      setFullName(editClient.fullName);
      setPhoneNumber(editClient.phoneNumber);
      setBirthday(editClient.birthday || '');
      setAnniversary(editClient.anniversary || '');
      setCustomEvents(editClient.customEvents);
    } else {
      resetForm();
    }
  }, [editClient, open]);
  
  const resetForm = () => {
    setFullName('');
    setPhoneNumber('');
    setBirthday('');
    setAnniversary('');
    setCustomEvents([]);
  };
  
  const addCustomEvent = () => {
    setCustomEvents([...customEvents, { id: crypto.randomUUID(), name: '', date: '' }]);
  };
  
  const updateCustomEvent = (id: string, field: 'name' | 'date', value: string) => {
    setCustomEvents(customEvents.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };
  
  const removeCustomEvent = (id: string) => {
    setCustomEvents(customEvents.filter(e => e.id !== id));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast.error('Please enter client name');
      return;
    }
    
    if (!phoneNumber.trim()) {
      toast.error('Please enter phone number');
      return;
    }
    
    const validCustomEvents = customEvents.filter(e => e.name.trim() && e.date);
    
    onSave({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      birthday: birthday || undefined,
      anniversary: anniversary || undefined,
      customEvents: validCustomEvents,
    });
    
    toast.success(editClient ? 'Client updated!' : 'Client added!');
    resetForm();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {editClient ? 'Update client information and events' : 'Add a new client with their important dates'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthday">Birthday</Label>
            <Input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="anniversary">Anniversary</Label>
            <Input
              id="anniversary"
              type="date"
              value={anniversary}
              onChange={(e) => setAnniversary(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Custom Events</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomEvent}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Event
              </Button>
            </div>
            
            <div className="space-y-2">
              {customEvents.map((event) => (
                <div key={event.id} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Event name"
                      value={event.name}
                      onChange={(e) => updateCustomEvent(event.id, 'name', e.target.value)}
                    />
                    <Input
                      type="date"
                      value={event.date}
                      onChange={(e) => updateCustomEvent(event.id, 'date', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomEvent(event.id)}
                    className="mt-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              {editClient ? 'Update Client' : 'Add Client'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
