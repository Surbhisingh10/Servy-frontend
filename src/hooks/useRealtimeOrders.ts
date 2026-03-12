'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export function useRealtimeOrders(onMessage: () => void) {
  useEffect(() => {
    const token = api.getAuthToken();
    if (!token) return;

    const baseUrl = API_URL.replace(/\/api\/v1\/?$/, '');
    const socket: Socket = io(`${baseUrl}/orders`, {
      auth: { token },
      transports: ['websocket'],
    });

    const handler = () => onMessage();
    socket.on('orders:new', handler);
    socket.on('orders:update', handler);

    return () => {
      socket.off('orders:new', handler);
      socket.off('orders:update', handler);
      socket.disconnect();
    };
  }, [onMessage]);
}

