'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface RealtimeSupportRequestHandlers {
  onNewRequest?: (payload: any) => void;
  onResolvedRequest?: (payload: any) => void;
  onUpdatedRequest?: (payload: any) => void;
}

export function useRealtimeSupportRequests({
  onNewRequest,
  onResolvedRequest,
  onUpdatedRequest,
}: RealtimeSupportRequestHandlers) {
  useEffect(() => {
    const token = api.getAuthToken();
    if (!token) return;

    const baseUrl = API_URL.replace(/\/api\/v1\/?$/, '');
    const socket: Socket = io(`${baseUrl}/support-requests`, {
      auth: { token },
      transports: ['websocket'],
    });

    if (onNewRequest) {
      socket.on('support-requests:new', onNewRequest);
    }

    if (onResolvedRequest) {
      socket.on('support-requests:resolved', onResolvedRequest);
    }

    if (onUpdatedRequest) {
      socket.on('support-requests:updated', onUpdatedRequest);
    }

    return () => {
      if (onNewRequest) {
        socket.off('support-requests:new', onNewRequest);
      }
      if (onResolvedRequest) {
        socket.off('support-requests:resolved', onResolvedRequest);
      }
      if (onUpdatedRequest) {
        socket.off('support-requests:updated', onUpdatedRequest);
      }
      socket.disconnect();
    };
  }, [onNewRequest, onResolvedRequest, onUpdatedRequest]);
}
