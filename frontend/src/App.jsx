import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Translations from './pages/translations/Translations';
import Profile from './pages/profile/Profile';
import Documentation from './pages/Documentation';
import Home from './pages/Home';
import useAuthStore from './stores/authStore';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuthStore();
    const location = useLocation();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

const App = () => {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/translations"
                    element={
                        <PrivateRoute>
                            <Translations />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/documentation"
                    element={
                        <PrivateRoute>
                            <Documentation />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/translations" replace />} />
            </Routes>
        </div>
    );
};

export default App;
