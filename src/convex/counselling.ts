import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List counselling sessions for current user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("counsellingSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Get upcoming sessions
export const upcoming = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const all = await ctx.db
      .query("counsellingSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return all
      .filter((s) => s.status === "scheduled" || s.status === "pending")
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});

// Get completed sessions
export const completed = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const all = await ctx.db
      .query("counsellingSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return all.filter((s) => s.status === "completed");
  },
});

// Create a counselling session
export const create = mutation({
  args: {
    studentId: v.id("students"),
    studentName: v.string(),
    mentorName: v.string(),
    date: v.string(),
    time: v.string(),
    riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const sessionId = await ctx.db.insert("counsellingSessions", {
      userId,
      ...args,
      status: "scheduled",
    });

    // Create a notification
    await ctx.db.insert("notifications", {
      userId,
      type: "info",
      title: "Session Scheduled",
      message: `Counselling session scheduled for ${args.studentName} on ${args.date} at ${args.time}.`,
      studentId: args.studentId,
      read: false,
    });

    return sessionId;
  },
});

// Update session status
export const updateStatus = mutation({
  args: {
    sessionId: v.id("counsellingSessions"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("pending")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const patch: Record<string, unknown> = { status: args.status };
    if (args.notes !== undefined) patch.notes = args.notes;

    await ctx.db.patch(args.sessionId, patch);
  },
});

// Mark student as reviewed
export const markReviewed = mutation({
  args: {
    studentId: v.id("students"),
    studentName: v.string(),
    mentorName: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const student = await ctx.db.get(args.studentId);
    if (!student) throw new Error("Student not found");

    const now = new Date().toISOString().split("T")[0];

    const sessionId = await ctx.db.insert("counsellingSessions", {
      userId,
      studentId: args.studentId,
      studentName: args.studentName,
      mentorName: args.mentorName,
      date: now,
      time: "—",
      riskLevel: student.riskLevel,
      status: "completed",
      notes: args.notes ?? "Marked as reviewed.",
    });

    await ctx.db.insert("notifications", {
      userId,
      type: "info",
      title: "Student Reviewed",
      message: `${args.studentName} has been reviewed by ${args.mentorName}.`,
      studentId: args.studentId,
      read: false,
    });

    return sessionId;
  },
});
