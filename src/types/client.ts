export interface CustomEvent {
  id: string;
  name: string;
  date: string; // ISO date string
}

export interface Client {
  id: string;
  fullName: string;
  phoneNumber: string;
  birthday?: string; // ISO date string
  anniversary?: string; // ISO date string
  customEvents: CustomEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface UpcomingEvent {
  clientId: string;
  clientName: string;
  eventType: 'birthday' | 'anniversary' | 'custom';
  eventName: string;
  eventDate: string;
  daysUntil: number;
}
