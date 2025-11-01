export const openWhatsApp = (phoneNumber: string, message?: string): void => {
  // Remove all non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  const encodedMessage = message ? encodeURIComponent(message) : '';
  const url = `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ''}`;
  
  window.open(url, '_blank');
};

export const generateReminderMessage = (clientName: string, eventName: string): string => {
  return `Hi ${clientName}! Just wanted to wish you a wonderful ${eventName}! 🎉`;
};
