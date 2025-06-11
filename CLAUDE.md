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

## Key Features to Implement

- Room creation and joining with unique URLs
- Real-time voting using WebSockets
- Fibonacci sequence voting cards (0, 1, 2, 3, 5, 8, 13, 21, ?, ☕)
- User management and participant display
- Vote reveal functionality
- Responsive design