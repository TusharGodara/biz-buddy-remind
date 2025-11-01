import { Client } from '@/types/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar, Trash2, Edit } from 'lucide-react';
import { openWhatsApp } from '@/lib/whatsapp';
import { formatDate } from '@/lib/events';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const ClientCard = ({ client, onEdit, onDelete }: ClientCardProps) => {
  const handleWhatsApp = () => {
    openWhatsApp(client.phoneNumber);
  };
  
  const allEvents = [
    ...(client.birthday ? [{ name: 'Birthday 🎉', date: client.birthday }] : []),
    ...(client.anniversary ? [{ name: 'Anniversary 💑', date: client.anniversary }] : []),
    ...client.customEvents.map(e => ({ name: e.name, date: e.date })),
  ];
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{client.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{client.phoneNumber}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(client)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(client.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {allEvents.length > 0 && (
          <div className="space-y-1.5">
            {allEvents.map((event, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground truncate">
                  {event.name}: {formatDate(event.date)}
                </span>
              </div>
            ))}
          </div>
        )}
        <Button
          onClick={handleWhatsApp}
          className="w-full"
          variant="default"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Message on WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
