import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  // In development mode, also show the error boundary UI but log the error
  if (import.meta.env.DEV) {
    console.error('ErrorBoundary caught an error:', error);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Runtime Error</AlertTitle>
          <AlertDescription>
            Something unexpected happened while running the application. The error details are shown below.
          </AlertDescription>
        </Alert>
        
        <div className="bg-slate-800 border border-red-500 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-sm text-red-400 mb-2">Error Details:</h3>
          <pre className="text-xs text-red-300 bg-slate-900 p-3 rounded border overflow-auto max-h-32">
            {error.message}
          </pre>
        </div>
        
        <Button 
          onClick={resetErrorBoundary} 
          className="w-full bg-slate-700 hover:bg-slate-600"
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};
