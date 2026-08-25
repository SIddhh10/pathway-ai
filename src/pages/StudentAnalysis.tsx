import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Loader2,
} from "lucide-react";
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
        <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
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
        <div className="text-2xl font-bold" style={{ color }}>{score}%</div>
        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
          {level === "high" ? "Needs Attention" : level === "medium" ? "Monitor" : "On Track"}
        </div>
      </div>
    </div>
  );
}

export default function StudentAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = useQuery(api.students.get, { studentId: id as any });
  const scheduleCounselling = useMutation(api.counselling.create);
  const markReviewed = useMutation(api.counselling.markReviewed);
  const createNotification = useMutation(api.notifications.create);

  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loading = student === undefined;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!student) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Student not found.</p>
          <Button variant="ghost" onClick={() => navigate("/dashboard/students")} className="mt-4">
            Back to Students
          </Button>
        </div>
      </AppLayout>
    );
  }

  const TrendIcon =
    student.trend === "improving" ? TrendingUp : student.trend === "declining" ? TrendingDown : Minus;

  const handleScheduleCounselling = async () => {
    if (!scheduleDate || !scheduleTime) return;
    setActionLoading("schedule");
    try {
      await scheduleCounselling({
        studentId: student._id,
        studentName: student.name,
        mentorName: student.mentor,
        date: scheduleDate,
        time: scheduleTime,
        riskLevel: student.riskLevel,
        notes: "Scheduled from student analysis page.",
      });
      setShowSchedule(false);
      setScheduleDate("");
      setScheduleTime("");
    } finally {
      setActionLoading(null);
    }
  };

  const handleNotifyMentor = async () => {
    setActionLoading("mentor");
    try {
      await createNotification({
        type: "info",
        title: "Mentor Notified",
        message: `${student.mentor} has been notified about ${student.name}'s current risk status.`,
        studentId: student._id,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleNotifyGuardian = async () => {
    setActionLoading("guardian");
    try {
      await createNotification({
        type: "info",
        title: "Guardian Notified",
        message: `Guardian notification sent for ${student.name}. Risk level: ${student.riskLevel}.`,
        studentId: student._id,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkReviewed = async () => {
    setActionLoading("reviewed");
    try {
      await markReviewed({
        studentId: student._id,
        studentName: student.name,
        mentorName: student.mentor,
        notes: "Student marked as reviewed from the analysis page.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/students")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">Student Analysis</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Risk assessment breakdown and recommended actions
            </p>
          </div>
        </div>

        {/* Profile + Risk Score */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Student Profile */}
          <Card className="border-white/[0.06] bg-card/40">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Student Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{student.rollNumber}</p>
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
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
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

          {/* Risk Score */}
          <Card className="border-white/[0.06] bg-card/40">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="shrink-0">
                  <CircularScore score={student.riskScore} level={student.riskLevel} />
                </div>
                <div className="flex-1 space-y-4">
                  {student.riskFactors.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Key Risk Factors
                      </h4>
                      <div className="space-y-2">
                        {student.riskFactors.map((factor, i) => (
                          <div key={i} className="flex items-start gap-2 rounded-lg border border-risk-high/10 bg-risk-high/[0.04] p-2.5">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-risk-high" />
                            <span className="text-xs text-foreground/90">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {student.riskFactors.length === 0 && (
                    <div className="flex items-center gap-2 rounded-lg border border-risk-low/10 bg-risk-low/[0.04] p-3">
                      <CheckCircle2 className="h-4 w-4 text-risk-low" />
                      <span className="text-xs text-risk-low">No concerns identified. Student is on track.</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Action */}
        <Card className="border-white/[0.06] bg-card/40">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recommended Action</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {student.recommendedAction}
            </p>

            {/* Schedule Counselling Form */}
            {showSchedule && (
              <div className="mb-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 text-xs font-medium text-muted-foreground">Schedule Counselling Session</p>
                <div className="flex flex-wrap gap-3">
                  <Input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="border-white/[0.08] bg-white/[0.03] text-sm w-[160px]"
                  />
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="border-white/[0.08] bg-white/[0.03] text-sm w-[120px]"
                  />
                  <Button
                    size="sm"
                    onClick={handleScheduleCounselling}
                    disabled={!scheduleDate || !scheduleTime || actionLoading === "schedule"}
                    className="bg-primary text-primary-foreground"
                  >
                    {actionLoading === "schedule" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowSchedule(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {!showSchedule && (
                <Button
                  size="sm"
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 sm:gap-2 sm:text-sm"
                  onClick={() => setShowSchedule(true)}
                >
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Schedule Counselling
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-white/[0.1] bg-white/[0.03] sm:gap-2 sm:text-sm"
                onClick={handleNotifyMentor}
                disabled={actionLoading === "mentor"}
              >
                {actionLoading === "mentor" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                Notify Mentor
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-white/[0.1] bg-white/[0.03] sm:gap-2 sm:text-sm"
                onClick={handleNotifyGuardian}
                disabled={actionLoading === "guardian"}
              >
                {actionLoading === "guardian" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                Notify Guardian
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-white/[0.1] bg-white/[0.03] sm:gap-2 sm:text-sm"
                onClick={handleMarkReviewed}
                disabled={actionLoading === "reviewed"}
              >
                {actionLoading === "reviewed" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                Mark as Reviewed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
