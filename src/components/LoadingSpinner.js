// src/components/LoadingSpinner.js
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        {/* Loading Spinner */}
        <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
