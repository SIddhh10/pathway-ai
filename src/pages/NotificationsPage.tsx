import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  Info,
  CheckCheck,
  Loader2,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const typeConfig = {
  alert: { icon: AlertTriangle, color: "text-risk-high", bg: "bg-risk-high/10" },
  warning: { icon: TrendingDown, color: "text-risk-medium", bg: "bg-risk-medium/10" },
  improvement: { icon: CheckCircle2, color: "text-risk-low", bg: "bg-risk-low/10" },
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
};

export default function NotificationsPage() {
  const notifications = useQuery(api.notifications.list);
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);

  const loading = notifications === undefined;
  const unread = (notifications ?? []).filter((n) => !n.read).length;

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">Notifications</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">Recent alerts and updates</p>
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                {unread} unread
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllRead()}
              disabled={unread === 0}
              className="gap-1.5 border-white/[0.1] bg-white/[0.03]"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {(notifications ?? []).length === 0 && (
          <Card className="border-white/[0.06] bg-card/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium text-muted-foreground">No notifications</p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Alerts will appear here when student risk levels change
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {(notifications ?? []).map((notification) => {
            const config = typeConfig[notification.type];
            return (
              <Card
                key={notification._id}
                className={`border-white/[0.06] bg-card/40 transition-all duration-200 ${
                  !notification.read
                    ? "border-l-2 border-l-primary bg-primary/[0.02]"
                    : "opacity-70"
                }`}
              >
                <CardContent className="flex items-start gap-3 p-3 sm:gap-4 sm:p-4">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${config.bg} sm:h-9 sm:w-9 sm:rounded-lg`}
                  >
                    <config.icon className={`h-3.5 w-3.5 ${config.color} sm:h-4.5 sm:w-4.5`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold sm:text-sm">{notification.title}</p>
                      {!notification.read && (
                        <button
                          onClick={() => markRead({ notificationId: notification._id })}
                          className="h-2 w-2 rounded-full bg-primary hover:bg-primary/80"
                        />
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground sm:mt-1 sm:text-sm">
                      {notification.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
