import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, ArrowUpDown, Filter } from "lucide-react";
import { students } from "@/lib/mock-data";
import AppLayout from "@/components/layout/AppLayout";

type RiskFilter = "all" | "low" | "medium" | "high";

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
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">
            All enrolled students with their current risk status
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, roll number, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-white/[0.08] bg-white/[0.03]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {(["all", "low", "medium", "high"] as RiskFilter[]).map((filter) => (
              <Button
                key={filter}
                variant={riskFilter === filter ? "default" : "ghost"}
                size="sm"
                onClick={() => setRiskFilter(filter)}
                className={`text-xs ${
                  riskFilter === filter
                    ? "bg-primary/15 text-primary hover:bg-primary/20"
                    : "text-muted-foreground"
                }`}
              >
                {filter === "all"
                  ? "All"
                  : filter === "low"
                    ? "On Track"
                    : filter === "medium"
                      ? "Monitor"
                      : "Needs Attention"}
                <span className="ml-1 text-[10px] opacity-60">
                  ({riskCounts[filter]})
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="border-white/[0.06] bg-card/40">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                      Student Name
                    </th>
                    <th className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                      Roll Number
                    </th>
                    <th className="px-5 py-3.5">
                      <button
                        onClick={() => toggleSort("attendance")}
                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        Attendance
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-5 py-3.5">
                      <button
                        onClick={() => toggleSort("averageMarks")}
                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        Avg. Marks
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                      Fee Status
                    </th>
                    <th className="px-5 py-3.5">
                      <button
                        onClick={() => toggleSort("riskScore")}
                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        Risk Score
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-3.5 font-medium">
                        {student.name}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">
                        {student.rollNumber}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={
                            student.attendance < 60
                              ? "text-risk-high font-medium"
                              : student.attendance < 75
                                ? "text-risk-medium font-medium"
                                : "text-risk-low"
                          }
                        >
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {student.averageMarks}%
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            student.feeStatus === "paid"
                              ? "bg-risk-low/10 text-risk-low"
                              : student.feeStatus === "pending"
                                ? "bg-risk-medium/10 text-risk-medium"
                                : "bg-risk-high/10 text-risk-high"
                          }`}
                        >
                          {student.feeStatus === "paid"
                            ? "Paid"
                            : student.feeStatus === "pending"
                              ? "Pending"
                              : "Overdue"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-bold">
                        <span
                          className={
                            student.riskScore >= 70
                              ? "text-risk-high"
                              : student.riskScore >= 40
                                ? "text-risk-medium"
                                : "text-risk-low"
                          }
                        >
                          {student.riskScore}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              student.riskLevel === "high"
                                ? "bg-risk-high"
                                : student.riskLevel === "medium"
                                  ? "bg-risk-medium"
                                  : "bg-risk-low"
                            }`}
                          />
                          <span
                            className={`text-xs font-medium capitalize ${
                              student.riskLevel === "high"
                                ? "text-risk-high"
                                : student.riskLevel === "medium"
                                  ? "text-risk-medium"
                                  : "text-risk-low"
                            }`}
                          >
                            {student.riskLevel === "high"
                              ? "Needs Attention"
                              : student.riskLevel === "medium"
                                ? "Monitor"
                                : "On Track"
                            }
                          </span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/dashboard/student/${student.id}`)
                          }
                          className="gap-1.5 text-xs text-primary hover:text-primary/80"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Analysis
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
