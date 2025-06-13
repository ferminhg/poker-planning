import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders copyright text with current year', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    const expectedText = `© ${currentYear} Planning Poker. All rights reserved.`;
    
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it('has correct CSS classes for styling', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-gray-50', 'dark:bg-gray-800', 'border-t', 'border-gray-200', 'dark:border-gray-700');
  });
});