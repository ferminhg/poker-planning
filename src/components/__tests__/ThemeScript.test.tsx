import { render } from '@testing-library/react';
import ThemeScript from '../ThemeScript';

describe('ThemeScript', () => {
  let mockLocalStorage: { [key: string]: string };
  let mockClassListAdd: jest.SpyInstance;
  let mockClassListRemove: jest.SpyInstance;
  let mockMatchMedia: jest.Mock;
  let mockSetTimeout: jest.Mock;
  let mockClearTimeout: jest.Mock;
  let mockAddEventListener: jest.Mock;
  let mockRemoveEventListener: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock localStorage
    mockLocalStorage = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => mockLocalStorage[key] || null),
        setItem: jest.fn((key, value) => { mockLocalStorage[key] = value; }),
      },
      configurable: true,
    });

    // Spy on document.documentElement.classList methods
    mockClassListAdd = jest.spyOn(document.documentElement.classList, 'add');
    mockClassListRemove = jest.spyOn(document.documentElement.classList, 'remove');

    // Mock window.matchMedia
    mockMatchMedia = jest.fn();
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      configurable: true,
    });

    // Mock timers - create fresh mocks each time
    mockSetTimeout = jest.fn((fn) => {
      fn(); // Execute immediately for testing
      return 123; // Mock timer ID
    });
    mockClearTimeout = jest.fn();
    global.setTimeout = mockSetTimeout;
    global.clearTimeout = mockClearTimeout;

    // Mock event listeners - create fresh mocks each time
    mockAddEventListener = jest.fn();
    mockRemoveEventListener = jest.fn();
    window.addEventListener = mockAddEventListener;
    window.removeEventListener = mockRemoveEventListener;

    // Mock console.log
    global.console.log = jest.fn();
  });

  afterEach(() => {
    // Restore spies
    mockClassListAdd.mockRestore();
    mockClassListRemove.mockRestore();
  });

  it('renders nothing (returns null)', () => {
    mockMatchMedia.mockReturnValue({ matches: false });
    
    const { container } = render(<ThemeScript />);
    
    expect(container.firstChild).toBeNull();
  });

  it('applies dark theme when localStorage has dark theme', () => {
    mockLocalStorage['theme'] = 'dark';
    mockMatchMedia.mockReturnValue({ matches: false });
    
    render(<ThemeScript />);
    
    expect(mockClassListAdd).toHaveBeenCalledWith('dark');
    expect(mockClassListRemove).not.toHaveBeenCalled();
  });

  it('applies light theme when localStorage has light theme', () => {
    mockLocalStorage['theme'] = 'light';
    mockMatchMedia.mockReturnValue({ matches: true }); // User prefers dark but localStorage says light
    
    render(<ThemeScript />);
    
    expect(mockClassListRemove).toHaveBeenCalledWith('dark');
    expect(mockClassListAdd).not.toHaveBeenCalled();
  });

  it('applies dark theme based on system preference when no localStorage', () => {
    // Explicitly mock getItem to return null for theme
    window.localStorage.getItem = jest.fn((key) => {
      if (key === 'theme') return null;
      return mockLocalStorage[key] || null;
    });
    mockMatchMedia.mockReturnValue({ matches: true });
    
    render(<ThemeScript />);
    
    expect(mockClassListAdd).toHaveBeenCalledWith('dark');
  });

  it('applies light theme based on system preference when no localStorage', () => {
    // Explicitly mock getItem to return null for theme
    window.localStorage.getItem = jest.fn((key) => {
      if (key === 'theme') return null;
      return mockLocalStorage[key] || null;
    });
    mockMatchMedia.mockReturnValue({ matches: false });
    
    render(<ThemeScript />);
    
    expect(mockClassListRemove).toHaveBeenCalledWith('dark');
  });

  it('sets up storage event listener', () => {
    mockMatchMedia.mockReturnValue({ matches: false });
    
    render(<ThemeScript />);
    
    expect(mockAddEventListener).toHaveBeenCalledWith('storage', expect.any(Function));
  });

  it('handles storage change events for dark theme', () => {
    mockMatchMedia.mockReturnValue({ matches: false });
    
    render(<ThemeScript />);
    
    const storageHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'storage'
    )?.[1];
    
    expect(storageHandler).toBeDefined();
    
    // Simulate storage change to dark theme
    storageHandler({ key: 'theme', newValue: 'dark' });
    
    expect(mockClassListAdd).toHaveBeenLastCalledWith('dark');
  });

  it('handles storage change events for light theme', () => {
    mockMatchMedia.mockReturnValue({ matches: false });
    
    render(<ThemeScript />);
    
    const storageHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'storage'
    )?.[1];
    
    // Simulate storage change to light theme
    storageHandler({ key: 'theme', newValue: 'light' });
    
    expect(mockClassListRemove).toHaveBeenLastCalledWith('dark');
  });

  it('ignores storage changes for other keys', () => {
    mockMatchMedia.mockReturnValue({ matches: false });
    
    render(<ThemeScript />);
    
    const storageHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'storage'
    )?.[1];
    
    // Clear previous calls
    mockClassListAdd.mockClear();
    mockClassListRemove.mockClear();
    
    // Simulate storage change for different key
    storageHandler({ key: 'other-key', newValue: 'some-value' });
    
    expect(mockClassListAdd).not.toHaveBeenCalled();
    expect(mockClassListRemove).not.toHaveBeenCalled();
  });

  it('handles errors gracefully', () => {
    // Make localStorage throw an error
    window.localStorage.getItem = jest.fn(() => {
      throw new Error('Storage error');
    });
    mockMatchMedia.mockReturnValue({ matches: false });
    
    render(<ThemeScript />);
    
    expect(console.log).toHaveBeenCalledWith('Theme application error:', expect.any(Error));
  });

  it('cleans up event listener and timer on unmount', () => {
    mockMatchMedia.mockReturnValue({ matches: false });
    
    const { unmount } = render(<ThemeScript />);
    
    unmount();
    
    expect(mockClearTimeout).toHaveBeenCalledWith(123);
    expect(mockRemoveEventListener).toHaveBeenCalledWith('storage', expect.any(Function));
  });
});