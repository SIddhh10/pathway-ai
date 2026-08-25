import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
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
  Loader2,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const statusConfig = {
  scheduled: { icon: Clock, color: "text-primary", bg: "bg-primary/10", label: "Scheduled" },
  completed: { icon: CheckCircle2, color: "text-risk-low", bg: "bg-risk-low/10", label: "Completed" },
  pending: { icon: AlertCircle, color: "text-risk-medium", bg: "bg-risk-medium/10", label: "Pending Confirmation" },
  cancelled: { icon: XCircle, color: "text-muted-foreground", bg: "bg-muted", label: "Cancelled" },
};

export default function CounsellingPage() {
  const allSessions = useQuery(api.counselling.list);
  const updateStatus = useMutation(api.counselling.updateStatus);

  const loading = allSessions === undefined;

  const upcoming = (allSessions ?? []).filter(
    (s) => s.status === "scheduled" || s.status === "pending"
  );
  const completed = (allSessions ?? []).filter((s) => s.status === "completed");

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
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Counselling</h1>
            <p className="text-sm text-muted-foreground">Upcoming and completed sessions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: "Upcoming", value: upcoming.length, color: "text-primary" },
            { label: "Completed", value: completed.length, color: "text-risk-low" },
            { label: "Total", value: (allSessions ?? []).length, color: "text-foreground" },
          ].map((stat) => (
            <Card key={stat.label} className="border-white/[0.06] bg-card/40">
              <CardContent className="p-3 sm:p-4">
                <p className="text-[10px] text-muted-foreground sm:text-xs">{stat.label}</p>
                <p className={`mt-1 text-lg font-bold sm:text-2xl ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {(allSessions ?? []).length === 0 && (
          <Card className="border-white/[0.06] bg-card/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium text-muted-foreground">No counselling sessions</p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Schedule sessions from the Student Analysis page
              </p>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Sessions */}
        {upcoming.length > 0 && (
          <Card className="border-white/[0.06] bg-card/40">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcoming.map((session) => {
                  const config = statusConfig[session.status];
                  return (
                    <div
                      key={session._id}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04] sm:flex sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{session.studentName}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground sm:text-xs">
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
                          {session.notes && (
                            <p className="mt-1.5 text-[11px] text-muted-foreground italic max-w-md">
                              {session.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 sm:mt-0">
                        <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${config.bg} ${config.color}`}>
                          <config.icon className="h-3 w-3" />
                          {config.label}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[10px] text-risk-low"
                          onClick={() => updateStatus({ sessionId: session._id, status: "completed" })}
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Sessions */}
        {completed.length > 0 && (
          <Card className="border-white/[0.06] bg-card/40">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completed.map((session) => (
                  <div
                    key={session._id}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 opacity-70 transition-colors hover:opacity-100 sm:flex sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-risk-low/10 text-risk-low sm:h-10 sm:w-10">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{session.studentName}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground sm:text-xs">
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
                    <span className="mt-1.5 flex items-center gap-1 self-start rounded-full bg-risk-low/10 px-2 py-0.5 text-[9px] font-medium text-risk-low sm:mt-0 sm:text-[10px]">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
