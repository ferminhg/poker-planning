interface StoryInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StoryInput({ value, onChange }: StoryInputProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Current Story</h2>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. GRY-1234"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Enter ticket format: GRY-XYZ</p>
    </div>
  );
}