import { render, screen } from '@testing-library/react';
import Features from '../Features';

describe('Features', () => {
  it('renders the main heading and description', () => {
    render(<Features />);
    
    expect(screen.getByText('Everything You Need for Effective Planning')).toBeInTheDocument();
    expect(screen.getByText(/Streamline your agile estimation process/)).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<Features />);
    
    const expectedFeatures = [
      'Fibonacci Sequence',
      'Simultaneous Reveal',
      'Easy Sharing',
      'Emoji Reactions',
      'Reset & Revote',
      'Consensus Celebration'
    ];
    
    expectedFeatures.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('renders feature descriptions', () => {
    render(<Features />);
    
    expect(screen.getByText(/Use proven Fibonacci numbers/)).toBeInTheDocument();
    expect(screen.getByText(/All votes are hidden until everyone/)).toBeInTheDocument();
    expect(screen.getByText(/Share room links instantly/)).toBeInTheDocument();
    expect(screen.getByText(/Send fun emoji reactions/)).toBeInTheDocument();
    expect(screen.getByText(/Easily reset votes or start new rounds/)).toBeInTheDocument();
    expect(screen.getByText(/When your team achieves perfect consensus/)).toBeInTheDocument();
  });

  it('has correct section id for navigation', () => {
    render(<Features />);
    
    // The id is on the outermost div, not the parent of the heading
    const section = document.getElementById('features');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'features');
  });

  it('applies correct CSS classes for styling', () => {
    render(<Features />);
    
    // The classes are on the outermost div with id="features"
    const mainSection = document.getElementById('features');
    expect(mainSection).toHaveClass('py-20', 'px-4', 'bg-gray-50');
  });

  it('renders feature cards in a grid layout', () => {
    render(<Features />);
    
    const gridContainer = screen.getByText('Fibonacci Sequence').closest('div')?.parentElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('renders SVG icons for each feature', () => {
    render(<Features />);
    
    // Check that SVG elements are present
    const svgElements = screen.getByText('Everything You Need for Effective Planning')
      .closest('div')
      ?.parentElement
      ?.querySelectorAll('svg');
    
    expect(svgElements).toHaveLength(6); // One for each feature
  });
});