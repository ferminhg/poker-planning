'use client';

import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ShareRoomProps {
  roomId: string;
}

export default function ShareRoom({ roomId }: ShareRoomProps) {
  const [copied, setCopied] = useState(false);
  const { trackRoomShared } = useAnalytics();
  
  const roomUrl = typeof window !== 'undefined' ? `${window.location.origin}/room/${roomId}` : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      trackRoomShared(roomId);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Invite Others</h3>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={roomUrl}
          readOnly
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white font-mono"
        />
        <button
          onClick={copyToClipboard}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-2">
        Share this link with your team (max 4 participants)
      </p>
    </div>
  );
}