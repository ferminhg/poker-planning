export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 py-6">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          © {new Date().getFullYear()} Planning Poker. All rights reserved.
        </p>
      </div>
    </footer>
  );
}