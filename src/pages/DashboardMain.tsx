import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
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
    <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm transition-all duration-200 hover:border-white/[0.1] hover:shadow-lg hover:shadow-primary/[0.03]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {title}
            </p>
            <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${color.replace("text-", "bg-")}/10`}
          >
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1 text-xs">
            {trend === "up" ? (
              <ArrowUpRight className="h-3.5 w-3.5 text-risk-low" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 text-risk-high" />
            )}
            <span
              className={
                trend === "up" ? "text-risk-low" : "text-risk-high"
              }
            >
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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Risk Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time overview of student dropout risk indicators
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={dashboardStats.totalStudents.toLocaleString()}
            icon={Users}
            trend="up"
            trendValue="+23"
            color="text-foreground"
          />
          <StatCard
            title="Low Risk"
            value={dashboardStats.lowRisk.toLocaleString()}
            icon={CheckCircle2}
            trend="up"
            trendValue="+12"
            color="text-risk-low"
          />
          <StatCard
            title="Medium Risk"
            value={dashboardStats.mediumRisk.toLocaleString()}
            icon={Activity}
            trend="down"
            trendValue="-5"
            color="text-risk-medium"
          />
          <StatCard
            title="High Risk"
            value={dashboardStats.highRisk.toLocaleString()}
            icon={AlertTriangle}
            trend="down"
            trendValue="-2"
            color="text-risk-high"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Risk Distribution Donut */}
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-[180px] w-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
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
                        className="h-2.5 w-2.5 rounded-full"
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

          {/* Dropout Risk Trend */}
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Dropout Risk Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
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
                      name="High Risk"
                    />
                    <Area
                      type="monotone"
                      dataKey="medium"
                      stroke="oklch(0.75 0.18 70)"
                      fill="url(#gradMed)"
                      strokeWidth={2}
                      name="Medium Risk"
                    />
                    <Area
                      type="monotone"
                      dataKey="low"
                      stroke="oklch(0.7 0.2 150)"
                      fill="url(#gradLow)"
                      strokeWidth={2}
                      name="Low Risk"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Attendance vs Performance */}
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Attendance vs Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
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
                      name="Performance %"
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

          {/* Recent High-Risk Alerts */}
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3"
                  >
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        alert.type === "alert"
                          ? "bg-risk-high/15 text-risk-high"
                          : alert.type === "warning"
                            ? "bg-risk-medium/15 text-risk-medium"
                            : "bg-risk-low/15 text-risk-low"
                      }`}
                    >
                      {alert.type === "alert" ? (
                        <AlertTriangle className="h-3.5 w-3.5" />
                      ) : alert.type === "warning" ? (
                        <TrendingDown className="h-3.5 w-3.5" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">{alert.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {alert.message}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground/60">
                        {alert.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Students Table */}
        <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Students Requiring Immediate Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">
                      Student
                    </th>
                    <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">
                      Roll No.
                    </th>
                    <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">
                      Attendance
                    </th>
                    <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">
                      Avg. Marks
                    </th>
                    <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">
                      Fee Status
                    </th>
                    <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">
                      Risk Score
                    </th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground">
                      Risk Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {urgentStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="py-3 pr-4 font-medium">{student.name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {student.rollNumber}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={
                            student.attendance < 60
                              ? "text-risk-high"
                              : student.attendance < 75
                                ? "text-risk-medium"
                                : "text-risk-low"
                          }
                        >
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {student.averageMarks}%
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
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
                      <td className="py-3 pr-4 font-bold text-risk-high">
                        {student.riskScore}%
                      </td>
                      <td className="py-3">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-risk-high" />
                          <span className="text-xs font-medium text-risk-high">
                            High
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
      </div>
    </AppLayout>
  );
}
