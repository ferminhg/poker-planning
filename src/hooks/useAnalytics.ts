'use client';

import { track } from '@vercel/analytics';

interface AnalyticsEvents {
  // Room events
  room_created: {
    room_id: string;
  };
  room_joined: {
    room_id: string;
    participant_count: number;
  };
  room_left: {
    room_id: string;
    session_duration: number; // in seconds
  };
  room_shared: {
    room_id: string;
  };

  // Voting events
  vote_cast: {
    room_id: string;
    vote_value: string;
    participant_count: number;
  };
  votes_revealed: {
    room_id: string;
    participant_count: number;
    vote_values: string;
  };
  votes_reset: {
    room_id: string;
    participant_count: number;
  };
  new_round_started: {
    room_id: string;
    participant_count: number;
  };

  // Story events
  story_updated: {
    room_id: string;
    story_length: number;
  };

  // User events
  user_name_changed: {
    room_id: string;
  };

  // Emoji events
  emoji_sent: {
    room_id: string;
    emoji: string;
    participant_count: number;
  };
}

export function useAnalytics() {
  const trackEvent = <T extends keyof AnalyticsEvents>(
    event: T,
    properties: AnalyticsEvents[T]
  ) => {
    try {
      // Only track in production or when explicitly enabled
      if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') {
        track(event, properties);
      } else {
        // Log to console in development for debugging
        console.log(`[Analytics] ${event}:`, properties);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  // Convenience methods for common events
  const trackRoomCreated = (roomId: string) => {
    trackEvent('room_created', { room_id: roomId });
  };

  const trackRoomJoined = (roomId: string, participantCount: number) => {
    trackEvent('room_joined', { 
      room_id: roomId, 
      participant_count: participantCount 
    });
  };

  const trackRoomLeft = (roomId: string, sessionDuration: number) => {
    trackEvent('room_left', { 
      room_id: roomId, 
      session_duration: sessionDuration 
    });
  };

  const trackRoomShared = (roomId: string) => {
    trackEvent('room_shared', { room_id: roomId });
  };

  const trackVoteCast = (roomId: string, voteValue: string, participantCount: number) => {
    trackEvent('vote_cast', { 
      room_id: roomId, 
      vote_value: voteValue, 
      participant_count: participantCount 
    });
  };

  const trackVotesRevealed = (roomId: string, participantCount: number, voteValues: string[]) => {
    trackEvent('votes_revealed', { 
      room_id: roomId, 
      participant_count: participantCount, 
      vote_values: voteValues.join(',') 
    });
  };

  const trackNewRoundStarted = (roomId: string, participantCount: number) => {
    trackEvent('new_round_started', { 
      room_id: roomId, 
      participant_count: participantCount 
    });
  };

  const trackStoryUpdated = (roomId: string, storyLength: number) => {
    trackEvent('story_updated', { 
      room_id: roomId, 
      story_length: storyLength 
    });
  };

  const trackUserNameChanged = (roomId: string) => {
    trackEvent('user_name_changed', { room_id: roomId });
  };

  return {
    trackEvent,
    trackRoomCreated,
    trackRoomJoined,
    trackRoomLeft,
    trackRoomShared,
    trackVoteCast,
    trackVotesRevealed,
    trackNewRoundStarted,
    trackStoryUpdated,
    trackUserNameChanged,
  };
}