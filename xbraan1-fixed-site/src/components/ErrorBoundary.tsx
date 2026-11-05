import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** When this value changes (for example the route), the boundary tries again. */
  resetKey?: string;
  fullPage?: boolean;
}

interface State {
  hasError: boolean;
}

/**
 * The fallback deliberately uses plain <a> links and no router hooks, so it still
 * works if the failure happened outside (or because of) the router.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.hasError && prev.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        role="alert"
        className={`${this.props.fullPage ? 'min-h-screen' : 'min-h-[60vh]'} flex items-center justify-center bg-stone-50 dark:bg-neutral-950 px-4`}
      >
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white mb-3">Something went wrong</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Sorry, this page could not be displayed. Please try again, or go back to the home page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-5 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Go to home page
            </a>
          </div>
        </div>
      </div>
    );
  }
}
