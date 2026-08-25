import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileBarChart,
  Download,
  Users,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Loader2,
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
import AppLayout from "@/components/layout/AppLayout";

function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const students = useQuery(api.students.list, {});
  const stats = useQuery(api.students.dashboardStats);

  const loading = students === undefined;

  // Department breakdown
  const deptMap: Record<string, { high: number; medium: number; low: number }> = {};
  (students ?? []).forEach((s) => {
    if (!deptMap[s.course]) deptMap[s.course] = { high: 0, medium: 0, low: 0 };
    deptMap[s.course][s.riskLevel]++;
  });
  const departmentData = Object.entries(deptMap).map(([dept, counts]) => ({
    dept: dept.replace("B.Tech ", ""),
    ...counts,
  }));

  const handleExportAll = () => {
    const rows = [
      ["Name", "Roll Number", "Course", "Semester", "Mentor", "Attendance", "Marks", "Failed Subjects", "Fee Status", "Risk Score", "Risk Level", "Risk Factors", "Recommended Action"],
      ...(students ?? []).map((s) => [
        s.name,
        s.rollNumber,
        s.course,
        s.semester.toString(),
        s.mentor,
        s.attendance.toString(),
        s.marks.toString(),
        s.failedSubjects.toString(),
        s.feeStatus,
        s.riskScore.toString(),
        s.riskLevel === "high" ? "Needs Attention" : s.riskLevel === "medium" ? "Monitor" : "On Track",
        s.riskFactors.join("; "),
        s.recommendedAction,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    downloadCSV(csv, `pathway-student-report-${new Date().toISOString().split("T")[0]}.csv`);
  };

  const handleExportHighRisk = () => {
    const highRisk = (students ?? []).filter((s) => s.riskLevel === "high");
    const rows = [
      ["Name", "Roll Number", "Course", "Attendance", "Marks", "Risk Score", "Risk Factors", "Recommended Action"],
      ...highRisk.map((s) => [
        s.name,
        s.rollNumber,
        s.course,
        s.attendance.toString(),
        s.marks.toString(),
        s.riskScore.toString(),
        s.riskFactors.join("; "),
        s.recommendedAction,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    downloadCSV(csv, `pathway-high-risk-report-${new Date().toISOString().split("T")[0]}.csv`);
  };

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">Reports</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Summary data and downloadable exports
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total", value: stats?.totalStudents ?? 0, icon: Users, color: "text-foreground" },
            { label: "On Track", value: stats?.lowRisk ?? 0, icon: CheckCircle2, color: "text-risk-low" },
            { label: "Monitor", value: stats?.mediumRisk ?? 0, icon: Activity, color: "text-risk-medium" },
            { label: "Needs Attention", value: stats?.highRisk ?? 0, icon: AlertTriangle, color: "text-risk-high" },
          ].map((s) => (
            <Card key={s.label} className="border-white/[0.06] bg-card/40">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
                <p className={`mt-1 text-xl font-bold ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Department Chart */}
        {departmentData.length > 0 && (
          <Card className="border-white/[0.06] bg-card/40">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Risk by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="dept" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(15,15,30,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="low" name="On Track" fill="oklch(0.7 0.2 150)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="medium" name="Monitor" fill="oklch(0.75 0.18 70)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="high" name="Needs Attention" fill="oklch(0.6 0.22 25)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export Options */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="border-white/[0.06] bg-card/40">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileBarChart className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">Full Student Report</h3>
                <p className="mt-0.5 text-[10px] text-muted-foreground">All students</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Complete list of all students with attendance, marks, risk scores, factors, and recommendations.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportAll}
                  disabled={(students ?? []).length === 0}
                  className="mt-3 gap-1.5 text-xs text-primary hover:text-primary/80"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/[0.06] bg-card/40">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-risk-high/10 text-risk-high">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">High-Risk Students</h3>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Needs Attention only</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Focused report on students with risk score ≥ 70%. Includes risk factors and recommended actions.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportHighRisk}
                  disabled={(students ?? []).filter((s) => s.riskLevel === "high").length === 0}
                  className="mt-3 gap-1.5 text-xs text-risk-high hover:text-risk-high/80"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
