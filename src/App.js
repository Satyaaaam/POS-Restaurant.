import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthComponent from './pages/AuthComponent';
import ChefComponent from './pages/ChefComponent';
import AdminComponent from './pages/AdminComponent';
import WaiterComponent from './pages/WaiterComponent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { authentication as auth } from './firebase';
import { getMyRole } from './pages/AuthComponent';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'

const PrivateRoute = ({ element, requiredRole }) => {
  const [user, loading, error] = useAuthState(auth);
  const userRole = getMyRole();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Error checking authentication:', error);
    return <div>Error checking authentication</div>;
  }

  if (!user) {
    return <Navigate to="/" replace={true} />;
  }

  const redirectToRolePage = () => {
    // Check if the user's role matches the required role
    if (userRole === requiredRole) {
      switch (requiredRole) {
        case 'admin':
          return '/admin/*'; // Assuming you have wildcard routes for admin
        case 'chef':
          return '/chef/*';
        case 'waiter':
          return '/waiter/*';
        default:
          return '/'; // Redirect to login page if role is not specified or recognized
      }
    } else {
      return '/'; // Redirect to login if user's role does not match
    }
  };

  console.log('Redirecting to:', redirectToRolePage());

  return userRole === requiredRole ? element : <Navigate to="/" replace={true} />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthComponent />} />
      <Route path="/waiter/*" element={<PrivateRoute element={<WaiterComponent />} requiredRole="waiter" />} />
      <Route path="/chef/*" element={<PrivateRoute element={<ChefComponent />} requiredRole="chef" />} />
      <Route path="/admin/*" element={<PrivateRoute element={<AdminComponent />} requiredRole="admin" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
