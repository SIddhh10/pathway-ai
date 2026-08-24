export type RiskLevel = "low" | "medium" | "high";

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  course: string;
  semester: number;
  mentor: string;
  attendance: number;
  averageMarks: number;
  subjectsFailed: number;
  totalSubjects: number;
  feeStatus: "paid" | "pending" | "overdue";
  feeAmount: number;
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
  recommendedAction: string;
  trend: "improving" | "declining" | "stable";
  lastUpdated: string;
}

export interface CounsellingSession {
  id: string;
  studentId: string;
  studentName: string;
  mentorName: string;
  date: string;
  time: string;
  riskLevel: RiskLevel;
  status: "scheduled" | "completed" | "cancelled" | "pending";
  notes?: string;
}

export interface Notification {
  id: string;
  type: "alert" | "warning" | "improvement" | "info";
  title: string;
  message: string;
  timestamp: string;
  studentId?: string;
  read: boolean;
}

export const students: Student[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    rollNumber: "CS-2023-042",
    course: "B.Tech Computer Science",
    semester: 5,
    mentor: "Dr. Anand Verma",
    attendance: 48,
    averageMarks: 32,
    subjectsFailed: 4,
    totalSubjects: 8,
    feeStatus: "overdue",
    feeAmount: 45000,
    riskScore: 92,
    riskLevel: "high",
    riskFactors: [
      "Attendance below 50% since mid-July",
      "Failed 4 subjects this semester",
      "Test scores have dropped each month since semester start",
      "Fee payment overdue by 2 months",
      "Has not responded to 2 previous counselling emails",
    ],
    recommendedAction:
      "Meet with Rahul and his parents this week. Discuss attendance plan and fee deadline. Assign a peer study partner for the 4 failed subjects.",
    trend: "declining",
    lastUpdated: "2026-08-20",
  },
  {
    id: "2",
    name: "Priya Patel",
    rollNumber: "CS-2023-017",
    course: "B.Tech Computer Science",
    semester: 5,
    mentor: "Prof. Meena Iyer",
    attendance: 62,
    averageMarks: 41,
    subjectsFailed: 2,
    totalSubjects: 8,
    feeStatus: "pending",
    feeAmount: 22500,
    riskScore: 78,
    riskLevel: "high",
    riskFactors: [
      "Attendance dropped below 65% this month",
      "Failed 2 core subjects (Data Structures, OS)",
      "Mid-term marks 18% lower than last semester",
      "Fee payment pending for current semester",
    ],
    recommendedAction:
      "Schedule a one-on-one meeting within 3 days. Check in on personal circumstances. Follow up on fee payment with accounts.",
    trend: "declining",
    lastUpdated: "2026-08-19",
  },
  {
    id: "3",
    name: "Arjun Singh",
    rollNumber: "EE-2023-089",
    course: "B.Tech Electrical Engineering",
    semester: 5,
    mentor: "Dr. Rajesh Kumar",
    attendance: 71,
    averageMarks: 48,
    subjectsFailed: 1,
    totalSubjects: 8,
    feeStatus: "paid",
    feeAmount: 0,
    riskScore: 58,
    riskLevel: "medium",
    riskFactors: [
      "Attendance at 71% — slightly below the 75% threshold",
      "Failed 1 supplementary subject (Signals & Systems)",
      "Test performance has been inconsistent",
    ],
    recommendedAction:
      "Check in during next weekly mentor meeting. Share supplementary study materials. Monitor attendance over the next 2 weeks.",
    trend: "improving",
    lastUpdated: "2026-08-18",
  },
  {
    id: "4",
    name: "Sneha Verma",
    rollNumber: "CS-2023-005",
    course: "B.Tech Computer Science",
    semester: 5,
    mentor: "Dr. Anand Verma",
    attendance: 91,
    averageMarks: 78,
    subjectsFailed: 0,
    totalSubjects: 8,
    feeStatus: "paid",
    feeAmount: 0,
    riskScore: 12,
    riskLevel: "low",
    riskFactors: [],
    recommendedAction: "No action needed — student is performing well.",
    trend: "stable",
    lastUpdated: "2026-08-20",
  },
  {
    id: "5",
    name: "Vikram Reddy",
    rollNumber: "ME-2023-033",
    course: "B.Tech Mechanical Engineering",
    semester: 5,
    mentor: "Prof. Suresh Nair",
    attendance: 55,
    averageMarks: 38,
    subjectsFailed: 3,
    totalSubjects: 8,
    feeStatus: "overdue",
    feeAmount: 35000,
    riskScore: 85,
    riskLevel: "high",
    riskFactors: [
      "Attendance critically low at 55%",
      "Failed 3 subjects including Thermodynamics",
      "Marks dropped 25% from last semester",
      "Fee payment overdue",
      "Lab submissions irregular for the past month",
    ],
    recommendedAction:
      "Urgent meeting with Vikram and department head. Contact parents. Set up daily attendance tracking and assign a peer tutor for labs.",
    trend: "declining",
    lastUpdated: "2026-08-20",
  },
  {
    id: "6",
    name: "Ananya Gupta",
    rollNumber: "CE-2023-061",
    course: "B.Tech Civil Engineering",
    semester: 5,
    mentor: "Dr. Kavita Sharma",
    attendance: 78,
    averageMarks: 55,
    subjectsFailed: 1,
    totalSubjects: 8,
    feeStatus: "paid",
    feeAmount: 0,
    riskScore: 45,
    riskLevel: "medium",
    riskFactors: [
      "Failed 1 theoretical subject (Structural Analysis)",
      "Attendance slightly below the 80% target",
    ],
    recommendedAction:
      "Bi-weekly check-in. Share notes from the Structural Analysis remedial class. Ask about upcoming test preparation.",
    trend: "stable",
    lastUpdated: "2026-08-17",
  },
  {
    id: "7",
    name: "Karthik Menon",
    rollNumber: "EE-2023-112",
    course: "B.Tech Electrical Engineering",
    semester: 5,
    mentor: "Dr. Rajesh Kumar",
    attendance: 88,
    averageMarks: 72,
    subjectsFailed: 0,
    totalSubjects: 8,
    feeStatus: "paid",
    feeAmount: 0,
    riskScore: 15,
    riskLevel: "low",
    riskFactors: [],
    recommendedAction: "No action needed — student is on track.",
    trend: "improving",
    lastUpdated: "2026-08-20",
  },
  {
    id: "8",
    name: "Deepa Krishnan",
    rollNumber: "CS-2023-028",
    course: "B.Tech Computer Science",
    semester: 5,
    mentor: "Prof. Meena Iyer",
    attendance: 58,
    averageMarks: 42,
    subjectsFailed: 2,
    totalSubjects: 8,
    feeStatus: "pending",
    feeAmount: 18000,
    riskScore: 72,
    riskLevel: "high",
    riskFactors: [
      "Attendance below 60% for 3 consecutive weeks",
      "Failed 2 programming subjects",
      "Declining trend since semester start",
      "Fee payment pending",
    ],
    recommendedAction:
      "Meet within 2 days. Ask about personal challenges. Pair with a lab partner. Follow up on fee payment.",
    trend: "declining",
    lastUpdated: "2026-08-19",
  },
  {
    id: "9",
    name: "Mohit Joshi",
    rollNumber: "ME-2023-076",
    course: "B.Tech Mechanical Engineering",
    semester: 5,
    mentor: "Prof. Suresh Nair",
    attendance: 82,
    averageMarks: 61,
    subjectsFailed: 0,
    totalSubjects: 8,
    feeStatus: "paid",
    feeAmount: 0,
    riskScore: 28,
    riskLevel: "low",
    riskFactors: ["Attendance could be improved"],
    recommendedAction: "Encourage Mohit to attend more consistently. No immediate concern.",
    trend: "stable",
    lastUpdated: "2026-08-18",
  },
  {
    id: "10",
    name: "Pooja Deshmukh",
    rollNumber: "CE-2023-094",
    course: "B.Tech Civil Engineering",
    semester: 5,
    mentor: "Dr. Kavita Sharma",
    attendance: 44,
    averageMarks: 35,
    subjectsFailed: 3,
    totalSubjects: 8,
    feeStatus: "overdue",
    feeAmount: 40000,
    riskScore: 88,
    riskLevel: "high",
    riskFactors: [
      "Attendance at 44% — lowest in the cohort",
      "Failed 3 subjects including 2 core courses",
      "Fee payment severely overdue",
      "No improvement despite two prior counselling sessions",
      "Personal difficulties reported by department office",
    ],
    recommendedAction:
      "Emergency meeting with department head, mentor, and guardian. Create a support plan covering academics, finances, and personal welfare.",
    trend: "declining",
    lastUpdated: "2026-08-20",
  },
  {
    id: "11",
    name: "Aditya Rao",
    rollNumber: "CS-2023-055",
    course: "B.Tech Computer Science",
    semester: 5,
    mentor: "Dr. Anand Verma",
    attendance: 75,
    averageMarks: 52,
    subjectsFailed: 1,
    totalSubjects: 8,
    feeStatus: "paid",
    feeAmount: 0,
    riskScore: 48,
    riskLevel: "medium",
    riskFactors: [
      "Failed 1 elective subject",
      "Attendance right at the borderline",
    ],
    recommendedAction: "Monitor closely. Discuss study strategies for the elective in the next mentor meeting.",
    trend: "stable",
    lastUpdated: "2026-08-16",
  },
  {
    id: "12",
    name: "Nisha Agarwal",
    rollNumber: "EE-2023-008",
    course: "B.Tech Electrical Engineering",
    semester: 5,
    mentor: "Dr. Rajesh Kumar",
    attendance: 93,
    averageMarks: 85,
    subjectsFailed: 0,
    totalSubjects: 8,
    feeStatus: "paid",
    feeAmount: 0,
    riskScore: 8,
    riskLevel: "low",
    riskFactors: [],
    recommendedAction: "No action needed — excellent performance.",
    trend: "improving",
    lastUpdated: "2026-08-20",
  },
];

