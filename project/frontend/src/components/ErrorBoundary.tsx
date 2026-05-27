import React from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Optional: redirect to home
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[100svh] bg-bg-surface-1 text-left font-sans flex flex-col items-center justify-center px-4 py-8">
          {/* Top spacing */}
          <div className="flex-1" />

          {/* Error Container */}
          <div className="w-full max-w-md flex flex-col items-center gap-8">
            
            {/* Error Icon */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="w-32 h-32 bg-error-container/20 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-20 h-20 text-error" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              {/* Broken icon */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-error rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              </div>
            </div>

            {/* Error Text */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold text-text-h">Có lỗi xảy ra</h1>
              <p className="text-lg font-semibold text-text-main">Bé Thóc gặp chút vấn đề</p>
              <p className="text-base text-text-main/60 leading-relaxed">
                Ứng dụng gặp phải một lỗi không mong muốn. Chúng tôi sẽ cố gắng khắc phục nó.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="w-full bg-error-light/10 border border-error-main/30 rounded-[16px] p-4 text-left max-h-48 overflow-auto">
                <p className="text-xs font-bold text-error mb-2 uppercase">Chi tiết lỗi (chỉ dành cho phát triển):</p>
                <details className="text-xs text-error-main/80 font-mono whitespace-pre-wrap break-words">
                  <summary className="cursor-pointer font-semibold mb-2">
                    {this.state.error.message}
                  </summary>
                  {this.state.errorInfo?.componentStack && (
                    <div className="mt-2 text-xs opacity-70">
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-primary text-white font-bold text-base py-3 rounded-full shadow-md hover:bg-primary-container hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Thử Lại
              </button>
              <button
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    window.location.href = '/';
                  }
                }}
                className="w-full bg-white border border-border-main/50 text-text-main font-bold text-base py-3 rounded-full shadow-sm hover:bg-bg-surface-1 hover:shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay Lại
              </button>
            </div>

            {/* Support Message */}
            <div className="text-center text-sm text-text-main/60">
              <p>
                Vấn đề vẫn tiếp tục?{' '}
                <a href="/help-support" className="text-primary hover:underline cursor-pointer font-semibold">
                  Liên hệ hỗ trợ
                </a>
              </p>
            </div>
          </div>

          {/* Bottom spacing */}
          <div className="flex-1" />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
