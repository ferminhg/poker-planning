interface UserInfoProps {
  userName: string;
  onChangeName: () => void;
}

export default function UserInfo({ userName, onChangeName }: UserInfoProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-md px-3 py-1">
      <span className="text-sm text-gray-600 dark:text-gray-300">You are:</span>
      <span className="font-medium text-gray-800 dark:text-gray-200">{userName}</span>
      <button
        onClick={onChangeName}
        className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm hover:underline"
      >
        Change
      </button>
    </div>
  );
}