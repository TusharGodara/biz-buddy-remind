import { UpcomingEvent } from '@/types/client';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showEventNotification = (event: UpcomingEvent): void => {
  if (Notification.permission !== 'granted') {
    return;
  }

  const getEventEmoji = (eventType: UpcomingEvent['eventType']): string => {
    switch (eventType) {
      case 'birthday':
        return '🎉';
      case 'anniversary':
        return '💑';
      case 'custom':
        return '📅';
      default:
        return '🔔';
    }
  };

  const emoji = getEventEmoji(event.eventType);
  const title = `${emoji} Reminder: ${event.clientName}`;
  const body = event.daysUntil === 0 
    ? `Today is ${event.clientName}'s ${event.eventName}!`
    : `Tomorrow is ${event.clientName}'s ${event.eventName}!`;

  const notification = new Notification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `event-${event.clientId}-${event.eventType}`,
    requireInteraction: false,
    silent: false,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};

export const checkAndNotifyUpcomingEvents = (events: UpcomingEvent[]): void => {
  // Notify for events happening today or tomorrow
  const urgentEvents = events.filter(event => event.daysUntil <= 1);
  
  urgentEvents.forEach(event => {
    showEventNotification(event);
  });
};

export const isNotificationEnabled = (): boolean => {
  return Notification.permission === 'granted';
};

export const canRequestNotification = (): boolean => {
  return 'Notification' in window && Notification.permission !== 'denied';
};
