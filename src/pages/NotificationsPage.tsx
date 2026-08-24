import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  Info,
  Bell,
  BellOff,
  CheckCheck,
} from "lucide-react";
import { notifications } from "@/lib/mock-data";
import AppLayout from "@/components/layout/AppLayout";

const typeConfig = {
  alert: {
    icon: AlertTriangle,
    color: "text-risk-high",
    bg: "bg-risk-high/10",
    border: "border-risk-high/10",
  },
  warning: {
    icon: TrendingDown,
    color: "text-risk-medium",
    bg: "bg-risk-medium/10",
    border: "border-risk-medium/10",
  },
  improvement: {
    icon: CheckCircle2,
    color: "text-risk-low",
    bg: "bg-risk-low/10",
    border: "border-risk-low/10",
  },
  info: {
    icon: Info,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/10",
  },
};

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications);

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              Automated risk alerts and system events
            </p>
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
              onClick={markAllRead}
              className="gap-1.5 border-white/[0.1] bg-white/[0.03]"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((notification) => {
            const config = typeConfig[notification.type];
            return (
              <Card
                key={notification.id}
                className={`border-white/[0.06] bg-card/60 backdrop-blur-sm transition-all duration-200 ${
                  !notification.read
                    ? "border-l-2 border-l-primary bg-primary/[0.02]"
                    : "opacity-70"
                }`}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
                  >
                    <config.icon className={`h-4.5 w-4.5 ${config.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{notification.title}</p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground/60">
                      {notification.timestamp}
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
