import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { calculateRisk } from "../lib/risk-calculation";

// List all students for the current user, optionally filtered
export const list = query({
  args: {
    riskLevel: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    search: v.optional(v.string()),
    sortKey: v.optional(v.union(v.literal("riskScore"), v.literal("attendance"), v.literal("marks"))),
    sortDir: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let q = ctx.db.query("students").withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.riskLevel) {
      q = ctx.db.query("students").withIndex("by_risk_level", (q) =>
        q.eq("userId", userId).eq("riskLevel", args.riskLevel!)
      );
    }

    let results = await q.collect();

    // Search filter
    if (args.search) {
      const s = args.search.toLowerCase();
      results = results.filter(
        (st) =>
          st.name.toLowerCase().includes(s) ||
          st.rollNumber.toLowerCase().includes(s) ||
          st.course.toLowerCase().includes(s)
      );
    }

    // Sort
    const key = args.sortKey ?? "riskScore";
    const dir = args.sortDir ?? "desc";
    results.sort((a, b) => (dir === "desc" ? b[key] - a[key] : a[key] - b[key]));

    return results;
  },
});

// Get a single student by ID
export const get = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.studentId);
  },
});

// Get dashboard stats computed from real data
export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        totalStudents: 0,
        lowRisk: 0,
        mediumRisk: 0,
        highRisk: 0,
        improving: 0,
        declining: 0,
      };
    }

    const all = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return {
      totalStudents: all.length,
      lowRisk: all.filter((s) => s.riskLevel === "low").length,
      mediumRisk: all.filter((s) => s.riskLevel === "medium").length,
      highRisk: all.filter((s) => s.riskLevel === "high").length,
      improving: all.filter((s) => s.trend === "improving").length,
      declining: all.filter((s) => s.trend === "declining").length,
    };
  },
});

// Get risk distribution for charts
export const riskDistribution = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const all = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const onTrack = all.filter((s) => s.riskLevel === "low").length;
    const monitor = all.filter((s) => s.riskLevel === "medium").length;
    const needsAttention = all.filter((s) => s.riskLevel === "high").length;

    return [
      { name: "On Track", value: onTrack, color: "oklch(0.7 0.2 150)" },
      { name: "Monitor", value: monitor, color: "oklch(0.75 0.18 70)" },
      { name: "Needs Attention", value: needsAttention, color: "oklch(0.6 0.22 25)" },
    ];
  },
});

// Get attendance vs marks data for scatter chart
export const attendancePerformanceData = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const all = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return all.map((s) => ({ attendance: s.attendance, performance: s.marks }));
  },
});

// Get students needing attention (top high-risk)
export const urgentStudents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const limit = args.limit ?? 5;

    const all = await ctx.db
      .query("students")
      .withIndex("by_risk_level", (q) => q.eq("userId", userId).eq("riskLevel", "high"))
      .collect();

    return all.sort((a, b) => b.riskScore - a.riskScore).slice(0, limit);
  },
});

// Get declining/improving students for risk analysis page
export const trendingStudents = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { improving: [], declining: [] };

    const all = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return {
      improving: all.filter((s) => s.trend === "improving"),
      declining: all.filter((s) => s.trend === "declining"),
    };
  },
});

// Create a new student
export const create = mutation({
  args: {
    name: v.string(),
    rollNumber: v.string(),
    course: v.string(),
    semester: v.number(),
    mentor: v.string(),
    attendance: v.number(),
    marks: v.number(),
    failedSubjects: v.number(),
    totalSubjects: v.number(),
    feeStatus: v.union(v.literal("paid"), v.literal("pending"), v.literal("overdue")),
    feeAmount: v.number(),
    trend: v.union(v.literal("improving"), v.literal("declining"), v.literal("stable")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const risk = calculateRisk(args);
    const now = new Date().toISOString().split("T")[0];

    return await ctx.db.insert("students", {
      userId,
      ...args,
      ...risk,
      lastUpdated: now,
    });
  },
});

// Update a student — recalculates risk
export const update = mutation({
  args: {
    studentId: v.id("students"),
    name: v.optional(v.string()),
    rollNumber: v.optional(v.string()),
    course: v.optional(v.string()),
    semester: v.optional(v.number()),
    mentor: v.optional(v.string()),
    attendance: v.optional(v.number()),
    marks: v.optional(v.number()),
    failedSubjects: v.optional(v.number()),
    totalSubjects: v.optional(v.number()),
    feeStatus: v.optional(v.union(v.literal("paid"), v.literal("pending"), v.literal("overdue"))),
    feeAmount: v.optional(v.number()),
    trend: v.optional(v.union(v.literal("improving"), v.literal("declining"), v.literal("stable"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.studentId);
    if (!existing) throw new Error("Student not found");

    const updated = { ...existing, ...args };
    const risk = calculateRisk({
      attendance: updated.attendance,
      marks: updated.marks,
      failedSubjects: updated.failedSubjects,
      totalSubjects: updated.totalSubjects,
      feeStatus: updated.feeStatus,
      trend: updated.trend,
    });

    const now = new Date().toISOString().split("T")[0];

    await ctx.db.patch(args.studentId, {
      ...args,
      ...risk,
      lastUpdated: now,
    });

    return args.studentId;
  },
});

// Delete a student
export const remove = mutation({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.studentId);
    if (!existing) throw new Error("Student not found");

    await ctx.db.delete(args.studentId);
  },
});

// Bulk create students (for CSV import) — returns count of imported
export const bulkCreate = mutation({
  args: {
    students: v.array(
      v.object({
        name: v.string(),
        rollNumber: v.string(),
        course: v.string(),
        semester: v.number(),
        mentor: v.string(),
        attendance: v.number(),
        marks: v.number(),
        failedSubjects: v.number(),
        totalSubjects: v.number(),
        feeStatus: v.union(v.literal("paid"), v.literal("pending"), v.literal("overdue")),
        feeAmount: v.number(),
        trend: v.union(v.literal("improving"), v.literal("declining"), v.literal("stable")),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = new Date().toISOString().split("T")[0];
    let count = 0;

    for (const student of args.students) {
      const risk = calculateRisk(student);
      await ctx.db.insert("students", {
        userId,
        ...student,
        ...risk,
        lastUpdated: now,
      });
      count++;
    }

    // Create a notification for the bulk import
    await ctx.db.insert("notifications", {
      userId,
      type: "info",
      title: "Data Imported",
      message: `${count} students imported successfully. Risk scores have been calculated.`,
      read: false,
    });

    return count;
  },
});
