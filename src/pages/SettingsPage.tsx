import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import {
  User,
  Bell,
  Shield,
  Sliders,
  LogOut,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Account and preferences
          </p>
        </div>

        {/* Profile Settings */}
        <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-primary" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Name
                </label>
                <Input
                  defaultValue={user?.name || "Dr. Anand Verma"}
                  className="border-white/[0.08] bg-white/[0.03]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Email
                </label>
                <Input
                  defaultValue={user?.email || "anand.verma@institute.edu"}
                  className="border-white/[0.08] bg-white/[0.03]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Role
                </label>
                <Input
                  defaultValue="Mentor / Counsellor"
                  disabled
                  className="border-white/[0.08] bg-white/[0.03] opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Department
                </label>
                <Input
                  defaultValue="Computer Science"
                  className="border-white/[0.08] bg-white/[0.03]"
                />
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Bell className="h-4 w-4 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: "High Risk Alerts",
                desc: "Receive instant alerts when students enter high-risk zone",
                enabled: true,
              },
              {
                label: "Weekly Digest",
                desc: "Summary of risk changes and new students flagged",
                enabled: true,
              },
              {
                label: "Attendance Warnings",
                desc: "Alert when any student's attendance drops below threshold",
                enabled: true,
              },
              {
                label: "Improvement Updates",
                desc: "Notify when at-risk students show improvement",
                enabled: false,
              },
            ].map((setting) => (
              <div
                key={setting.label}
                className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-4"
              >
                <div>
                  <p className="text-sm font-medium">{setting.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {setting.desc}
                  </p>
                </div>
                <div
                  className={`h-5 w-9 cursor-pointer rounded-full transition-colors ${
                    setting.enabled ? "bg-primary" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      setting.enabled ? "translate-x-4.5 mt-0.5" : "translate-x-0.5 mt-0.5"
                    }`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Sliders className="h-4 w-4 text-primary" />
              Risk Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: "High Risk Threshold", value: "≥ 70%", color: "text-risk-high" },
                { label: "Medium Risk Threshold", value: "40% – 69%", color: "text-risk-medium" },
                { label: "Low Risk Threshold", value: "< 40%", color: "text-risk-low" },
              ].map((threshold) => (
                <div
                  key={threshold.label}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <p className="text-xs text-muted-foreground">
                    {threshold.label}
                  </p>
                  <p className={`mt-1 text-lg font-bold ${threshold.color}`}>
                    {threshold.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-destructive">
              <Shield className="h-4 w-4" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
