import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, ArrowUpDown, Filter } from "lucide-react";
import { students } from "@/lib/mock-data";
import AppLayout from "@/components/layout/AppLayout";

type RiskFilter = "all" | "low" | "medium" | "high";

function StudentCard({ student, onNavigate }: { student: typeof students[0]; onNavigate: () => void }) {
  return (
    <div
      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
      onClick={onNavigate}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{student.name}</p>
          <p className="text-[10px] text-muted-foreground font-mono">{student.rollNumber}</p>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
            student.riskLevel === "high"
              ? "bg-risk-high/10 text-risk-high"
              : student.riskLevel === "medium"
                ? "bg-risk-medium/10 text-risk-medium"
                : "bg-risk-low/10 text-risk-low"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              student.riskLevel === "high"
                ? "bg-risk-high"
                : student.riskLevel === "medium"
                  ? "bg-risk-medium"
                  : "bg-risk-low"
            }`}
          />
          {student.riskLevel === "high"
            ? "Needs Attention"
            : student.riskLevel === "medium"
              ? "Monitor"
              : "On Track"}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <div>
          <p className="text-[9px] text-muted-foreground">Attendance</p>
          <p
            className={`text-xs font-semibold ${
              student.attendance < 60
                ? "text-risk-high"
                : student.attendance < 75
                  ? "text-risk-medium"
                  : "text-risk-low"
            }`}
          >
            {student.attendance}%
          </p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground">Avg. Marks</p>
          <p className="text-xs font-semibold">{student.averageMarks}%</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground">Fee</p>
          <span
            className={`rounded px-1 py-0.5 text-[9px] font-medium ${
              student.feeStatus === "paid"
                ? "bg-risk-low/10 text-risk-low"
                : student.feeStatus === "pending"
                  ? "bg-risk-medium/10 text-risk-medium"
                  : "bg-risk-high/10 text-risk-high"
            }`}
          >
            {student.feeStatus === "paid" ? "Paid" : student.feeStatus === "pending" ? "Pending" : "Overdue"}
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`text-xs font-bold ${
            student.riskScore >= 70
              ? "text-risk-high"
              : student.riskScore >= 40
                ? "text-risk-medium"
                : "text-risk-low"
          }`}
        >
          {student.riskScore}% risk
        </span>
        <span className="text-[10px] text-primary">View →</span>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [sortKey, setSortKey] = useState<"riskScore" | "attendance" | "averageMarks">("riskScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = students
    .filter((s) => {
      if (riskFilter !== "all" && s.riskLevel !== riskFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.course.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const mul = sortDir === "desc" ? -1 : 1;
      return (a[sortKey] - b[sortKey]) * mul;
    });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const riskCounts = {
    all: students.length,
    low: students.filter((s) => s.riskLevel === "low").length,
    medium: students.filter((s) => s.riskLevel === "medium").length,
    high: students.filter((s) => s.riskLevel === "high").length,
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight sm:text-xl">Students</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            All enrolled students with their current risk status
          </p>
        </div>

        {/* Search + Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, roll number, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-white/[0.08] bg-white/[0.03] text-sm"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {(["all", "low", "medium", "high"] as RiskFilter[]).map((filter) => (
              <Button
                key={filter}
                variant={riskFilter === filter ? "default" : "ghost"}
                size="sm"
                onClick={() => setRiskFilter(filter)}
                className={`shrink-0 text-[11px] ${riskFilter === filter ? "bg-primary/15 text-primary" : "text-muted-foreground"}`}
              >
                {filter === "all"
                  ? "All"
                  : filter === "low"
                    ? "On Track"
                    : filter === "medium"
                      ? "Monitor"
                      : "Needs Attention"}
                <span className="ml-1 text-[9px] opacity-60">({riskCounts[filter]})</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile: Card view */}
        <div className="space-y-2 md:hidden">
          {filtered.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onNavigate={() => navigate(`/dashboard/student/${student.id}`)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No students found matching your criteria.
            </p>
          )}
        </div>

        {/* Desktop: Table view */}
        <Card className="hidden border-white/[0.06] bg-card/40 md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground">Student Name</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground">Roll Number</th>
                    <th className="px-4 py-3">
                      <button onClick={() => toggleSort("attendance")} className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground">
                        Attendance <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button onClick={() => toggleSort("averageMarks")} className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground">
                        Avg. Marks <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground">Fee Status</th>
                    <th className="px-4 py-3">
                      <button onClick={() => toggleSort("riskScore")} className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground">
                        Risk Score <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => (
                    <tr key={student.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-medium">{student.name}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{student.rollNumber}</td>
                      <td className="px-4 py-3">
                        <span className={student.attendance < 60 ? "text-risk-high font-medium text-xs" : student.attendance < 75 ? "text-risk-medium font-medium text-xs" : "text-xs text-risk-low"}>
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{student.averageMarks}%</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${student.feeStatus === "paid" ? "bg-risk-low/10 text-risk-low" : student.feeStatus === "pending" ? "bg-risk-medium/10 text-risk-medium" : "bg-risk-high/10 text-risk-high"}`}>
                          {student.feeStatus === "paid" ? "Paid" : student.feeStatus === "pending" ? "Pending" : "Overdue"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold">
                        <span className={student.riskScore >= 70 ? "text-risk-high" : student.riskScore >= 40 ? "text-risk-medium" : "text-risk-low"}>
                          {student.riskScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${student.riskLevel === "high" ? "bg-risk-high" : student.riskLevel === "medium" ? "bg-risk-medium" : "bg-risk-low"}`} />
                          <span className={`text-xs font-medium ${student.riskLevel === "high" ? "text-risk-high" : student.riskLevel === "medium" ? "text-risk-medium" : "text-risk-low"}`}>
                            {student.riskLevel === "high" ? "Needs Attention" : student.riskLevel === "medium" ? "Monitor" : "On Track"}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/student/${student.id}`)} className="gap-1.5 text-xs text-primary hover:text-primary/80">
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No students found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
