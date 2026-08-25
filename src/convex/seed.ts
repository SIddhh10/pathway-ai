import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { calculateRisk } from "../lib/risk-calculation";

const demoStudents = [
  {
    name: "Rahul Sharma",
    rollNumber: "CS-2023-042",
    course: "B.Tech Computer Science",
    semester: 5,
    mentor: "Dr. Anand Verma",
    attendance: 48,
    marks: 32,
    failedSubjects: 4,
    totalSubjects: 8,
    feeStatus: "overdue" as const,
    feeAmount: 45000,
    trend: "declining" as const,
  },
  {
    name: "Priya Patel",
    rollNumber: "CS-2023-017",
    course: "B.Tech Computer Science",
    semester: 5,
    mentor: "Prof. Meena Iyer",
    attendance: 62,
    marks: 41,
    failedSubjects: 2,
    totalSubjects: 8,
    feeStatus: "pending" as const,
    feeAmount: 22500,
    trend: "declining" as const,
  },
  {
    name: "Arjun Singh",
    rollNumber: "EE-2023-089",
    course: "B.Tech Electrical Engineering",
    semester: 5,
    mentor: "Dr. Rajesh Kumar",
    attendance: 71,
    marks: 48,
    failedSubjects: 1,
    totalSubjects: 8,
    feeStatus: "paid" as const,
    feeAmount: 0,
    trend: "improving" as const,
  },
  {
    name: "Sneha Verma",
    rollNumber: "CS-2023-005",
    course: "B.Tech Computer Science",
    semester: 5,
    mentor: "Dr. Anand Verma",
    attendance: 91,
    marks: 78,
    failedSubjects: 0,
    totalSubjects: 8,
    feeStatus: "paid" as const,
    feeAmount: 0,
    trend: "stable" as const,
  },
  {
    name: "Vikram Reddy",
    rollNumber: "ME-2023-033",
    course: "B.Tech Mechanical Engineering",
    semester: 5,
    mentor: "Prof. Suresh Nair",
    attendance: 55,
    marks: 38,
    failedSubjects: 3,
    totalSubjects: 8,
    feeStatus: "overdue" as const,
    feeAmount: 35000,
    trend: "declining" as const,
  },
  {
    name: "Ananya Gupta",
    rollNumber: "CE-2023-061",
    course: "B.Tech Civil Engineering",
    semester: 5,
    mentor: "Dr. Kavita Sharma",
    attendance: 78,
    marks: 55,
    failedSubjects: 1,
    totalSubjects: 8,
    feeStatus: "paid" as const,
    feeAmount: 0,
    trend: "stable" as const,
  },
  {
    name: "Karthik Menon",
    rollNumber: "EE-2023-112",
    course: "B.Tech Electrical Engineering",
    semester: 5,
    mentor: "Dr. Rajesh Kumar",
    attendance: 88,
    marks: 72,
    failedSubjects: 0,
    totalSubjects: 8,
    feeStatus: "paid" as const,
    feeAmount: 0,
    trend: "improving" as const,
  },
  {
    name: "Deepa Krishnan",
    rollNumber: "CS-2023-028",
    course: "B.Tech Computer Science",
    semester: 5,
    mentor: "Prof. Meena Iyer",
    attendance: 58,
    marks: 42,
    failedSubjects: 2,
    totalSubjects: 8,
    feeStatus: "pending" as const,
    feeAmount: 18000,
    trend: "declining" as const,
  },
  {
    name: "Mohit Joshi",
    rollNumber: "ME-2023-076",
    course: "B.Tech Mechanical Engineering",
    semester: 5,
    mentor: "Prof. Suresh Nair",
    attendance: 82,
    marks: 61,
    failedSubjects: 0,
    totalSubjects: 8,
    feeStatus: "paid" as const,
    feeAmount: 0,
    trend: "stable" as const,
  },
  {
    name: "Pooja Deshmukh",
    rollNumber: "CE-2023-094",
    course: "B.Tech Civil Engineering",
    semester: 5,
    mentor: "Dr. Kavita Sharma",
    attendance: 44,
    marks: 35,
    failedSubjects: 3,
    totalSubjects: 8,
    feeStatus: "overdue" as const,
    feeAmount: 40000,
    trend: "declining" as const,
  },
  {
    name: "Aditya Rao",
    rollNumber: "CS-2023-055",
    course: "B.Tech Computer Science",
    semester: 5,
    mentor: "Dr. Anand Verma",
    attendance: 75,
    marks: 52,
    failedSubjects: 1,
    totalSubjects: 8,
    feeStatus: "paid" as const,
    feeAmount: 0,
    trend: "stable" as const,
  },
  {
    name: "Nisha Agarwal",
    rollNumber: "EE-2023-008",
    course: "B.Tech Electrical Engineering",
    semester: 5,
    mentor: "Dr. Rajesh Kumar",
    attendance: 93,
    marks: 85,
    failedSubjects: 0,
    totalSubjects: 8,
    feeStatus: "paid" as const,
    feeAmount: 0,
    trend: "improving" as const,
  },
];

