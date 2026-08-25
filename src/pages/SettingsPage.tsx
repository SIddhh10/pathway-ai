import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Bell,
  Shield,
  Sliders,
  LogOut,
  Database,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const seedStudents = useMutation(api.seed.seedStudents);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSeed = async () => {
    setSeedLoading(true);
    setSeedResult(null);
    try {
      const result = await seedStudents();
      if (result.seeded) {
        setSeedResult(`Seeded ${result.count} students with counselling sessions and notifications.`);
      } else {
        setSeedResult(result.message ?? "Already seeded");
      }
    } catch (err) {
      setSeedResult(err instanceof Error ? err.message : "Seed failed");
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-bold tracking-tight sm:text-xl">Settings</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">Account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="border-white/[0.06] bg-card/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-primary" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <Input
                  defaultValue={user?.name || "Not set"}
                  disabled
                  className="border-white/[0.08] bg-white/[0.03] opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <Input
                  defaultValue={user?.email || "Not set"}
                  disabled
                  className="border-white/[0.08] bg-white/[0.03] opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Role</label>
                <Input
                  defaultValue={user?.role || "Mentor / Counsellor"}
                  disabled
                  className="border-white/[0.08] bg-white/[0.03] opacity-60"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Thresholds */}
        <Card className="border-white/[0.06] bg-card/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Sliders className="h-4 w-4 text-primary" />
              Risk Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Risk scores are calculated automatically using the weighted formula shown on the Risk Analysis page.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: "Needs Attention", value: "≥ 70%", color: "text-risk-high" },
                { label: "Monitor", value: "40% – 69%", color: "text-risk-medium" },
                { label: "On Track", value: "< 40%", color: "text-risk-low" },
              ].map((threshold) => (
                <div key={threshold.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-xs text-muted-foreground">{threshold.label}</p>
                  <p className={`mt-1 text-lg font-bold ${threshold.color}`}>{threshold.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seed Data */}
        <Card className="border-white/[0.06] bg-card/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Database className="h-4 w-4 text-primary" />
              Demo Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Seed the database with 12 demo students, counselling sessions, and notifications to explore the application.
            </p>
            <Button
              onClick={handleSeed}
              disabled={seedLoading}
              variant="outline"
              className="gap-2"
            >
              {seedLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              Load Demo Data
            </Button>
            {seedResult && (
              <div className="flex items-center gap-2 text-xs text-risk-low">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {seedResult}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-card/40">
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
