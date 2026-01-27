import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });

        // You could also log to an error reporting service here
        // logErrorToService(error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            حدث خطأ غير متوقع
                        </h1>
                        <p className="text-gray-600 mb-6">
                            نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
                        </p>

                        {import.meta.env.DEV && this.state.error && (
                            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left overflow-x-auto">
                                <p className="text-sm font-mono text-red-600">
                                    {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReload}
                                className="flex items-center gap-2 px-4 py-2 bg-[#024C3F] text-white rounded-lg hover:bg-[#036B57] transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                إعادة المحاولة
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                الصفحة الرئيسية
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
