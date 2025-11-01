import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';
import { requestNotificationPermission, canRequestNotification, isNotificationEnabled } from '@/lib/notifications';
import { toast } from 'sonner';

const NotificationPermissionBanner = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if we should show the banner
    const shouldShow = canRequestNotification() && !isNotificationEnabled();
    const wasDismissed = localStorage.getItem('notification-banner-dismissed') === 'true';
    
    if (shouldShow && !wasDismissed) {
      // Show banner after a short delay
      setTimeout(() => setShow(true), 2000);
    }
  }, []);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      toast.success('Notifications enabled! You\'ll get alerts for upcoming events.');
      setShow(false);
    } else {
      toast.error('Notification permission denied. You can enable it in your browser settings.');
      setShow(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('notification-banner-dismissed', 'true');
    setDismissed(true);
    setShow(false);
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-card border border-border rounded-lg shadow-lg p-4 z-40 animate-in slide-in-from-bottom duration-300">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1">Enable Event Reminders</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Get notified about upcoming birthdays, anniversaries, and custom events
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleEnable} className="flex-1">
              Enable Notifications
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionBanner;