/**
 * Seed the database with demo students for the current user.
 * Skips if students already exist.
 */
export const seedStudents = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user already has students
    const existing = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) return { seeded: false, message: "Students already exist" };

    const now = new Date().toISOString().split("T")[0];
    let count = 0;

    for (const s of demoStudents) {
      const risk = calculateRisk(s);
      await ctx.db.insert("students", {
        userId,
        ...s,
        ...risk,
        lastUpdated: now,
      });
      count++;
    }

    // Create some counselling sessions
    const studentIds = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const highRisk = studentIds.filter((s) => s.riskLevel === "high");
    const medRisk = studentIds.filter((s) => s.riskLevel === "medium");

    if (highRisk.length > 0) {
      await ctx.db.insert("counsellingSessions", {
        userId,
        studentId: highRisk[0]._id,
        studentName: highRisk[0].name,
        mentorName: highRisk[0].mentor,
        date: "2026-08-26",
        time: "10:00 AM",
        riskLevel: "high",
        status: "scheduled",
        notes: "Discuss attendance recovery plan and fee deadline.",
      });
    }

    if (highRisk.length > 1) {
      await ctx.db.insert("counsellingSessions", {
        userId,
        studentId: highRisk[1]._id,
        studentName: highRisk[1].name,
        mentorName: highRisk[1].mentor,
        date: "2026-08-27",
        time: "2:00 PM",
        riskLevel: "high",
        status: "scheduled",
        notes: "Check on personal circumstances and fee payment.",
      });
    }

    if (medRisk.length > 0) {
      await ctx.db.insert("counsellingSessions", {
        userId,
        studentId: medRisk[0]._id,
        studentName: medRisk[0].name,
        mentorName: medRisk[0].mentor,
        date: "2026-08-25",
        time: "11:00 AM",
        riskLevel: "medium",
        status: "completed",
        notes: "Shared supplementary study materials. Will follow up next week.",
      });
    }

    // Create some notifications
    if (highRisk.length > 0) {
      await ctx.db.insert("notifications", {
        userId,
        type: "alert",
        title: "Needs Attention",
        message: `${highRisk[0].name}'s attendance has dropped below 50%. Counselling meeting recommended.`,
        studentId: highRisk[0]._id,
        read: false,
      });
    }

    if (medRisk.length > 0) {
      await ctx.db.insert("notifications", {
        userId,
        type: "warning",
        title: "Monitor",
        message: `${medRisk[0].name}'s attendance is below the 75% threshold. Consider a check-in.`,
        studentId: medRisk[0]._id,
        read: false,
      });
    }

    await ctx.db.insert("notifications", {
      userId,
      type: "info",
      title: "System",
      message: `Demo data seeded successfully. ${count} students with calculated risk scores.`,
      read: true,
    });

    return { seeded: true, count };
  },
});
