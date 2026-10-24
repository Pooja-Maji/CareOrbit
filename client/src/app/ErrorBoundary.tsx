import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '../design/ui/Card';
import { Button } from '../design/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4">
          <Card variant="default" padding="lg" className="max-w-md text-center">
            <div className="w-12 h-12 bg-coral-soft rounded-full flex items-center justify-center mx-auto mb-4 text-coral">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-heading font-semibold text-ink mb-2">
              Something unexpected happened
            </h2>
            <p className="text-sm text-ink-muted mb-6">
              Your data remains safe on your device. We can restore you to the home screen smoothly.
            </p>
            <Button variant="primary" fullWidth onClick={this.handleReset}>
              Return to Home
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
