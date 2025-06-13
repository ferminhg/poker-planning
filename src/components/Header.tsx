import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  showThemeToggle?: boolean;
}

export default function Header({ 
  title = "Planning Poker", 
  subtitle = "Collaborative story point estimation for agile teams", 
  children,
  showThemeToggle = true 
}: HeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-between items-start mb-4">
        <div></div>
        <div className="flex-1">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h1>
        </div>
        {showThemeToggle && (
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-lg">{subtitle}</p>
      {children}
    </div>
  );
}