import { Client } from '@/types/client';

const STORAGE_KEY = 'client-reminder-app-clients';

export const getClients = (): Client[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveClients = (clients: Client[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
};

export const addClient = (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client => {
  const clients = getClients();
  const newClient: Client = {
    ...client,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  clients.push(newClient);
  saveClients(clients);
  return newClient;
};

export const updateClient = (id: string, updates: Partial<Client>): Client | null => {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  clients[index] = {
    ...clients[index],
    ...updates,
    id: clients[index].id,
    createdAt: clients[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  saveClients(clients);
  return clients[index];
};

export const deleteClient = (id: string): boolean => {
  const clients = getClients();
  const filtered = clients.filter(c => c.id !== id);
  if (filtered.length === clients.length) return false;
  saveClients(filtered);
  return true;
};

export const getClientById = (id: string): Client | null => {
  const clients = getClients();
  return clients.find(c => c.id === id) || null;
};