export const counsellingSessions: CounsellingSession[] = [
  {
    id: "c1",
    studentId: "1",
    studentName: "Rahul Sharma",
    mentorName: "Dr. Anand Verma",
    date: "2026-08-26",
    time: "10:00 AM",
    riskLevel: "high",
    status: "scheduled",
    notes: "Discuss attendance recovery plan and fee deadline. Guardian to attend.",
  },
  {
    id: "c2",
    studentId: "5",
    studentName: "Vikram Reddy",
    mentorName: "Prof. Suresh Nair",
    date: "2026-08-26",
    time: "2:00 PM",
    riskLevel: "high",
    status: "scheduled",
    notes: "Urgent: lab submissions overdue. Review failed subjects and set weekly targets.",
  },
  {
    id: "c3",
    studentId: "10",
    studentName: "Pooja Deshmukh",
    mentorName: "Dr. Kavita Sharma",
    date: "2026-08-27",
    time: "11:00 AM",
    riskLevel: "high",
    status: "scheduled",
    notes: "Emergency meeting — personal circumstances affecting attendance. Guardian and dept. head invited.",
  },
  {
    id: "c4",
    studentId: "2",
    studentName: "Priya Patel",
    mentorName: "Prof. Meena Iyer",
    date: "2026-08-27",
    time: "3:00 PM",
    riskLevel: "high",
    status: "pending",
    notes: "Check on personal circumstances. Discuss fee payment and exam preparation.",
  },
  {
    id: "c5",
    studentId: "8",
    studentName: "Deepa Krishnan",
    mentorName: "Prof. Meena Iyer",
    date: "2026-08-28",
    time: "10:30 AM",
    riskLevel: "high",
    status: "scheduled",
    notes: "Review programming subject performance. Arrange peer lab partner.",
  },
  {
    id: "c6",
    studentId: "3",
    studentName: "Arjun Singh",
    mentorName: "Dr. Rajesh Kumar",
    date: "2026-08-25",
    time: "11:00 AM",
    riskLevel: "medium",
    status: "completed",
    notes: "Arjun has been attending more regularly. Shared supplementary notes for Signals & Systems. Will follow up next week.",
  },
  {
    id: "c7",
    studentId: "6",
    studentName: "Ananya Gupta",
    mentorName: "Dr. Kavita Sharma",
    date: "2026-08-24",
    time: "2:30 PM",
    riskLevel: "medium",
    status: "completed",
    notes: "Discussed Structural Analysis study plan. Ananya seems motivated but needs better time management.",
  },
  {
    id: "c8",
    studentId: "11",
    studentName: "Aditya Rao",
    mentorName: "Dr. Anand Verma",
    date: "2026-08-29",
    time: "9:00 AM",
    riskLevel: "medium",
    status: "scheduled",
    notes: "Review elective subject performance. Discuss study strategies.",
  },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    type: "alert",
    title: "Needs Attention",
    message: "Rahul Sharma's risk score increased from 75% to 92%. Attendance has dropped below 50% — counselling meeting scheduled for Monday.",
    timestamp: "2 hours ago",
    studentId: "1",
    read: false,
  },
  {
    id: "n2",
    type: "alert",
    title: "Needs Attention",
    message: "Pooja Deshmukh's attendance dropped to 44%. Third counselling session is scheduled for Wednesday with department head.",
    timestamp: "3 hours ago",
    studentId: "10",
    read: false,
  },
  {
    id: "n3",
    type: "warning",
    title: "Monitor",
    message: "Priya Patel's attendance dropped below 65% this month. Fee payment is also pending — consider a combined check-in.",
    timestamp: "5 hours ago",
    studentId: "2",
    read: false,
  },
  {
    id: "n4",
    type: "warning",
    title: "Fee Overdue",
    message: "Vikram Reddy has an overdue fee payment of ₹35,000. Risk score adjusted upward accordingly.",
    timestamp: "1 day ago",
    studentId: "5",
    read: true,
  },
  {
    id: "n5",
    type: "improvement",
    title: "Improving",
    message: "Arjun Singh improved attendance by 12% this month after last week's counselling session. Risk score dropped from 65% to 58%.",
    timestamp: "1 day ago",
    studentId: "3",
    read: true,
  },
  {
    id: "n6",
    type: "improvement",
    title: "On Track",
    message: "Karthik Menon's recent test scores show steady improvement. Maintaining low-risk status.",
    timestamp: "2 days ago",
    studentId: "7",
    read: true,
  },
  {
    id: "n7",
    type: "info",
    title: "System",
    message: "Risk scores updated for all students following this week's data import. 3 students moved between risk tiers.",
    timestamp: "3 days ago",
    read: true,
  },
  {
    id: "n8",
    type: "warning",
    title: "Monitor",
    message: "Deepa Krishnan's programming scores have declined for 3 consecutive assessments. Peer tutoring arranged.",
    timestamp: "3 days ago",
    studentId: "8",
    read: true,
  },
];

