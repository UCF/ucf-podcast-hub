import React from "react";
import { Navigate, useLocation } from 'react-router';

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    isAuthenticated,
    children,
    redirectTo = '/login',
}) => {
    const location = useLocation();
    redirectTo += `?next=${location.pathname}`;

    return isAuthenticated ? (
        <>{children}</>
    ) : (
        <Navigate to={redirectTo} replace />
    )
};

export default ProtectedRoute;
