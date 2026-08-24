import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  BrainCircuit,
  Loader2,
  ArrowRight,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const uploadCards = [
  {
    id: "attendance",
    title: "Attendance Spreadsheet",
    desc: "Upload student attendance records (CSV or Excel)",
    icon: FileSpreadsheet,
    uploaded: true,
  },
  {
    id: "marks",
    title: "Test Marks Spreadsheet",
    desc: "Upload test and exam marks data",
    icon: FileSpreadsheet,
    uploaded: true,
  },
  {
    id: "subjects",
    title: "Subject Attempt History",
    desc: "Upload subject-wise attempt and result history",
    icon: FileSpreadsheet,
    uploaded: false,
  },
  {
    id: "fees",
    title: "Fee Payment Records",
    desc: "Upload fee payment and dues information",
    icon: FileSpreadsheet,
    uploaded: true,
  },
];

export default function UploadPage() {
  const [uploads, setUploads] = useState(
    uploadCards.map((c) => ({ ...c }))
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleUpload = (id: string) => {
    setUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, uploaded: true } : u))
    );
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setComplete(false);
    setTimeout(() => {
      setAnalyzing(false);
      setComplete(true);
    }, 4000);
  };

  const allUploaded = uploads.every((u) => u.uploaded);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Data</h1>
          <p className="text-sm text-muted-foreground">
            Import student records for risk analysis
          </p>
        </div>

        {/* Upload Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {uploads.map((card) => (
            <Card
              key={card.id}
              className="border-white/[0.06] bg-card/60 backdrop-blur-sm transition-all duration-200 hover:border-white/[0.1]"
            >
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{card.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {card.desc}
                  </p>
                  <div className="mt-3">
                    {card.uploaded ? (
                      <div className="flex items-center gap-1.5 text-xs text-risk-low">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Uploaded & ready
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpload(card.id)}
                        className="gap-1.5 border-white/[0.1] bg-white/[0.03] text-xs"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload File
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Banner */}
        {allUploaded && !analyzing && (
          <div className="rounded-xl border border-risk-low/20 bg-risk-low/[0.05] p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-risk-low" />
              <div>
                <p className="text-sm font-semibold text-risk-low">
                  Data Successfully Integrated
                </p>                  <p className="text-xs text-muted-foreground">
                    All datasets are integrated. Run the prediction model to update
                    risk scores across every student.
                  </p>
              </div>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        {allUploaded && !analyzing && !complete && (
          <Button
            onClick={handleAnalyze}
            size="lg"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <BrainCircuit className="h-5 w-5" />
            Run AI Risk Analysis
          </Button>
        )}

        {/* Loading Animation */}
        {analyzing && (
          <Card className="border-white/[0.06] bg-card/60 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <BrainCircuit className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <div className="mt-8 text-center">                    <p className="text-sm font-semibold" id="analyzing-text">
                      Processing student records...
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Model is evaluating patterns and recalculating risk scores
                    </p>
              </div>
              <div className="mt-6 flex flex-col items-center gap-2 text-xs text-muted-foreground">
                <AnalyzingStep text="Analysing attendance patterns..." delay={0} />
                <AnalyzingStep text="Detecting academic decline..." delay={800} />
                <AnalyzingStep text="Evaluating financial indicators..." delay={1600} />
                <AnalyzingStep text="Computing dropout risk scores..." delay={2400} />
                <AnalyzingStep text="Generating intervention recommendations..." delay={3200} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete */}
        {complete && (
          <div className="space-y-4">
            <div className="rounded-xl border border-risk-low/20 bg-risk-low/[0.05] p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-risk-low" />
                <div>
                  <p className="font-semibold text-risk-low">
                    Analysis Complete
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Risk scores computed for 1,250 students. Results are reflected
                    on the dashboard.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4 gap-2 border-white/[0.1] bg-white/[0.03]"
                onClick={() => window.location.href = "/dashboard"}
              >
                View Dashboard Results
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function AnalyzingStep({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useState(() => {
    const t1 = setTimeout(() => setVisible(true), delay);
    const t2 = setTimeout(() => setDone(true), delay + 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  });

  if (!visible) return null;

  return (
    <div className={`flex items-center gap-2 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
      {done ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-risk-low" />
      ) : (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
      )}
      <span className={done ? "text-risk-low" : ""}>{text}</span>
    </div>
  );
}
