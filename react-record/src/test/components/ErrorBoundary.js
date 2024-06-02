import React, { ErrorBoundary } from 'react';

const ErrorFallback = ({ error }) => <div>Error: {error.message}</div>;

const ErrorBoundaryWrapper = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ErrorBoundary>
);

export default ErrorBoundaryWrapper;