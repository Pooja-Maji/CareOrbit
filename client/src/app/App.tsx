import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../lib/store';
import { ErrorBoundary } from './ErrorBoundary';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </StoreProvider>
    </ErrorBoundary>
  );
};

export default App;
