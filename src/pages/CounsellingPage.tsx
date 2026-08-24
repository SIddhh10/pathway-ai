import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { counsellingSessions } from "@/lib/mock-data";
import AppLayout from "@/components/layout/AppLayout";

const statusConfig = {
  scheduled: {
    icon: Clock,
    color: "text-primary",
    bg: "bg-primary/10",
    label: "Scheduled",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-risk-low",
    bg: "bg-risk-low/10",
    label: "Completed",
  },
  pending: {
    icon: AlertCircle,
    color: "text-risk-medium",
    bg: "bg-risk-medium/10",
    label: "Pending Confirmation",
  },
  cancelled: {
    icon: XCircle,
    color: "text-muted-foreground",
    bg: "bg-muted",
    label: "Cancelled",
  },
};

export default function CounsellingPage() {
  const upcoming = counsellingSessions.filter(
    (s) => s.status === "scheduled" || s.status === "pending"
  );
  const completed = counsellingSessions.filter(
    (s) => s.status === "completed"
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Counselling</h1>
            <p className="text-sm text-muted-foreground">
              Upcoming and completed sessions
            </p>
          </div>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Schedule New Session
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Upcoming", value: upcoming.length, color: "text-primary" },
            { label: "Completed", value: completed.length, color: "text-risk-low" },
            { label: "Total", value: counsellingSessions.length, color: "text-foreground" },
          ].map((stat) => (
            <Card key={stat.label} className="border-white/[0.06] bg-card/40">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Sessions */}
        <Card className="border-white/[0.06] bg-card/40">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcoming.map((session) => {
                const config = statusConfig[session.status];
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{session.studentName}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {session.mentorName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.notes && (
                        <p className="mt-1.5 text-[11px] text-muted-foreground italic max-w-md">
                          {session.notes}
                        </p>
                      )}
                      <span
                        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${config.bg} ${config.color}`}
                      >
                        <config.icon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Completed Sessions */}
        <Card className="border-white/[0.06] bg-card/40">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Completed Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completed.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 opacity-70 transition-colors hover:opacity-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-risk-low/10 text-risk-low">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{session.studentName}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{session.mentorName}</span>
                        <span>{session.date}</span>
                        <span>{session.time}</span>
                      </div>
                      {session.notes && (
                        <p className="mt-1.5 text-[11px] text-muted-foreground italic max-w-md">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-risk-low/10 px-2.5 py-1 text-[10px] font-medium text-risk-low">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
