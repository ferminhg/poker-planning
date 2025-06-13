import ClientThemeToggle from './ClientThemeToggle';
import ShareButton from './ShareButton';

interface HeaderActionsProps {
  onShareRoom?: () => void;
}

export default function HeaderActions({ onShareRoom }: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <ClientThemeToggle />
      {onShareRoom && <ShareButton onShare={onShareRoom} />}
    </div>
  );
}