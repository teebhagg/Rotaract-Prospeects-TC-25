import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Filter,
  LayoutGrid,
  List,
  Search,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { cn } from "../lib/utils";
import { getAttendanceMatrixPageData } from "../server-fns/attendance";

export const Route = createFileRoute("/attendance")({
  loader: async () => getAttendanceMatrixPageData(),
  component: Attendance,
});

function Attendance() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("matrix");

  const { matrix, records, stats, insights } = Route.useLoaderData();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;
    return records.filter(
      (record) =>
        record.member.toLowerCase().includes(query) ||
        record.meeting.toLowerCase().includes(query),
    );
  }, [records, search]);

  const matrixVisibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return matrix.rows;
    return matrix.rows.filter((row) =>
      row.name.toLowerCase().includes(query),
    );
  }, [matrix.rows, search]);

  const activeAvg = insights.activeCohortAvgSessions ?? 0;
  const cohortSessionsDisplay = stats.totalSessions
    ? `${activeAvg.toFixed(1)}/${stats.totalSessions}`
    : `${activeAvg.toFixed(1)} sessions`;
  const activeCohortYearLabel = insights.activeCohortYear ?? "recent";
  const retentionSessions = stats.retentionWindow ?? 0;
  const attendanceRateText = (stats.attendanceRate ?? 0).toFixed(1);
  const improvementMessage = insights.topSessionTitle
    ? `The "${insights.topSessionTitle}" sessions have the highest engagement at ${insights.topSessionRate ?? 0}%.`
    : "No sessions in the 30-day window yet.";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "Absent":
        return <XCircle className="h-4 w-4 text-rose-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border border-slate-200" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-emerald-50 border-emerald-100 text-emerald-700";
      case "Absent":
        return "bg-rose-50 border-rose-100 text-rose-700";
      default:
        return "bg-slate-50 border-slate-100 text-slate-400";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Attendance Matrix
          </h2>
          <p className="text-muted-foreground italic">
            Track organization participation and engagement patterns.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden md:flex shadow-sm">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Take Attendance
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-none shadow-sm bg-indigo-50/50 dark:bg-indigo-950/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <TrendingUp className="h-3 w-3" /> Avg Attendance
            </CardDescription>
            <CardTitle className="text-3xl font-bold font-mono text-indigo-900 dark:text-indigo-100">
              {attendanceRateText}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-indigo-600/60 dark:text-indigo-400/60 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />{" "}
              {stats.presentCount ?? 0} present / {stats.totalPossible ?? 0} possible (last 30 days)
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <UserCheck className="h-3 w-3" /> Consistent
            </CardDescription>
            <CardTitle className="text-3xl font-bold font-mono text-emerald-900 dark:text-emerald-100">
              {stats.consistentMembers ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-emerald-600/60 dark:text-emerald-400/60 flex items-center gap-1">
              Members with 100% attendance in the period
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm border-none bg-slate-50/80 dark:bg-slate-900/40 backdrop-blur-sm px-6 py-4 flex items-center">
          <div className="flex-1 space-y-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-primary" /> Filter Matrix
            </h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members or sessions..."
                  className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Tabs
        defaultValue="matrix"
        className="w-full"
        onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-slate-100/80 dark:bg-slate-800/80 p-1">
            <TabsTrigger
              value="matrix"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 shadow-sm transition-all flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" /> Matrix View
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 shadow-sm transition-all flex items-center gap-2">
              <List className="h-4 w-4" /> Session Logs
            </TabsTrigger>
          </TabsList>

          <div className="text-xs text-muted-foreground hidden sm:block">
            Showing{" "}
            {activeTab === "matrix"
              ? matrixVisibleRows.length
              : filtered.length}{" "}
            records
          </div>
        </div>

        <TabsContent
          value="matrix"
          className="mt-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden bg-white dark:bg-slate-950">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80">
                  <TableRow>
                    <TableHead className="w-[180px] font-bold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800 sticky left-0 bg-slate-50/80 dark:bg-slate-900/80 z-20 backdrop-blur-md">
                      Member Name
                    </TableHead>
                    <TableHead className="w-[80px] text-center font-bold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800 sticky left-[180px] bg-slate-50/80 dark:bg-slate-900/80 z-20 backdrop-blur-md">
                      %
                    </TableHead>
                    {matrix.meetings.map((session) => (
                      <TableHead
                        key={session.id}
                        className="min-w-[120px] text-center p-4 group">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] uppercase tracking-tighter text-muted-foreground group-hover:text-primary transition-colors">
                            {session.date}
                          </span>
                          <span className="text-xs font-bold leading-tight">
                            {session.name}
                          </span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matrixVisibleRows.map((row) => (
                    <TableRow
                      key={row.name}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <TableCell className="font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800 sticky left-0 bg-white dark:bg-slate-950 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-900/50 z-10 transition-colors">
                        {row.name}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs font-bold border-r border-slate-100 dark:border-slate-800 sticky left-[180px] bg-white dark:bg-slate-950 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-900/50 z-10 transition-colors">
                        {row.rate}%
                      </TableCell>
                      {matrix.meetings.map((session) => {
                        const status = row.records[session.id] ?? "Absent";
                        return (
                          <TableCell key={session.id} className="p-0 text-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="w-full h-12 flex items-center justify-center cursor-help group/cell relative">
                                    <div
                                      className={cn(
                                        "size-7 rounded-lg flex items-center justify-center border transition-all duration-200 group-hover/cell:scale-110 shadow-sm",
                                        getStatusColor(status),
                                      )}>
                                      {getStatusIcon(status)}
                                    </div>
                                    {status === "Present" && (
                                      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-bold">
                                      {row.name}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {session.name} ({session.date})
                                    </span>
                                    <span
                                      className={cn(
                                        "mt-1 font-semibold",
                                        status === "Present"
                                          ? "text-emerald-400"
                                          : "text-rose-400",
                                      )}>
                                      {status}
                                    </span>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent
          value="list"
          className="mt-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-950">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80">
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Meeting Session</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right whitespace-nowrap">
                      Verification
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((record) => (
                    <TableRow
                      key={record.id}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <TableCell className="font-semibold text-slate-700 dark:text-slate-300">
                        {record.member}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {record.meeting}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {record.date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "border",
                            getStatusColor(record.status),
                          )}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 pr-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 opacity-20 group-hover:opacity-100 cursor-pointer transition-all hover:scale-125" />
                          <XCircle className="h-4 w-4 text-rose-400 opacity-20 group-hover:opacity-100 cursor-pointer transition-all hover:scale-125" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-slate-50 dark:bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Improvement
              Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground leading-relaxed">
              Average participation over the last 30 days is{" "}
              <strong>{attendanceRateText}%</strong>. {improvementMessage}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-slate-50 dark:bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Active Cohorts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground leading-relaxed">
              Members who joined in **{activeCohortYearLabel}** make up the most
              active cohort, attending **{cohortSessionsDisplay}** sessions on
              average.
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-slate-50 dark:bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" /> Retention Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground leading-relaxed">
              {retentionSessions >= 3 ? (
                <>
                  <strong>{insights.retentionRiskCount ?? 0} members</strong>{" "}
                  have missed the last {retentionSessions} sessions. Consider a
                  “We miss you” follow-up.
                </>
              ) : (
                "Waiting for three sessions to build retention risk context."
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
