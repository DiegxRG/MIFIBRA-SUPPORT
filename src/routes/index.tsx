import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { WhitelistPage } from '../pages/WhitelistPage';
import { RouteErrorPage } from '../pages/RouteErrorPage';
import { BlacklistPage } from '../pages/BlacklistPage';
import { ChangePasswordPage } from '../pages/ChangePasswordPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: '/change-password',
        element: <ChangePasswordPage />,
      },
      {
        element: <AppLayout />,
        errorElement: <RouteErrorPage />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/whitelist',
            element: <WhitelistPage />,
          },
          {
            path: '/blacklist',
            element: <BlacklistPage />,
          },
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
