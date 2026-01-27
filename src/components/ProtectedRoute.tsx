import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type UserRole = 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: UserRole | UserRole[];
    redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication and/or specific roles.
 * Redirects unauthenticated users to login.
 * Redirects authenticated users without proper role to their appropriate dashboard.
 */
export function ProtectedRoute({
    children,
    requiredRole,
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const location = useLocation();

    // Check for auth token
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    // No token = not authenticated
    if (!token) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // No user data = invalid state, redirect to login
    if (!userStr) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    let user: { role?: UserRole };
    try {
        user = JSON.parse(userStr);
    } catch {
        // Invalid user data, clear and redirect
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // If specific role(s) required, check if user has permission
    if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const userRole = user.role;

        if (!userRole || !roles.includes(userRole)) {
            // Redirect to appropriate dashboard based on role
            const dashboardMap: Record<UserRole, string> = {
                ADMIN: '/admin',
                TEACHER: '/teacher-dashboard',
                PARENT: '/student-dashboard',
                STUDENT: '/student-dashboard',
            };

            const targetDashboard = userRole ? dashboardMap[userRole] : '/login';
            return <Navigate to={targetDashboard} replace />;
        }
    }

    // Authenticated and authorized
    return <>{children}</>;
}

/**
 * PublicOnlyRoute Component
 * 
 * For routes that should only be accessible to unauthenticated users.
 * Redirects authenticated users to their dashboard.
 */
export function PublicOnlyRoute({ children }: { children: ReactNode }) {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);
            const dashboardMap: Record<UserRole, string> = {
                ADMIN: '/admin',
                TEACHER: '/teacher-dashboard',
                PARENT: '/student-dashboard',
                STUDENT: '/student-dashboard',
            };

            const targetDashboard = user.role ? dashboardMap[user.role as UserRole] : '/student-dashboard';
            return <Navigate to={targetDashboard} replace />;
        } catch {
            // Invalid user data, allow access to public route
        }
    }

    return <>{children}</>;
}

export default ProtectedRoute;
