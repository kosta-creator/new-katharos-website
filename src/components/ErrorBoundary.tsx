'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#C9A84C] mb-4">Something went wrong</h1>
            <p className="text-[#C4BEB5] mb-6">The temple spirits are restless. Please refresh.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#E8913A] text-[#050508] font-bold rounded hover:bg-[#C9A84C] transition-colors"
            >
              Re-enter the Temple
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
