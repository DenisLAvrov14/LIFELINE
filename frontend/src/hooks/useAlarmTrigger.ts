import { useEffect, useState } from 'react';

export const useAlarmTrigger = (
  alarmTime: string | null,
  hasTimer: boolean,
  description: string
) => {
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);

  useEffect(() => {
    if (!alarmTime || !hasTimer) return;

    const alarmTimestamp = new Date(alarmTime).getTime();
    const now = Date.now();

    if (now >= alarmTimestamp) {
      trigger();
      return;
    }

    const timeout = setTimeout(() => trigger(), alarmTimestamp - now);
    return () => clearTimeout(timeout);
  }, [alarmTime, hasTimer]);

  const trigger = () => {
    setIsAlarmTriggered(true);
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('⏰ Task reminder', {
          body: `It's time to start: "${description}"`,
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('⏰ Task reminder', {
              body: `It's time to start: "${description}"`,
            });
          }
        });
      }
    }
  };

  return isAlarmTriggered;
};
