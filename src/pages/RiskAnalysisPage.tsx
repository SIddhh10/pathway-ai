import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import AppLayout from "@/components/layout/AppLayout";

const riskFactorsData = [
  { factor: "Attendance", weight: 30 },
  { factor: "Test Marks", weight: 25 },
  { factor: "Failed Subjects", weight: 20 },
  { factor: "Fee Status", weight: 10 },
  { factor: "Performance Trend", weight: 15 },
];

export default function RiskAnalysisPage() {
  const trending = useQuery(api.students.trendingStudents);
  const stats = useQuery(api.students.dashboardStats);

  const loading = trending === undefined;

  // Compute factor impact from real data
  const allStudents = useQuery(api.students.list, {});

  const computeImpact = () => {
    const students = allStudents ?? [];
    if (students.length === 0) return [];

    const highRisk = students.filter((s) => s.riskLevel === "high");
    const medRisk = students.filter((s) => s.riskLevel === "medium");
    const lowRisk = students.filter((s) => s.riskLevel === "low");

    const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    return [
      {
        factor: "Low Attendance",
        high: highRisk.length ? Math.round((highRisk.filter((s) => s.attendance < 60).length / highRisk.length) * 100) : 0,
        medium: medRisk.length ? Math.round((medRisk.filter((s) => s.attendance < 60).length / medRisk.length) * 100) : 0,
        low: lowRisk.length ? Math.round((lowRisk.filter((s) => s.attendance < 60).length / lowRisk.length) * 100) : 0,
      },
      {
        factor: "Failed Subjects",
        high: highRisk.length ? Math.round((highRisk.filter((s) => s.failedSubjects >= 2).length / highRisk.length) * 100) : 0,
        medium: medRisk.length ? Math.round((medRisk.filter((s) => s.failedSubjects >= 2).length / medRisk.length) * 100) : 0,
        low: lowRisk.length ? Math.round((lowRisk.filter((s) => s.failedSubjects >= 2).length / lowRisk.length) * 100) : 0,
      },
      {
        factor: "Declining Marks",
        high: highRisk.length ? Math.round((highRisk.filter((s) => s.marks < 40).length / highRisk.length) * 100) : 0,
        medium: medRisk.length ? Math.round((medRisk.filter((s) => s.marks < 40).length / medRisk.length) * 100) : 0,
        low: lowRisk.length ? Math.round((lowRisk.filter((s) => s.marks < 40).length / lowRisk.length) * 100) : 0,
      },
      {
        factor: "Fee Overdue",
        high: highRisk.length ? Math.round((highRisk.filter((s) => s.feeStatus === "overdue").length / highRisk.length) * 100) : 0,
        medium: medRisk.length ? Math.round((medRisk.filter((s) => s.feeStatus === "overdue").length / medRisk.length) * 100) : 0,
        low: lowRisk.length ? Math.round((lowRisk.filter((s) => s.feeStatus === "overdue").length / lowRisk.length) * 100) : 0,
      },
      {
        factor: "Declining Trend",
        high: highRisk.length ? Math.round((highRisk.filter((s) => s.trend === "declining").length / highRisk.length) * 100) : 0,
        medium: medRisk.length ? Math.round((medRisk.filter((s) => s.trend === "declining").length / medRisk.length) * 100) : 0,
        low: lowRisk.length ? Math.round((lowRisk.filter((s) => s.trend === "declining").length / lowRisk.length) * 100) : 0,
      },
    ];
  };

  const factorImpactData = computeImpact();

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
        <div>
          <h1 className="text-lg font-bold tracking-tight sm:text-xl">Risk Analysis</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            How risk scores are calculated
          </p>
        </div>

        {/* Model Overview */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-white/[0.06] bg-card/40">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Students</p>
                  <p className="text-xl font-bold">{stats?.totalStudents ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/[0.06] bg-card/40">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-risk-low/10 text-risk-low">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Improving</p>
                  <p className="text-xl font-bold">{stats?.improving ?? 0} students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/[0.06] bg-card/40">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-risk-high/10 text-risk-high">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Declining</p>
                  <p className="text-xl font-bold">{stats?.declining ?? 0} students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formula Explanation */}
        <Card className="border-white/[0.06] bg-card/40">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Risk Score Formula</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Risk scores are calculated using a weighted formula. Each factor contributes to a total score between 0 and 100.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {riskFactorsData.map((f) => (
                <div key={f.factor} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <p className="text-lg font-bold text-primary">{f.weight}%</p>
                  <p className="text-[10px] text-muted-foreground">{f.factor}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-[10px] text-muted-foreground">
              <span>0–39: <span className="text-risk-low font-medium">On Track</span></span>
              <span>40–69: <span className="text-risk-medium font-medium">Monitor</span></span>
              <span>70–100: <span className="text-risk-high font-medium">Needs Attention</span></span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Risk Factor Weights */}
          <Card className="border-white/[0.06] bg-card/40">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Factor Weights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={riskFactorsData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis dataKey="factor" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                    <Radar name="Weight" dataKey="weight" stroke="oklch(0.6 0.2 260)" fill="oklch(0.6 0.2 260)" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Factor Impact */}
          <Card className="border-white/[0.06] bg-card/40">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Factor Prevalence by Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={factorImpactData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="factor" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(15,15,30,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="high" name="Needs Attention" fill="oklch(0.6 0.22 25)" barSize={8} radius={[0, 2, 2, 0]} />
                    <Bar dataKey="medium" name="Monitor" fill="oklch(0.75 0.18 70)" barSize={8} radius={[0, 2, 2, 0]} />
                    <Bar dataKey="low" name="On Track" fill="oklch(0.7 0.2 150)" barSize={8} radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Students */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="border-white/[0.06] bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-risk-high">
                <TrendingDown className="h-4 w-4" />
                Declining Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(trending?.declining ?? []).length === 0 && (
                  <p className="py-4 text-center text-xs text-muted-foreground">No declining students</p>
                )}
                {(trending?.declining ?? []).map((student) => (
                  <div key={student._id} className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-risk-high">{student.riskScore}%</p>
                      <p className="text-[10px] text-risk-high">declining</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/[0.06] bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-risk-low">
                <TrendingUp className="h-4 w-4" />
                Improving Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(trending?.improving ?? []).length === 0 && (
                  <p className="py-4 text-center text-xs text-muted-foreground">No improving students</p>
                )}
                {(trending?.improving ?? []).map((student) => (
                  <div key={student._id} className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-risk-low">{student.riskScore}%</p>
                      <p className="text-[10px] text-risk-low">improving</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
