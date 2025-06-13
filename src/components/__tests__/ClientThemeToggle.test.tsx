import { render, screen } from '@testing-library/react';
import ClientThemeToggle from '../ClientThemeToggle';

// Mock ThemeToggle component
jest.mock('../ThemeToggle', () => {
  return function MockThemeToggle() {
    return <div data-testid="theme-toggle">Theme Toggle</div>;
  };
});

describe('ClientThemeToggle', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders placeholder when not mounted', () => {
    // Mock useState to return false for mounted state initially
    const mockUseState = jest.fn();
    mockUseState.mockReturnValueOnce([false, jest.fn()]); // mounted = false
    jest.spyOn(require('react'), 'useState').mockImplementationOnce(mockUseState);
    
    render(<ClientThemeToggle />);
    
    // Should show placeholder initially - use class selector targeting the specific placeholder
    const placeholder = document.querySelector('.p-3.rounded-lg.border.border-gray-300.bg-white.flex.items-center.gap-2');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass('p-3', 'rounded-lg', 'border', 'border-gray-300', 'bg-white');
    
    // Should have animated elements
    const animatedElements = placeholder?.querySelectorAll('.animate-pulse');
    expect(animatedElements).toHaveLength(2);
  });

  it('renders ThemeToggle after mounting', async () => {
    render(<ClientThemeToggle />);
    
    // Wait for component to mount and render ThemeToggle
    const themeToggle = await screen.findByTestId('theme-toggle');
    expect(themeToggle).toBeInTheDocument();
  });

  it('placeholder has correct dimensions to match ThemeToggle', () => {
    // Mock useState to return false for mounted state initially
    const mockUseState = jest.fn();
    mockUseState.mockReturnValueOnce([false, jest.fn()]); // mounted = false
    jest.spyOn(require('react'), 'useState').mockImplementationOnce(mockUseState);
    
    render(<ClientThemeToggle />);
    
    const placeholder = document.querySelector('.p-3.rounded-lg.border.border-gray-300.bg-white.flex.items-center.gap-2');
    expect(placeholder).toHaveClass('flex', 'items-center', 'gap-2');
    
    // Check placeholder elements have correct dimensions
    const iconPlaceholder = placeholder?.querySelector('.w-4.h-4');
    const textPlaceholder = placeholder?.querySelector('.w-8.h-4');
    
    expect(iconPlaceholder).toBeInTheDocument();
    expect(textPlaceholder).toBeInTheDocument();
  });
});