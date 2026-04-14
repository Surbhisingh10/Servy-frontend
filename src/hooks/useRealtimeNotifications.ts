'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface RealtimeNotificationHandlers {
  onNewNotification?: (payload: any) => void;
  onNotificationUpdated?: (payload: any) => void;
}

export function useRealtimeNotifications({
  onNewNotification,
  onNotificationUpdated,
}: RealtimeNotificationHandlers) {
  useEffect(() => {
    const token = api.getAuthToken();
    if (!token) return;

    const baseUrl = API_URL.replace(/\/api\/v1\/?$/, '');
    const socket: Socket = io(`${baseUrl}/notifications`, {
      auth: { token },
      transports: ['websocket'],
    });

    if (onNewNotification) {
      socket.on('notifications:new', onNewNotification);
    }

    if (onNotificationUpdated) {
      socket.on('notifications:update', onNotificationUpdated);
    }

    return () => {
      if (onNewNotification) {
        socket.off('notifications:new', onNewNotification);
      }
      if (onNotificationUpdated) {
        socket.off('notifications:update', onNotificationUpdated);
      }
      socket.disconnect();
    };
  }, [onNewNotification, onNotificationUpdated]);
}
