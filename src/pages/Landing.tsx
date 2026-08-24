import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  Shield,
  Upload,
  BrainCircuit,
  AlertTriangle,
  MessageSquareWarning,
  BarChart3,
  Users,
  FileSpreadsheet,
  Bell,
  ArrowRight,
  GraduationCap,
  TrendingDown,
  Eye,
  CheckCircle2,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const steps = [
  {
    icon: Upload,
    title: "Upload Data",
    desc: "Attendance, marks, subject history and fee records",
  },
  {
    icon: BrainCircuit,
    title: "AI Analysis",
    desc: "Machine learning analyses multiple student factors",
  },
  {
    icon: AlertTriangle,
    title: "Risk Prediction",
    desc: "Students classified into Low, Medium, and High Risk",
  },
  {
    icon: MessageSquareWarning,
    title: "Early Counselling",
    desc: "Mentors and guardians receive timely alerts",
  },
];

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Based Dropout Prediction",
    desc: "ML models trained on historical patterns to predict at-risk students weeks before failure.",
  },
  {
    icon: BarChart3,
    title: "Unified Student Dashboard",
    desc: "All student data—in attendance, marks, fees—consolidated into a single view.",
  },
  {
    icon: AlertTriangle,
    title: "Colour-Coded Risk Levels",
    desc: "Intuitive green, yellow, and red indicators for instant risk assessment.",
  },
  {
    icon: Eye,
    title: "Explainable Risk Factors",
    desc: "Transparent AI decisions with clear reasoning behind every risk score.",
  },
  {
    icon: Bell,
    title: "Automated Mentor Alerts",
    desc: "Instant notifications to mentors when students cross risk thresholds.",
  },
  {
    icon: MessageSquareWarning,
    title: "Guardian Notifications",
    desc: "Keep parents informed and involved in the early intervention process.",
  },
];

function FloatingParticle({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -15, 0],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-20 h-[500px] w-[500px] rounded-full bg-primary/[0.07] blur-[120px]" />
        <div className="absolute right-1/4 top-40 h-[400px] w-[400px] rounded-full bg-accent/[0.06] blur-[120px]" />
        <FloatingParticle
          className="absolute left-[15%] top-[30%] h-2 w-2 rounded-full bg-primary/30"
          delay={0}
        />
        <FloatingParticle
          className="absolute left-[70%] top-[20%] h-1.5 w-1.5 rounded-full bg-accent/30"
          delay={1}
        />
        <FloatingParticle
          className="absolute left-[40%] top-[60%] h-1 w-1 rounded-full bg-primary/20"
          delay={2}
        />
        <FloatingParticle
          className="absolute left-[85%] top-[50%] h-2.5 w-2.5 rounded-full bg-accent/20"
          delay={0.5}
        />
        <FloatingParticle
          className="absolute left-[25%] top-[70%] h-1.5 w-1.5 rounded-full bg-primary/25"
          delay={1.5}
        />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 sm:px-10"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <Shield className="h-5.5 w-5.5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">EduShield AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/auth")}
            className="text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get Started
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32 sm:px-10 sm:pt-28 sm:pb-40">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <Zap className="h-3.5 w-3.5 text-primary" />
            AI-Powered Student Retention System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Predict Early.{" "}
            <span className="text-gradient-blue">Support Better.</span>
            <br />
            Prevent Dropouts.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            EduShield AI identifies students at risk using academic, attendance,
            financial, and performance data—helping mentors take action before it
            is too late.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06]"
            >
              View Dashboard
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Hero Visual - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <div className="glass rounded-2xl border border-white/[0.08] p-1 shadow-2xl shadow-primary/[0.08]">
              <div className="rounded-xl bg-background/80 p-6">
                {/* Mock dashboard header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">Risk Overview</h3>
                    <p className="text-xs text-muted-foreground">
                      1,250 students monitored
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-risk-low" />
                    <div className="h-2.5 w-2.5 rounded-full bg-risk-medium" />
                    <div className="h-2.5 w-2.5 rounded-full bg-risk-high" />
                  </div>
                </div>
                {/* Mock stat cards */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Total", value: "1,250", color: "text-foreground" },
                    { label: "Low Risk", value: "850", color: "text-risk-low" },
                    { label: "Med Risk", value: "280", color: "text-risk-medium" },
                    { label: "High Risk", value: "120", color: "text-risk-high" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                    >
                      <p className="text-[10px] text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className={`text-lg font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Mock chart bars */}
                <div className="mt-4 flex items-end gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                  {[65, 72, 58, 80, 75, 68, 85, 62, 70, 78, 55, 82].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-primary/30"
                        style={{ height: `${h * 0.6}px` }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/10 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground">
              From raw data to actionable insights in four steps
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                className="group relative"
              >
                <div className="glass rounded-xl p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.05]">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/70">
                    Step {i + 1}
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
                {/* Connector line for desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 w-6 border-t border-dashed border-primary/20" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Key Features
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to identify and support at-risk students
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="group glass rounded-xl p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.05]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="glass rounded-2xl p-8 sm:p-12">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                { value: "12,500+", label: "Students Monitored" },
                { value: "94%", label: "Prediction Accuracy" },
                { value: "35%", label: "Dropout Reduction" },
                { value: "200+", label: "Institutions" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-gradient-blue sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GraduationCap className="mx-auto mb-6 h-12 w-12 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Protect Your Students?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join hundreds of institutions using AI to identify at-risk students
              early and provide timely support.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm text-muted-foreground">
            Empowering institutions to identify risks early and support every
            student.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            © 2026 EduShield AI. Built for public technical institutes.
          </p>
        </div>
      </footer>
    </div>
  );
}
