import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileBarChart,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { monthlyTrendData } from "@/lib/mock-data";
import AppLayout from "@/components/layout/AppLayout";

const departmentData = [
  { dept: "Computer Science", high: 35, medium: 72, low: 210 },
  { dept: "Electrical Eng.", high: 28, medium: 55, low: 185 },
  { dept: "Mechanical Eng.", high: 25, medium: 68, low: 220 },
  { dept: "Civil Eng.", high: 32, medium: 85, low: 235 },
];

const reports = [
  {
    title: "Monthly Risk Summary",
    date: "August 2026",
    description: "Overview of student risk levels across all departments.",
    icon: FileBarChart,
  },
  {
    title: "Attendance Report",
    date: "August 2026",
    description: "Detailed attendance analysis with trend comparisons.",
    icon: Calendar,
  },
  {
    title: "Intervention Effectiveness",
    date: "July–August 2026",
    description: "Measures the impact of counselling on risk score changes.",
    icon: TrendingUp,
  },
  {
    title: "Fee Default Analysis",
    date: "August 2026",
    description: "Correlation between fee payment status and dropout risk.",
    icon: TrendingDown,
  },
];

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">Reports</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Summary data and downloadable exports
            </p>
          </div>
        </div>

        {/* Department Breakdown Chart */}
        <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Risk by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="dept"
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
                  <Legend
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                  <Bar dataKey="low" name="Low Risk" fill="oklch(0.7 0.2 150)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="medium" name="Medium Risk" fill="oklch(0.75 0.18 70)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="high" name="High Risk" fill="oklch(0.6 0.22 25)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Available Reports */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {reports.map((report) => (
            <Card
              key={report.title}
              className="border-white/[0.06] bg-card/60 backdrop-blur-sm transition-all duration-200 hover:border-white/[0.1]"
            >
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <report.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{report.title}</h3>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {report.date}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {report.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 gap-1.5 text-xs text-primary hover:text-primary/80"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
