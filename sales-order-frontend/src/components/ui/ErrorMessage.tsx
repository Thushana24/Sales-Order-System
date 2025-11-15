interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({
  title = "Error",
  message,
  onRetry,
}: ErrorMessageProps) => {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <div className="flex items-start">
        <svg
          className="mt-0.5 mr-3 h-6 w-6 text-red-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <h3 className="text-lg font-semibold text-red-800">{title}</h3>
          <p className="mt-1 text-red-600">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
