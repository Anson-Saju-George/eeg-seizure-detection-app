import { AlertTriangle, RefreshCcw } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RouteErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unexpected application error.";

  return (
    <div className="monitor-grid min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border-[rgba(255,107,122,0.28)]">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(255,107,122,0.14)]">
              <AlertTriangle className="h-6 w-6 text-[var(--danger)]" />
            </div>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[var(--muted-foreground)]">{message}</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Research/demo simulator only. Reload the page or navigate back to continue.
            </p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCcw className="h-4 w-4" />
              Reload
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
