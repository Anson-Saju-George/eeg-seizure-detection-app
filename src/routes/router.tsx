import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { ResearchPage } from "@/pages/ResearchPage";
import { SimulatorPage } from "@/pages/SimulatorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "simulator", element: <SimulatorPage /> },
      { path: "research", element: <ResearchPage /> },
    ],
  },
]);
