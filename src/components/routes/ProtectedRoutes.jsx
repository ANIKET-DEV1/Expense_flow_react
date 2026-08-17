import React from 'react'
import {useAuth} from '../../context/authcontext'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return <div className="loading-spinner">Verifying session...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes