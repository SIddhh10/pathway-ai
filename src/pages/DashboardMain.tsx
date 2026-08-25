import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Loader2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import AppLayout from "@/components/layout/AppLayout";

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  color: string;
}) {
  return (
    <Card className="border-white/[0.06] bg-card/40">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground">{title}</p>
            <p className={`mt-1 text-xl font-bold sm:text-2xl ${color}`}>{value}</p>
          </div>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${color.replace("text-", "bg-")}/10 sm:h-9 sm:w-9`}
          >
            <Icon className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${color}`} />
          </div>
        </div>
        {trend && (
          <div className="mt-2 flex items-center gap-1 text-[11px]">
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3 text-risk-low" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-risk-high" />
            )}
            <span className={trend === "up" ? "text-risk-low" : "text-risk-high"}>
              {trendValue}
            </span>
            <span className="text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardMain() {
  const stats = useQuery(api.students.dashboardStats);
  const distribution = useQuery(api.students.riskDistribution);
  const scatterData = useQuery(api.students.attendancePerformanceData);
  const urgent = useQuery(api.students.urgentStudents, { limit: 5 });
  const upcomingSessions = useQuery(api.counselling.upcoming);
  const recentNotifications = useQuery(api.notifications.list);

  const loading = stats === undefined;

  const alerts = (recentNotifications ?? [])
    .filter((n) => !n.read)
    .slice(0, 5);

  const sessions = (upcomingSessions ?? []).slice(0, 4);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-lg font-bold tracking-tight sm:text-xl">Dashboard</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Student risk overview
          </p>
        </div>

        {/* Empty state */}
        {stats.totalStudents === 0 && (
          <Card className="border-white/[0.06] bg-card/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                No students yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Add students manually or import a CSV to get started.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        {stats.totalStudents > 0 && (
          <>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
              <StatCard
                title="Total Students"
                value={stats.totalStudents}
                icon={Users}
                color="text-foreground"
              />
              <StatCard
                title="On Track"
                value={stats.lowRisk}
                icon={CheckCircle2}
                color="text-risk-low"
              />
              <StatCard
                title="Monitor"
                value={stats.mediumRisk}
                icon={Activity}
                color="text-risk-medium"
              />
              <StatCard
                title="Needs Attention"
                value={stats.highRisk}
                icon={AlertTriangle}
                color="text-risk-high"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {/* Risk Distribution */}
              <Card className="border-white/[0.06] bg-card/40">
                <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
                  <CardTitle className="text-xs font-medium">
                    Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-[140px] w-[140px] shrink-0 sm:h-[160px] sm:w-[160px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={distribution ?? []}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={65}
                            paddingAngle={3}
                            dataKey="value"
                            strokeWidth={0}
                          >
                            {(distribution ?? []).map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      {(distribution ?? []).map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[11px] text-muted-foreground">
                            {item.name}
                          </span>
                          <span className="text-[11px] font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Attendance vs Performance */}
              <Card className="border-white/[0.06] bg-card/40 lg:col-span-2">
                <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
                  <CardTitle className="text-xs font-medium">
                    Attendance vs Marks
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-4">
                  <div className="h-[180px] sm:h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis
                          dataKey="attendance"
                          name="Attendance %"
                          tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          dataKey="performance"
                          name="Marks %"
                          tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          width={30}
                        />
                        <ZAxis range={[50, 50]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15,15,30,0.95)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "8px",
                            fontSize: "11px",
                          }}
                        />
                        <Scatter
                          data={scatterData ?? []}
                          fill="oklch(0.6 0.2 260)"
                          fillOpacity={0.7}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {/* Recent Changes */}
              <Card className="border-white/[0.06] bg-card/40">
                <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
                  <CardTitle className="text-xs font-medium">
                    Recent Changes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-4">
                  <div className="space-y-2">
                    {alerts.length === 0 && (
                      <p className="py-4 text-center text-xs text-muted-foreground">
                        No recent alerts
                      </p>
                    )}
                    {alerts.map((alert) => (
                      <div
                        key={alert._id}
                        className="flex items-start gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] p-2 sm:p-2.5"
                      >
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md sm:h-6 sm:w-6 ${
                            alert.type === "alert"
                              ? "bg-risk-high/15 text-risk-high"
                              : alert.type === "warning"
                                ? "bg-risk-medium/15 text-risk-medium"
                                : "bg-risk-low/15 text-risk-low"
                          }`}
                        >
                          {alert.type === "alert" ? (
                            <AlertTriangle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          ) : alert.type === "warning" ? (
                            <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          ) : (
                            <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium sm:text-xs">{alert.title}</p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2 sm:text-[11px]">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Counselling */}
              <Card className="border-white/[0.06] bg-card/40">
                <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
                  <CardTitle className="flex items-center gap-2 text-xs font-medium">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Upcoming Counselling
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-4">
                  <div className="space-y-2">
                    {sessions.length === 0 && (
                      <p className="py-4 text-center text-xs text-muted-foreground">
                        No upcoming sessions
                      </p>
                    )}
                    {sessions.map((session) => (
                      <div
                        key={session._id}
                        className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5 sm:flex sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{session.studentName}</p>
                          <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                            with {session.mentorName} · {session.date} at {session.time}
                          </p>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 sm:mt-0">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium sm:text-[10px] ${
                              session.riskLevel === "high"
                                ? "bg-risk-high/10 text-risk-high"
                                : session.riskLevel === "medium"
                                  ? "bg-risk-medium/10 text-risk-medium"
                                  : "bg-risk-low/10 text-risk-low"
                            }`}
                          >
                            {session.riskLevel === "high"
                              ? "Needs Attention"
                              : session.riskLevel === "medium"
                                ? "Monitor"
                                : "On Track"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Students needing attention */}
            <Card className="border-white/[0.06] bg-card/40">
              <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
                <CardTitle className="text-xs font-medium">
                  Students Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-4">
                <div className="-mx-3 overflow-x-auto sm:mx-0">
                  <table className="w-full min-w-[500px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="pb-2 pr-3 text-[10px] font-medium text-muted-foreground sm:pr-4">
                          Student
                        </th>
                        <th className="hidden pb-2 pr-3 text-[10px] font-medium text-muted-foreground sm:table-cell sm:pr-4">
                          Roll No.
                        </th>
                        <th className="pb-2 pr-3 text-[10px] font-medium text-muted-foreground sm:pr-4">
                          Attendance
                        </th>
                        <th className="pb-2 pr-3 text-[10px] font-medium text-muted-foreground sm:pr-4">
                          Risk
                        </th>
                        <th className="pb-2 text-[10px] font-medium text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(urgent ?? []).map((student) => (
                        <tr
                          key={student._id}
                          className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                        >
                          <td className="py-2 pr-3 text-xs font-medium sm:py-2.5 sm:pr-4">
                            {student.name}
                          </td>
                          <td className="hidden py-2.5 pr-4 text-xs text-muted-foreground font-mono sm:table-cell">
                            {student.rollNumber}
                          </td>
                          <td className="py-2 pr-3 sm:py-2.5 sm:pr-4">
                            <span className="text-risk-high font-medium text-xs">
                              {student.attendance}%
                            </span>
                          </td>
                          <td className="py-2 pr-3 text-xs font-bold text-risk-high sm:py-2.5 sm:pr-4">
                            {student.riskScore}%
                          </td>
                          <td className="py-2 sm:py-2.5">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-risk-high" />
                              <span className="text-[10px] font-medium text-risk-high sm:text-[11px]">
                                Needs Attention
                              </span>
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(urgent ?? []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                            No high-risk students
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
