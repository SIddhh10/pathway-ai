import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Phone,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Minus,
  GraduationCap,
  User,
  BookOpen,
  CreditCard,
} from "lucide-react";
import { students } from "@/lib/mock-data";
import AppLayout from "@/components/layout/AppLayout";

function CircularScore({ score, level }: { score: number; level: string }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color =
    level === "high"
      ? "oklch(0.6 0.22 25)"
      : level === "medium"
        ? "oklch(0.75 0.18 70)"
        : "oklch(0.7 0.2 150)";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold" style={{ color }}>
          {score}%
        </div>
        <div
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color }}
        >
          {level} Risk
        </div>
      </div>
    </div>
  );
}

export default function StudentAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = students.find((s) => s.id === id);

  if (!student) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Student not found.</p>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/students")}
            className="mt-4"
          >
            Back to Students
          </Button>
        </div>
      </AppLayout>
    );
  }

  const TrendIcon =
    student.trend === "improving"
      ? TrendingUp
      : student.trend === "declining"
        ? TrendingDown
        : Minus;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/students")}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Student Analysis
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-powered risk assessment and recommendations
            </p>
          </div>
        </div>

        {/* Profile + Risk Score */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Student Profile */}
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Student Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {student.rollNumber}
                  </p>
                </div>
              </div>
              <div className="space-y-3 border-t border-white/[0.06] pt-4">
                {[
                  { icon: GraduationCap, label: "Course", value: student.course },
                  { icon: BookOpen, label: "Semester", value: `Semester ${student.semester}` },
                  { icon: User, label: "Mentor", value: student.mentor },
                  {
                    icon: CreditCard,
                    label: "Fee Status",
                    value:
                      student.feeStatus === "paid"
                        ? "Paid"
                        : student.feeStatus === "pending"
                          ? `Pending — ₹${student.feeAmount.toLocaleString()}`
                          : `Overdue — ₹${student.feeAmount.toLocaleString()}`,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-4">
                <div className="flex items-center gap-2 text-xs">
                  <TrendIcon
                    className={`h-4 w-4 ${
                      student.trend === "improving"
                        ? "text-risk-low"
                        : student.trend === "declining"
                          ? "text-risk-high"
                          : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    Trend:{" "}
                    <span
                      className={`font-medium capitalize ${
                        student.trend === "improving"
                          ? "text-risk-low"
                          : student.trend === "declining"
                            ? "text-risk-high"
                            : "text-muted-foreground"
                      }`}
                    >
                      {student.trend}
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Risk Score */}
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                AI Dropout Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="shrink-0">
                  <CircularScore
                    score={student.riskScore}
                    level={student.riskLevel}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  {/* Risk Factors */}
                  {student.riskFactors.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Key Risk Factors
                      </h4>
                      <div className="space-y-2">
                        {student.riskFactors.map((factor, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 rounded-lg border border-risk-high/10 bg-risk-high/[0.04] p-2.5"
                          >
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-risk-high" />
                            <span className="text-xs text-foreground/90">
                              {factor}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No risk factors */}
                  {student.riskFactors.length === 0 && (
                    <div className="flex items-center gap-2 rounded-lg border border-risk-low/10 bg-risk-low/[0.04] p-3">
                      <CheckCircle2 className="h-4 w-4 text-risk-low" />
                      <span className="text-xs text-risk-low">
                        No risk factors detected. Student is performing well.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Action */}
        <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Recommended Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {student.recommendedAction}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Calendar className="h-4 w-4" />
                Schedule Counselling
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-white/[0.1] bg-white/[0.03]"
              >
                <MessageSquare className="h-4 w-4" />
                Notify Mentor
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-white/[0.1] bg-white/[0.03]"
              >
                <Phone className="h-4 w-4" />
                Notify Guardian
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-white/[0.1] bg-white/[0.03]"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as Reviewed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
