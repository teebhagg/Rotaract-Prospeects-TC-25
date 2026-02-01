import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CustomerInsights } from "../components/dashboard/customer-insights";
import { MetricsOverview } from "../components/dashboard/metrics-overview";
import { QuickActions } from "../components/dashboard/quick-actions";
import { RevenueBreakdown } from "../components/dashboard/revenue-breakdown";
import { SalesChart } from "../components/dashboard/sales-chart";
// import { RecentTransactions } from "../components/dashboard/recent-transactions";
// import { TopProducts } from "../components/dashboard/top-products";
import { useSession } from "../lib/auth-client";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate({ to: "/auth/signin" });
    }
  }, [session, isPending, navigate]);

  if (isPending || !session) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
      {/* Enhanced Header */}
      <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Rotaract Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor your organization performance and key metrics in real-time
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Main Dashboard Grid */}
      <div className="@container/main space-y-6">
        {/* Top Row - Key Metrics */}
        <MetricsOverview />

        {/* Second Row - Charts in 6-6 columns */}
        <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
          <SalesChart />
          <RevenueBreakdown />
        </div>

        {/* Third Row - Two Column Layout - Commented out for now */}
        {/* <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
          <RecentTransactions />
          <TopProducts />
        </div> */}

        {/* Fourth Row - Member Insights */}
        <CustomerInsights />
      </div>
    </div>
  );
}
