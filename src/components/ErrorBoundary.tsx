 
import React from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { WarningCircle, X, ArrowsClockwise, CaretLeft } from '@phosphor-icons/react';

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
                <WarningCircle size={80} weight="duotone" className="text-error" />
              </div>
              {/* Broken icon */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-error rounded-full flex items-center justify-center shadow-md">
                <X size={20} weight="bold" className="text-white" />
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
            {import.meta.env.DEV && this.state.error ? (<div className="w-full bg-error-light/10 border border-error-main/30 rounded-[16px] p-4 text-left max-h-48 overflow-auto">
              <p className="text-xs font-bold text-error mb-2 uppercase">Chi tiết lỗi (chỉ dành cho phát triển):</p>
              <details className="text-xs text-error-main/80 font-mono whitespace-pre-wrap break-words">
                <summary className="cursor-pointer font-semibold mb-2">
                  {this.state.error.message}
                </summary>
                {this.state.errorInfo?.componentStack ? (<div className="mt-2 text-xs opacity-70">
                  {this.state.errorInfo.componentStack}
                </div>) : null}
              </details>
            </div>) : null}

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="btn btn--cyan active:scale-95 rounded-full w-full py-3 flex items-center justify-center gap-2"
              >
                <ArrowsClockwise size={20} weight="bold" />
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
                className="btn btn--outline active:scale-95 rounded-full w-full py-3 flex items-center justify-center gap-2"
              >
                <CaretLeft size={20} weight="bold" />
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
