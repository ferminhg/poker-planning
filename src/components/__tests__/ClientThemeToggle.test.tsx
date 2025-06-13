import { render, screen } from '@testing-library/react';
import * as React from 'react';
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
    // Mock useState to return false for mounted state and a no-op setter
    const mockSetMounted = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementationOnce(() => [false, mockSetMounted]);
    
    // Mock useEffect to prevent the mounted state from changing
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementationOnce(() => {}); // Prevent useEffect from running
    
    render(<ClientThemeToggle />);
    
    // Should show placeholder initially
    expect(screen.queryByTestId('theme-toggle')).not.toBeInTheDocument();
    
    // Look for the placeholder by its distinctive classes
    const placeholder = document.querySelector('.p-3.rounded-lg.border.border-gray-300.bg-white');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass('flex', 'items-center', 'gap-2');
    
    // Should have animated elements
    const animatedElements = placeholder?.querySelectorAll('.animate-pulse');
    expect(animatedElements).toHaveLength(2);
    
    useStateSpy.mockRestore();
    useEffectSpy.mockRestore();
  });

  it('renders ThemeToggle after mounting', async () => {
    render(<ClientThemeToggle />);
    
    // Wait for component to mount and render ThemeToggle
    const themeToggle = await screen.findByTestId('theme-toggle');
    expect(themeToggle).toBeInTheDocument();
  });

  it('placeholder has correct dimensions to match ThemeToggle', () => {
    // Mock useState to return false for mounted state initially
    const mockSetMounted = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementationOnce(() => [false, mockSetMounted]);
    
    // Mock useEffect to prevent the mounted state from changing
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementationOnce(() => {}); // Prevent useEffect from running
    
    render(<ClientThemeToggle />);
    
    const placeholder = document.querySelector('.p-3.rounded-lg.border.border-gray-300.bg-white');
    expect(placeholder).toHaveClass('flex', 'items-center', 'gap-2');
    
    // Check placeholder elements have correct dimensions
    const iconPlaceholder = placeholder?.querySelector('.w-4.h-4');
    const textPlaceholder = placeholder?.querySelector('.w-8.h-4');
    
    expect(iconPlaceholder).toBeInTheDocument();
    expect(textPlaceholder).toBeInTheDocument();
    
    useStateSpy.mockRestore();
    useEffectSpy.mockRestore();
  });
});