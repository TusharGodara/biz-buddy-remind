import { Client, UpcomingEvent } from '@/types/client';

const getDaysUntilDate = (targetDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  
  // Set target to current year
  target.setFullYear(currentYear);
  
  // If the date has passed this year, use next year
  if (target < today) {
    target.setFullYear(currentYear + 1);
  }
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getUpcomingEvents = (clients: Client[]): UpcomingEvent[] => {
  const events: UpcomingEvent[] = [];
  
  clients.forEach(client => {
    // Birthday
    if (client.birthday) {
      const daysUntil = getDaysUntilDate(client.birthday);
      events.push({
        clientId: client.id,
        clientName: client.fullName,
        eventType: 'birthday',
        eventName: 'Birthday',
        eventDate: client.birthday,
        daysUntil,
      });
    }
    
    // Anniversary
    if (client.anniversary) {
      const daysUntil = getDaysUntilDate(client.anniversary);
      events.push({
        clientId: client.id,
        clientName: client.fullName,
        eventType: 'anniversary',
        eventName: 'Anniversary',
        eventDate: client.anniversary,
        daysUntil,
      });
    }
    
    // Custom Events
    client.customEvents.forEach(customEvent => {
      const daysUntil = getDaysUntilDate(customEvent.date);
      events.push({
        clientId: client.id,
        clientName: client.fullName,
        eventType: 'custom',
        eventName: customEvent.name,
        eventDate: customEvent.date,
        daysUntil,
      });
    });
  });
  
  // Sort by days until event
  return events.sort((a, b) => a.daysUntil - b.daysUntil);
};

export const getTomorrowEvents = (events: UpcomingEvent[]): UpcomingEvent[] => {
  return events.filter(event => event.daysUntil === 1);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getEventEmoji = (eventType: UpcomingEvent['eventType']): string => {
  switch (eventType) {
    case 'birthday':
      return '🎉';
    case 'anniversary':
      return '💑';
    case 'custom':
      return '📅';
    default:
      return '📌';
  }
};
