# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a poker planning application built with Next.js, TypeScript, and Tailwind CSS. The app allows teams to collaboratively estimate story points using planning poker methodology.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Technical Notes

- Node.js version 18.18.0+ is required (current version may show warnings)
- Uses Next.js App Router with TypeScript
- Tailwind CSS for styling

## Project Structure

- `src/app/` - Next.js app router pages and layouts
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and shared logic
- `src/types/` - TypeScript type definitions

## Key Features Implemented

- Room creation and joining with unique URLs
- Multi-user support (max 4 participants per room)
- Fibonacci sequence voting cards (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, ?, ☕)
- User management with persistent IDs
- Vote reveal functionality
- Room state synchronization using localStorage and custom events
- Responsive design with GitHub-inspired styling
- Share room functionality

## Architecture

- **Server-side persistence**: Vercel KV (Redis) for room state storage
- **API Routes**: `/api/room/[id]` for CRUD operations on room state
- **Client synchronization**: `useRoomSync` hook with polling (2-second intervals)
- **Optimistic updates**: Immediate UI updates with server sync in background
- **Component-based architecture**: Modular, reusable components
- **Error handling**: Loading states, error boundaries, and retry mechanisms

## Server Sync Flow

1. User action triggers optimistic local update
2. API call to `/api/room/[id]` updates server state
3. Polling mechanism syncs other clients every 2 seconds
4. TTL of 1 hour automatically cleans up inactive rooms

## Analytics Integration

- **Vercel Analytics**: Integrated for tracking user interactions and usage patterns
- **Custom Events**: Tracked events include:
  - `room_created`: When a new room is created
  - `room_joined`: When a user joins a room
  - `room_left`: When a user leaves (includes session duration)
  - `room_shared`: When room link is copied
  - `vote_cast`: When a user votes (includes vote value)
  - `votes_revealed`: When votes are revealed (includes all vote values)
  - `new_round_started`: When a new voting round begins
  - `story_updated`: When the current story is changed
  - `user_name_changed`: When a user changes their name

## Storage Fallback System

- **Production**: Uses Vercel KV (Redis) for persistent storage
- **Development**: Falls back to in-memory storage when KV credentials are not available
- **Error Handling**: Graceful degradation if KV service is unavailable