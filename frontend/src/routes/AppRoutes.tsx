import { Navigate, useRoutes } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardPage } from "../pages/DashboardPage";
import { ResourcesPage } from "../pages/ResourcesPage";
import { CreateResourcePage } from "../pages/CreateResourcePage";
import { ResourceCodeBrowser } from "../pages/ResourceCodeBrowser";
import { BookingsPage } from "../pages/BookingsPage";
import { TicketsPage } from "../pages/TicketsPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { CreateTicketPage } from "../pages/tickets/CreateTicketPage";
import { TicketDetailsPage } from "../pages/tickets/TicketDetailsPage";

export function AppRoutes() {
  return useRoutes([
    {
      path: "/login",
      element: <LoginPage />
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: "dashboard", element: <DashboardPage /> },
        { path: "resources", element: <ResourcesPage /> },
        { path: "resources/new", element: <CreateResourcePage /> },
        { path: "resources/codes", element: <ResourceCodeBrowser /> },
        { path: "bookings", element: <BookingsPage /> },
        { path: "tickets", element: <TicketsPage /> },
        { path: "tickets/new", element: <CreateTicketPage /> },
        { path: "tickets/:ticketId", element: <TicketDetailsPage /> },
        { path: "notifications", element: <NotificationsPage /> }
      ]
    },
    {
      path: "*",
      element: <NotFoundPage />
    }
  ]);
}
