import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
  X,
  Download,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { calculateRisk } from "@/lib/risk-calculation";

interface ParsedStudent {
  name: string;
  rollNumber: string;
  course: string;
  semester: number;
  mentor: string;
  attendance: number;
  marks: number;
  failedSubjects: number;
  totalSubjects: number;
  feeStatus: "paid" | "pending" | "overdue";
  feeAmount: number;
  trend: "improving" | "declining" | "stable";
  _rowIndex?: number;
  _errors?: string[];
}

function parseCSV(text: string): ParsedStudent[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const required = ["name", "rollnumber", "course", "semester", "mentor", "attendance", "marks", "failedsubjects"];
  const missing = required.filter((r) => !headers.includes(r));
  if (missing.length > 0) {
    throw new Error(`Missing required columns: ${missing.join(", ")}`);
  }

  const students: ParsedStudent[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || "";
    });

    const errors: string[] = [];

    const name = row["name"] || "";
    const rollNumber = row["rollnumber"] || "";
    const course = row["course"] || "";
    const semester = parseInt(row["semester"] || "0");
    const mentor = row["mentor"] || "";
    const attendance = parseFloat(row["attendance"] || "0");
    const marks = parseFloat(row["marks"] || "0");
    const failedSubjects = parseInt(row["failedsubjects"] || "0");
    const totalSubjects = parseInt(row["totalsubjects"] || "8");
    const feeStatus = (row["feestatus"] || "paid") as "paid" | "pending" | "overdue";
    const feeAmount = parseFloat(row["feeamount"] || "0");
    const trend = (row["trend"] || "stable") as "improving" | "declining" | "stable";

    if (!name) errors.push("Name is required");
    if (!rollNumber) errors.push("Roll number is required");
    if (isNaN(semester) || semester < 1) errors.push("Invalid semester");
    if (isNaN(attendance) || attendance < 0 || attendance > 100) errors.push("Attendance must be 0–100");
    if (isNaN(marks) || marks < 0 || marks > 100) errors.push("Marks must be 0–100");
    if (isNaN(failedSubjects) || failedSubjects < 0) errors.push("Invalid failed subjects");

    students.push({
      name,
      rollNumber,
      course,
      semester,
      mentor,
      attendance,
      marks,
      failedSubjects,
      totalSubjects,
      feeStatus: ["paid", "pending", "overdue"].includes(feeStatus) ? feeStatus : "paid",
      feeAmount,
      trend: ["improving", "declining", "stable"].includes(trend) ? trend : "stable",
      _rowIndex: i,
      _errors: errors.length > 0 ? errors : undefined,
    });
  }

  return students;
}

