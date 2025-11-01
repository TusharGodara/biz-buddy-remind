import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isNotificationEnabled } from '@/lib/notifications';

const NotificationStatusInfo = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show info if notifications are enabled
    const enabled = isNotificationEnabled();
    if (enabled) {
      setShow(true);
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => setShow(false), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="container mx-auto px-4 pt-4 max-w-2xl">
      <Alert className="bg-primary/5 border-primary/20">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <strong>Notifications enabled!</strong> Keep this tab open to receive device alerts for upcoming events. 
          Notifications are checked every hour automatically.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NotificationStatusInfo;
