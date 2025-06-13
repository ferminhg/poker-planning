# Contributing to Planning Poker

Thank you for your interest in contributing to Planning Poker! We welcome contributions from everyone and are grateful for every pull request.

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn package manager
- Git

### Setting Up Your Development Environment

1. **Fork the repository**
   - Click the "Fork" button at the top right of the repository page

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/poker-planning.git
   cd poker-planning
   ```

3. **Add the upstream remote**
   ```bash
   git remote add upstream https://github.com/original-username/poker-planning.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📝 How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use our issue template** to provide necessary information
3. **Include steps to reproduce** the bug
4. **Add screenshots** if applicable

### Suggesting Features

1. **Check existing issues** to see if the feature has been requested
2. **Create a new issue** with the "Feature Request" template
3. **Describe the feature** and its benefits
4. **Provide use cases** and examples

### Submitting Pull Requests

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use our PR template
   - Link any related issues
   - Provide a clear description of the changes

## 🎯 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code is automatically formatted
- **Components**: Use functional components with hooks
- **Naming**: Use descriptive names for variables, functions, and components

### Testing

- **Write tests** for all new features and bug fixes
- **Use React Testing Library** for component tests
- **Aim for good test coverage** but focus on quality over quantity
- **Test user interactions** rather than implementation details

### Documentation

- **Update README.md** if your changes affect setup or usage
- **Add JSDoc comments** for complex functions
- **Update type definitions** when changing interfaces
- **Include examples** in your documentation

### Performance

- **Optimize for mobile** devices and slow connections
- **Use React.memo** for expensive components when appropriate
- **Minimize bundle size** by avoiding unnecessary dependencies
- **Test on different devices** and browsers

## 🏗️ Project Structure

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

## 🐛 Debugging

### Common Issues

1. **Environment variables not loaded**
   - Ensure `.env.local` exists and contains required variables
   - Restart the development server after changes

2. **Tests failing**
   - Run `npm test` to see specific failures
   - Check for missing test dependencies

3. **Build errors**
   - Run `npm run lint` to check for ESLint errors
   - Ensure TypeScript types are correct

### Debugging Tools

- **React Developer Tools**: Browser extension for React debugging
- **Next.js Debugging**: Use `DEBUG=*` for verbose logging
- **Browser DevTools**: Network, Console, and Performance tabs

## 🔄 Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Switch to main branch
git checkout main

# Merge upstream changes
git merge upstream/main

# Push to your fork
git push origin main
```

## 📊 Analytics and Privacy

- **Analytics**: We use Vercel Analytics to track usage patterns
- **Privacy**: No personal information is collected beyond anonymous usage metrics
- **Opt-out**: Analytics can be disabled by removing the environment variable

## 🎨 Design Guidelines

### UI/UX Principles

- **Simplicity**: Keep the interface clean and focused
- **Accessibility**: Follow WCAG guidelines for accessibility
- **Responsive**: Design for mobile-first, then desktop
- **Consistency**: Use existing patterns and components

### Color Scheme

- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Gray scale**: Various shades for text and backgrounds

## 🏆 Recognition

Contributors will be:
- **Listed in README.md** contributors section
- **Credited in release notes** for significant contributions
- **Given appropriate GitHub repository permissions** for regular contributors

## ❓ Questions?

- **Create an issue** for questions about contributing
- **Check existing issues** for similar questions
- **Review documentation** in the repository

## 📋 Checklist for Contributors

Before submitting a PR, ensure:

- [ ] Code follows the existing style guidelines
- [ ] Tests pass locally (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation is updated (if needed)
- [ ] Commit messages follow conventional format
- [ ] PR description clearly explains the changes
- [ ] Related issues are linked

Thank you for contributing to Planning Poker! 🎉