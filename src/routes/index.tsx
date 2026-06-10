import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { ChangePasswordPage } from '../pages/ChangePasswordPage';
import { RouteErrorPage } from '../pages/RouteErrorPage';
import RoleRoute from '../auth/RoleRoute';

import UserDashboardPage from '../pages/UserDashboardPage';
import PendingRequestsPage from '../pages/PendingRequestsPage';
import AllRequestsPage from '../pages/AllRequestsPage';
import UsersPage from '../pages/UsersPage';
import FirewallRulesPage from '../pages/FirewallRulesPage';
import RequestDetailPage from '../pages/RequestDetailPage';
import RootRedirect from '../auth/RootRedirect';

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
            element: (
              <RoleRoute allowedRoles={['USER']}>
                <UserDashboardPage />
              </RoleRoute>
            ),
          },
          {
            path: '/admin/pending',
            element: (
              <RoleRoute allowedRoles={['ADMIN']}>
                <PendingRequestsPage />
              </RoleRoute>
            ),
          },
          {
            path: '/admin/requests',
            element: (
              <RoleRoute allowedRoles={['ADMIN']}>
                <AllRequestsPage />
              </RoleRoute>
            ),
          },
          {
            path: '/admin/users',
            element: (
              <RoleRoute allowedRoles={['ADMIN']}>
                <UsersPage />
              </RoleRoute>
            ),
          },
          {
            path: '/admin/firewall',
            element: (
              <RoleRoute allowedRoles={['ADMIN']}>
                <FirewallRulesPage />
              </RoleRoute>
            ),
          },
          {
            path: '/requests/:requestId',
            element: <RequestDetailPage />,
          },
          {
            path: '/',
            element: <RootRedirect />,
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

