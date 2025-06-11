interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function Header({ title = "Planning Poker", subtitle = "Collaborative story point estimation for agile teams", children }: HeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-semibold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600 text-lg">{subtitle}</p>
      {children}
    </div>
  );
}