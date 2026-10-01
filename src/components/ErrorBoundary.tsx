import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (Component as any) {
  public state: State = {
    hasError: false,
    error: null,
  };
  public declare props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught app error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mb-4 text-3xl">
            ⚠️
          </div>
          <h1 className="text-xl font-bold mb-2">পেজ লোড হতে সাময়িক সমস্যা হয়েছে</h1>
          <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
            একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। দয়া করে পেজটি রিফ্রেশ করুন অথবা পুনরায় চেষ্টা করুন।
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
            >
              🔄 পুনরায় লোড করুন (Reload)
            </button>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
            >
              ক্লিয়ার ক্যাশ (Clear Cache)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
