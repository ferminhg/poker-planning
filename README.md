# 🎯 Planning Poker

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com/your-username/poker-planning/actions)

A modern, real-time Planning Poker application designed for agile teams to estimate story points effectively. Built with Next.js, TypeScript, and Tailwind CSS.

![Planning Poker Screenshot](docs/screenshot.png)

## ✨ Features

- **🎲 Fibonacci Sequence**: Uses proven Fibonacci numbers (1, 2, 3, 5, 8, 13...) for accurate story point estimation
- **👁️ Simultaneous Reveal**: All votes are hidden until everyone has voted, preventing anchoring bias
- **🎉 Consensus Celebration**: Confetti animation when your team achieves perfect consensus
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🌓 Dark Mode**: Automatic dark/light theme switching with system preference detection
- **👥 Multi-user Support**: Up to 4 participants per room with real-time synchronization
- **🔗 Easy Sharing**: Share room links instantly with your team
- **⚡ Real-time Updates**: Live synchronization using polling mechanism
- **💾 Persistent Storage**: Redis-backed storage with graceful fallback to in-memory storage
- **📊 Analytics Integration**: Built-in analytics for usage tracking (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/poker-planning.git
   cd poker-planning
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   For development, the app will use in-memory storage. For production, configure Redis/KV variables.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: Enable analytics in development
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Production: Add your Redis/KV credentials
KV_REST_API_URL=https://your-database.upstash.io
KV_REST_API_TOKEN=your_rest_api_token
KV_REST_API_READ_ONLY_TOKEN=your_read_only_token
```

### Storage Options

- **Development**: Uses in-memory storage (no setup required)
- **Production**: Uses Vercel KV (Redis) for persistent storage

## 📖 How to Use

1. **Create a Room**: Click "Start Session" to create a new planning poker room
2. **Share the Link**: Copy and share the room URL with your team (up to 4 participants)
3. **Enter Your Name**: Each participant enters their name when joining
4. **Add Story Details**: Optionally add a story identifier (e.g., "GRY-1234")
5. **Vote**: Select your estimate using the Fibonacci sequence cards
6. **Reveal**: Once everyone has voted, click "Reveal Votes" to see all estimates
7. **Celebrate**: Enjoy the confetti if everyone agrees! 🎉
8. **New Round**: Click "Start New Round" to estimate the next story

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15.3.3, React 19, TypeScript
- **Styling**: Tailwind CSS 4.0
- **Storage**: Vercel KV (Redis) with in-memory fallback
- **Analytics**: Vercel Analytics (optional)
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel (recommended)

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── room/[id]/         # Room pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── __tests__/         # Component tests
│   └── *.tsx             # Component files
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── types/                # TypeScript type definitions
```

### Key Components

- **Room Management**: Real-time room state synchronization
- **Voting System**: Fibonacci sequence voting cards with validation
- **User Management**: Persistent user IDs and session handling
- **Analytics**: Optional usage tracking and metrics
- **Theme System**: Dark/light mode with system preference detection

## 🧪 Testing

Run the test suite:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
3. **Deploy** - Vercel will automatically build and deploy your app

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Run linting: `npm run lint`
7. Commit your changes: `git commit -m 'Add some feature'`
8. Push to the branch: `git push origin feature/your-feature-name`
9. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the original Planning Poker methodology
- Built with amazing open-source tools and libraries
- Thanks to all contributors who help improve this project

## 📞 Support

- 🐛 [Report a Bug](https://github.com/your-username/poker-planning/issues)
- 💡 [Request a Feature](https://github.com/your-username/poker-planning/issues)
- 📖 [Documentation](https://github.com/your-username/poker-planning/wiki)

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

<p align="center">
  Made with ❤️ by the open-source community
</p>