import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark";

import App from './App.tsx';
import { ErrorFallback } from './ErrorFallback.tsx';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
);
