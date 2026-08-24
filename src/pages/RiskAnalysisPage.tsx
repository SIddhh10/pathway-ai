import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BrainCircuit,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
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
import { students, riskDistribution } from "@/lib/mock-data";
import AppLayout from "@/components/layout/AppLayout";

const riskFactorsData = [
  { factor: "Attendance", weight: 30 },
  { factor: "Test Marks", weight: 25 },
  { factor: "Failed Subjects", weight: 20 },
  { factor: "Fee Status", weight: 15 },
  { factor: "Historical Trend", weight: 10 },
];

const factorImpactData = [
  { factor: "Low Attendance", high: 95, medium: 60, low: 15 },
  { factor: "Failed Subjects", high: 85, medium: 55, low: 10 },
  { factor: "Declining Marks", high: 80, medium: 50, low: 20 },
  { factor: "Fee Overdue", high: 70, medium: 40, low: 8 },
  { factor: "No Intervention", high: 90, medium: 45, low: 5 },
];

const improvingStudents = students.filter((s) => s.trend === "improving");
const decliningStudents = students.filter((s) => s.trend === "declining");

export default function RiskAnalysisPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>            <h1 className="text-xl font-bold tracking-tight">Risk Analysis</h1>
            <p className="text-sm text-muted-foreground">
              How risk scores are calculated
            </p>
        </div>

        {/* Model Overview */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Model Accuracy</p>
                  <p className="text-xl font-bold">94.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-risk-low/10 text-risk-low">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Improving</p>
                  <p className="text-xl font-bold">{improvingStudents.length} students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-risk-high/10 text-risk-high">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Declining</p>
                  <p className="text-xl font-bold">{decliningStudents.length} students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Risk Factor Weights */}
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                AI Model Factor Weights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={riskFactorsData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis
                      dataKey="factor"
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                    />
                    <Radar
                      name="Weight"
                      dataKey="weight"
                      stroke="oklch(0.6 0.2 260)"
                      fill="oklch(0.6 0.2 260)"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Factor Impact */}
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Factor Impact on Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={factorImpactData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      type="number"
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="factor"
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={110}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15,15,30,0.95)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="high" name="High Risk" fill="oklch(0.6 0.22 25)" barSize={8} radius={[0, 2, 2, 0]} />
                    <Bar dataKey="medium" name="Medium Risk" fill="oklch(0.75 0.18 70)" barSize={8} radius={[0, 2, 2, 0]} />
                    <Bar dataKey="low" name="Low Risk" fill="oklch(0.7 0.2 150)" barSize={8} radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Students */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-risk-high">
                <TrendingDown className="h-4 w-4" />
                Declining Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {decliningStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {student.rollNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-risk-high">
                        {student.riskScore}%
                      </p>
                      <p className="text-[10px] text-risk-high">declining</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-risk-low">
                <TrendingUp className="h-4 w-4" />
                Improving Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {improvingStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {student.rollNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-risk-low">
                        {student.riskScore}%
                      </p>
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
