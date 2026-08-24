import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  Shield,
  ArrowRight,
  Upload,
  BarChart3,
  AlertTriangle,
  MessageSquareWarning,
  Bell,
  Eye,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const steps = [
  {
    icon: Upload,
    title: "Upload student data",
    desc: "Import attendance records, exam scores, subject histories, and fee status from your existing spreadsheets.",
  },
  {
    icon: BarChart3,
    title: "Review the risk overview",
    desc: "Students are grouped into On Track, Monitor, and Needs Attention based on the data you provide.",
  },
  {
    icon: MessageSquareWarning,
    title: "Follow up with students",
    desc: "Schedule counselling sessions, notify mentors and guardians, and track progress over time.",
  },
];

const features = [
  {
    icon: BarChart3,
    title: "All student data in one place",
    desc: "Attendance, marks, subject attempts, and fee records brought together in a single view instead of scattered spreadsheets.",
  },
  {
    icon: AlertTriangle,
    title: "Clear risk indicators",
    desc: "On Track, Monitor, and Needs Attention — simple labels that tell you at a glance where to focus.",
  },
  {
    icon: Eye,
    title: "Transparent reasoning",
    desc: "Every student's risk level comes with the specific reasons behind it — attendance, failed subjects, fee status — so you can trust and explain the output.",
  },
  {
    icon: Bell,
    title: "Automatic alerts",
    desc: "When a student's situation changes — attendance drops, a subject is failed — mentors and guardians are notified.",
  },
  {
    icon: MessageSquareWarning,
    title: "Counselling tracker",
    desc: "Schedule upcoming sessions, log notes from meetings, and keep a record of what was discussed and agreed.",
  },
  {
    icon: GraduationCap,
    title: "Built for real institutions",
    desc: "Designed for public technical institutes that need a practical tool, not an expensive analytics platform.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Subtle background accent */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-20 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute right-1/4 top-40 h-[400px] w-[400px] rounded-full bg-accent/[0.03] blur-[120px]" />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 sm:px-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
            <Shield className="h-4.5 w-4.5 text-primary" />
          </div>
          <span className="text-base font-semibold tracking-tight">PathWay</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/auth")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate("/auth")}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get Started
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 px-5 pt-16 pb-20 sm:px-10 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Helping every student
            <br />
            <span className="text-gradient-blue">stay on track.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:mt-6 sm:text-base lg:text-lg"
          >
            PathWay helps mentors and counsellors spot students who are falling
            behind — so they can step in early with the right support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-7"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="border-white/[0.1] bg-white/[0.02]"
            >
              View Dashboard
            </Button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto mt-10 max-w-3xl sm:mt-14"
          >
            <div className="rounded-xl border border-white/[0.08] bg-card/50 p-1">
              <div className="rounded-lg bg-background/80 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">Student Risk Overview</h3>
                    <p className="text-xs text-muted-foreground">August 2026 — 1,250 students</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-risk-low" />
                    <div className="h-2 w-2 rounded-full bg-risk-medium" />
                    <div className="h-2 w-2 rounded-full bg-risk-high" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Total", value: "1,250" },
                    { label: "On Track", value: "850", color: "text-risk-low" },
                    { label: "Monitor", value: "280", color: "text-risk-medium" },
                    { label: "Needs Attention", value: "120", color: "text-risk-high" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-md border border-white/[0.06] bg-white/[0.02] p-2.5">
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      <p className={`text-base font-bold ${s.color || "text-foreground"}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-5 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base">
              Three steps from uploaded spreadsheets to student support
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="rounded-xl border border-white/[0.06] bg-card/40 p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="mb-1.5 text-xs font-medium text-primary/80">Step {i + 1}</div>
                  <h3 className="mb-2 text-sm font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-5 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What PathWay does</h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base">
              The essentials for understanding and acting on student risk
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border border-white/[0.06] bg-card/40 p-5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-5 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Start supporting students today
            </h2>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">
              PathWay is a practical tool for public technical institutes that want
              to identify struggling students early and provide timely support.
            </p>
            <div className="mt-7">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-7"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-7 sm:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs text-muted-foreground">
            PathWay — helping institutions identify risk early and support every student through to graduation.
          </p>
          <p className="mt-1.5 text-[11px] text-muted-foreground/50">
            © 2026 PathWay
          </p>
        </div>
      </footer>
    </div>
  );
}
