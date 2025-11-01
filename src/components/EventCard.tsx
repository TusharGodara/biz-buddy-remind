import { UpcomingEvent } from '@/types/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { getEventEmoji, formatDate } from '@/lib/events';
import { openWhatsApp, generateReminderMessage } from '@/lib/whatsapp';
import { getClientById } from '@/lib/storage';

interface EventCardProps {
  event: UpcomingEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  const emoji = getEventEmoji(event.eventType);
  const dateStr = formatDate(event.eventDate);
  
  const handleMessage = () => {
    const client = getClientById(event.clientId);
    if (client) {
      const message = generateReminderMessage(event.clientName, event.eventName);
      openWhatsApp(client.phoneNumber, message);
    }
  };
  
  const getDaysText = (days: number): string => {
    if (days === 0) return 'Today!';
    if (days === 1) return 'Tomorrow!';
    return `in ${days} days`;
  };
  
  const isUrgent = event.daysUntil <= 1;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl" role="img" aria-label={event.eventType}>
                {emoji}
              </span>
              <h3 className="font-semibold text-foreground truncate">
                {event.clientName}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {event.eventName} • {dateStr}
            </p>
            <p className={`text-sm font-medium ${isUrgent ? 'text-accent' : 'text-primary'}`}>
              {getDaysText(event.daysUntil)}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleMessage}
            className="shrink-0"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
