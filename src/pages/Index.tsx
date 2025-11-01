import { useState, useEffect } from 'react';
import { Client } from '@/types/client';
import { getClients, addClient, updateClient, deleteClient } from '@/lib/storage';
import { getUpcomingEvents, getTomorrowEvents } from '@/lib/events';
import { checkAndNotifyUpcomingEvents, isNotificationEnabled } from '@/lib/notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Bell, Users, Calendar } from 'lucide-react';
import EventCard from '@/components/EventCard';
import ClientCard from '@/components/ClientCard';
import AddClientDialog from '@/components/AddClientDialog';
import NotificationPermissionBanner from '@/components/NotificationPermissionBanner';
import { toast } from 'sonner';

const Index = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  useEffect(() => {
    loadClients();
  }, []);
  
  useEffect(() => {
    // Check for upcoming events and send notifications
    const upcomingEvents = getUpcomingEvents(clients);
    const tomorrowEvents = getTomorrowEvents(upcomingEvents);
    
    // Show in-app toast notifications
    if (tomorrowEvents.length > 0) {
      tomorrowEvents.forEach(event => {
        toast.info(`Reminder: Tomorrow is ${event.clientName}'s ${event.eventName}! 🔔`, {
          duration: 5000,
        });
      });
    }
    
    // Send browser notifications if enabled
    if (isNotificationEnabled()) {
      checkAndNotifyUpcomingEvents(upcomingEvents);
    }
  }, [clients]);
  
  const loadClients = () => {
    setClients(getClients());
  };
  
  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingClient) {
      updateClient(editingClient.id, clientData);
    } else {
      addClient(clientData);
    }
    loadClients();
    setEditingClient(null);
  };
  
  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setDialogOpen(true);
  };
  
  const handleDeleteClient = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
      loadClients();
      toast.success('Client deleted');
    }
  };
  
  const filteredClients = clients.filter(client =>
    client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phoneNumber.includes(searchQuery)
  );
  
  const upcomingEvents = getUpcomingEvents(clients).slice(0, 10);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Client Reminders</h1>
              <p className="text-xs text-muted-foreground">Never miss an important date</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-2">
              <Users className="h-4 w-4" />
              All Clients
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                <p className="text-muted-foreground mb-4">Add clients to track their important dates</p>
                <Button onClick={() => { setEditingClient(null); setDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Client
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 max-w-2xl mx-auto">
                {upcomingEvents.map((event, idx) => (
                  <EventCard key={`${event.clientId}-${event.eventType}-${idx}`} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {filteredClients.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? 'No clients found' : 'No clients yet'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'Try a different search term' : 'Start by adding your first client'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => { setEditingClient(null); setDialogOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Client
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredClients.map(client => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onEdit={handleEditClient}
                      onDelete={handleDeleteClient}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <AddClientDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingClient(null);
        }}
        onSave={handleSaveClient}
        editClient={editingClient}
      />
      
      {/* Notification Permission Banner */}
      <NotificationPermissionBanner />
      
      {/* Floating Add Button */}
      <Button
        onClick={() => { setEditingClient(null); setDialogOpen(true); }}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 p-0"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Index;
