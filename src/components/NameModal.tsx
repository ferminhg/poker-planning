'use client';

interface NameModalProps {
  isOpen: boolean;
  tempName: string;
  userName?: string;
  onTempNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function NameModal({ 
  isOpen, 
  tempName, 
  userName, 
  onTempNameChange, 
  onSave, 
  onCancel 
}: NameModalProps) {
  if (!isOpen) return null;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-8 w-full max-w-md mx-4 shadow-lg dark:shadow-black/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">Enter your name</h2>
        <input
          type="text"
          value={tempName}
          onChange={(e) => onTempNameChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Your name"
          className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:border-blue-500 outline-none mb-4"
          autoFocus
        />
        <div className="flex gap-3">
          <button
            onClick={onSave}
            disabled={!tempName.trim()}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Save
          </button>
          {userName && (
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}