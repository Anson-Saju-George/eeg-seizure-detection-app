import { createBrowserRouter } from "react-router-dom";

import { RouteErrorBoundary } from "@/components/layout/RouteErrorBoundary";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { ResearchPage } from "@/pages/ResearchPage";
import { SimulatorPage } from "@/pages/SimulatorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "simulator", element: <SimulatorPage /> },
      { path: "research", element: <ResearchPage /> },
    ],
  },
], {
  basename: import.meta.env.BASE_URL,
});
