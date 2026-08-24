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
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import {
  dashboardStats,
  monthlyTrendData,
  riskDistribution,
  attendancePerformanceData,
  notifications,
  students,
  counsellingSessions,
} from "@/lib/mock-data";
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
  value: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  color: string;
}) {
  return (
    <Card className="border-white/[0.06] bg-card/40 transition-colors duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className={`mt-1.5 text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${color.replace("text-", "bg-")}/10`}
          >
            <Icon className={`h-4.5 w-4.5 ${color}`} />
          </div>
        </div>
        {trend && (
          <div className="mt-2.5 flex items-center gap-1 text-xs">
            {trend === "up" ? (
              <ArrowUpRight className="h-3.5 w-3.5 text-risk-low" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 text-risk-high" />
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
  const recentAlerts = notifications.filter((n) => !n.read).slice(0, 5);
  const urgentStudents = students
    .filter((s) => s.riskLevel === "high")
    .slice(0, 5);
  const upcomingSessions = counsellingSessions
    .filter((s) => s.status === "scheduled")
    .slice(0, 4);

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Student risk overview — August 2026
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={dashboardStats.totalStudents.toLocaleString()}
            icon={Users}
            trend="up"
            trendValue="+23"
            color="text-foreground"
          />
          <StatCard
            title="On Track"
            value={dashboardStats.lowRisk.toLocaleString()}
            icon={CheckCircle2}
            trend="up"
            trendValue="+12"
            color="text-risk-low"
          />
          <StatCard
            title="Monitor"
            value={dashboardStats.mediumRisk.toLocaleString()}
            icon={Activity}
            trend="down"
            trendValue="-5"
            color="text-risk-medium"
          />
          <StatCard
            title="Needs Attention"
            value={dashboardStats.highRisk.toLocaleString()}
            icon={AlertTriangle}
            trend="down"
            trendValue="-2"
            color="text-risk-high"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Risk Distribution */}
          <Card className="border-white/[0.06] bg-card/40">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium">
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-[160px] w-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2">
                  {riskDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.name}
                      </span>
                      <span className="text-xs font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Trend */}
          <Card className="border-white/[0.06] bg-card/40 lg:col-span-2">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium">
                Risk Levels Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrendData}>
                    <defs>
                      <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.6 0.22 25)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.6 0.22 25)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradMed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.75 0.18 70)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.75 0.18 70)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradLow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.7 0.2 150)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.7 0.2 150)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15,15,30,0.95)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="high"
                      stroke="oklch(0.6 0.22 25)"
                      fill="url(#gradHigh)"
                      strokeWidth={2}
                      name="Needs Attention"
                    />
                    <Area
                      type="monotone"
                      dataKey="medium"
                      stroke="oklch(0.75 0.18 70)"
                      fill="url(#gradMed)"
                      strokeWidth={2}
                      name="Monitor"
                    />
                    <Area
                      type="monotone"
                      dataKey="low"
                      stroke="oklch(0.7 0.2 150)"
                      fill="url(#gradLow)"
                      strokeWidth={2}
                      name="On Track"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {/* Attendance vs Performance */}
          <Card className="border-white/[0.06] bg-card/40">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium">
                Attendance vs Marks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="attendance"
                      name="Attendance %"
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="performance"
                      name="Marks %"
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ZAxis range={[60, 60]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15,15,30,0.95)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Scatter
                      data={attendancePerformanceData}
                      fill="oklch(0.6 0.2 260)"
                      fillOpacity={0.7}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Changes */}
          <Card className="border-white/[0.06] bg-card/40">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium">
                Recent Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5"
                  >
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                        alert.type === "alert"
                          ? "bg-risk-high/15 text-risk-high"
                          : alert.type === "warning"
                            ? "bg-risk-medium/15 text-risk-medium"
                            : "bg-risk-low/15 text-risk-low"
                      }`}
                    >
                      {alert.type === "alert" ? (
                        <AlertTriangle className="h-3 w-3" />
                      ) : alert.type === "warning" ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">{alert.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
                        {alert.message}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                        {alert.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students needing attention */}
        <Card className="border-white/[0.06] bg-card/40">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium">
              Students Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="pb-2.5 pr-4 text-[11px] font-medium text-muted-foreground">
                      Student
                    </th>
                    <th className="pb-2.5 pr-4 text-[11px] font-medium text-muted-foreground">
                      Roll No.
                    </th>
                    <th className="pb-2.5 pr-4 text-[11px] font-medium text-muted-foreground">
                      Attendance
                    </th>
                    <th className="pb-2.5 pr-4 text-[11px] font-medium text-muted-foreground">
                      Avg. Marks
                    </th>
                    <th className="pb-2.5 pr-4 text-[11px] font-medium text-muted-foreground">
                      Fee
                    </th>
                    <th className="pb-2.5 pr-4 text-[11px] font-medium text-muted-foreground">
                      Risk
                    </th>
                    <th className="pb-2.5 text-[11px] font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {urgentStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                    >
                      <td className="py-2.5 pr-4 text-sm font-medium">{student.name}</td>
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground font-mono">
                        {student.rollNumber}
                      </td>
                      <td className="py-2.5 pr-4">
                        <span
                          className={
                            student.attendance < 60
                              ? "text-risk-high font-medium text-xs"
                              : "text-risk-medium text-xs"
                          }
                        >
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                        {student.averageMarks}%
                      </td>
                      <td className="py-2.5 pr-4">
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                            student.feeStatus === "paid"
                              ? "bg-risk-low/10 text-risk-low"
                              : student.feeStatus === "pending"
                                ? "bg-risk-medium/10 text-risk-medium"
                                : "bg-risk-high/10 text-risk-high"
                          }`}
                        >
                          {student.feeStatus === "paid"
                            ? "Paid"
                            : student.feeStatus === "pending"
                              ? "Pending"
                              : "Overdue"}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-xs font-bold text-risk-high">
                        {student.riskScore}%
                      </td>
                      <td className="py-2.5">
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-risk-high" />
                          <span className="text-[11px] font-medium text-risk-high">
                            Needs Attention
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Counselling */}
        <Card className="border-white/[0.06] bg-card/40">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-xs font-medium">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Upcoming Counselling Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium">{session.studentName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        with {session.mentorName} · {session.date} at {session.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
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
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