export default function UploadPage() {
  const bulkCreate = useMutation(api.students.bulkCreate);

  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedStudent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ count: number } | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setParsed(null);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const students = parseCSV(text);
        setParsed(students);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse CSV file");
      }
    };
    reader.readAsText(selected);
  }, []);

  const validStudents = (parsed ?? []).filter((s) => !s._errors || s._errors.length === 0);
  const invalidStudents = (parsed ?? []).filter((s) => s._errors && s._errors.length > 0);

  const handleImport = async () => {
    if (validStudents.length === 0) return;
    setImporting(true);
    try {
      const count = await bulkCreate({
        students: validStudents.map(({ _rowIndex, _errors, ...rest }) => rest),
      });
      setResult({ count });
      setParsed(null);
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsed(null);
    setError(null);
    setResult(null);
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight sm:text-xl">Upload Data</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Import student records via CSV to update risk scores
          </p>
        </div>

        {/* CSV Template Download */}
        <Card className="border-white/[0.06] bg-card/40">
          <CardContent className="flex items-center gap-3 p-4">
            <FileSpreadsheet className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">CSV Format</p>
              <p className="text-xs text-muted-foreground">
                Required columns: name, rollNumber, course, semester, mentor, attendance, marks, failedSubjects
              </p>
              <p className="text-xs text-muted-foreground">
                Optional: totalSubjects, feeStatus (paid/pending/overdue), feeAmount, trend (improving/declining/stable)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={() => {
                const csv = "name,rollNumber,course,semester,mentor,attendance,marks,failedSubjects,totalSubjects,feeStatus,feeAmount,trend\nRahul Sharma,CS-2023-042,B.Tech Computer Science,5,Dr. Anand Verma,48,32,4,8,overdue,45000,declining\nPriya Patel,CS-2023-017,B.Tech Computer Science,5,Prof. Meena Iyer,62,41,2,8,pending,22500,declining";
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "pathway-students-template.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-3.5 w-3.5" />
              Download Template
            </Button>
          </CardContent>
        </Card>

        {/* Upload Area */}
        {!parsed && !result && (
          <Card className="border-white/[0.06] bg-card/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="mt-4 text-sm font-medium">Upload a CSV file</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Select a CSV file containing student data
              </p>
              <label className="mt-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Choose CSV File
                </Button>
              </label>
              {file && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Selected: {file.name}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-risk-high/20 bg-risk-high/[0.05] p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-risk-high shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-risk-high">Import Error</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Preview */}
        {parsed && !result && (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/20 bg-primary/[0.05] p-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">
                    {validStudents.length} valid student{validStudents.length !== 1 ? "s" : ""} found
                  </p>
                  {invalidStudents.length > 0 && (
                    <p className="text-xs text-risk-high">
                      {invalidStudents.length} row{invalidStudents.length !== 1 ? "s" : ""} with errors (skipped)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Table */}
            {validStudents.length > 0 && (
              <Card className="border-white/[0.06] bg-card/40">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="px-3 py-2 text-[10px] font-medium text-muted-foreground">Name</th>
                          <th className="px-3 py-2 text-[10px] font-medium text-muted-foreground">Roll No.</th>
                          <th className="px-3 py-2 text-[10px] font-medium text-muted-foreground">Attendance</th>
                          <th className="px-3 py-2 text-[10px] font-medium text-muted-foreground">Marks</th>
                          <th className="px-3 py-2 text-[10px] font-medium text-muted-foreground">Fee</th>
                          <th className="px-3 py-2 text-[10px] font-medium text-muted-foreground">Risk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validStudents.map((s, i) => {
                          const risk = calculateRisk(s);
                          return (
                            <tr key={i} className="border-b border-white/[0.04]">
                              <td className="px-3 py-2 text-xs font-medium">{s.name}</td>
                              <td className="px-3 py-2 text-xs text-muted-foreground font-mono">{s.rollNumber}</td>
                              <td className="px-3 py-2 text-xs">{s.attendance}%</td>
                              <td className="px-3 py-2 text-xs">{s.marks}%</td>
                              <td className="px-3 py-2">
                                <span className={`text-[10px] font-medium ${s.feeStatus === "paid" ? "text-risk-low" : s.feeStatus === "pending" ? "text-risk-medium" : "text-risk-high"}`}>
                                  {s.feeStatus}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <span className={`text-xs font-bold ${risk.riskLevel === "high" ? "text-risk-high" : risk.riskLevel === "medium" ? "text-risk-medium" : "text-risk-low"}`}>
                                  {risk.riskScore}% — {risk.riskLevel === "high" ? "Needs Attention" : risk.riskLevel === "medium" ? "Monitor" : "On Track"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Invalid Rows */}
            {invalidStudents.length > 0 && (
              <Card className="border-risk-high/20 bg-risk-high/[0.03]">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-risk-high mb-2">Rows with errors:</p>
                  {invalidStudents.map((s, i) => (
                    <p key={i} className="text-[11px] text-muted-foreground">
                      Row {s._rowIndex}: {s._errors?.join(", ")}
                    </p>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleImport}
                disabled={validStudents.length === 0 || importing}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Import {validStudents.length} Student{validStudents.length !== 1 ? "s" : ""}
              </Button>
              <Button variant="outline" onClick={handleReset} className="border-white/[0.1]">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Success */}
        {result && (
          <div className="space-y-4">
            <div className="rounded-xl border border-risk-low/20 bg-risk-low/[0.05] p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-risk-low" />
                <div>
                  <p className="font-semibold text-risk-low">Import Complete</p>
                  <p className="text-sm text-muted-foreground">
                    {result.count} student{result.count !== 1 ? "s" : ""} imported with risk scores calculated.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  variant="outline"
                  className="gap-2 border-white/[0.1] bg-white/[0.03]"
                  onClick={() => window.location.href = "/dashboard"}
                >
                  View Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                  Import More
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