export const dashboardStats = {
  totalStudents: 1250,
  lowRisk: 850,
  mediumRisk: 280,
  highRisk: 120,
  recentAlerts: 12,
  counsellingScheduled: 8,
  improvementDetected: 45,
  dataSourcesConnected: 4,
};

export const monthlyTrendData = [
  { month: "Mar", high: 95, medium: 240, low: 915 },
  { month: "Apr", high: 102, medium: 255, low: 893 },
  { month: "May", high: 110, medium: 268, low: 872 },
  { month: "Jun", high: 115, medium: 275, low: 860 },
  { month: "Jul", high: 118, medium: 278, low: 854 },
  { month: "Aug", high: 120, medium: 280, low: 850 },
];

export const riskDistribution = [
  { name: "On Track", value: 850, color: "oklch(0.7 0.2 150)" },
  { name: "Monitor", value: 280, color: "oklch(0.75 0.18 70)" },
  { name: "Needs Attention", value: 120, color: "oklch(0.6 0.22 25)" },
];

export const attendancePerformanceData = [
  { attendance: 95, performance: 88 },
  { attendance: 90, performance: 82 },
  { attendance: 85, performance: 75 },
  { attendance: 80, performance: 68 },
  { attendance: 75, performance: 60 },
  { attendance: 70, performance: 55 },
  { attendance: 65, performance: 48 },
  { attendance: 60, performance: 42 },
  { attendance: 55, performance: 38 },
  { attendance: 50, performance: 32 },
  { attendance: 45, performance: 28 },
];
