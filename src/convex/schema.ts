import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
    }).index("email", ["email"]),

    students: defineTable({
      userId: v.id("users"),
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
      riskScore: v.number(),
      riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
      riskFactors: v.array(v.string()),
      recommendedAction: v.string(),
      trend: v.union(v.literal("improving"), v.literal("declining"), v.literal("stable")),
      lastUpdated: v.string(),
    })
      .index("by_user", ["userId"])
      .index("by_risk_level", ["userId", "riskLevel"])
      .index("by_risk_score", ["userId", "riskScore"]),

    counsellingSessions: defineTable({
      userId: v.id("users"),
      studentId: v.id("students"),
      studentName: v.string(),
      mentorName: v.string(),
      date: v.string(),
      time: v.string(),
      riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
      status: v.union(
        v.literal("scheduled"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("pending")
      ),
      notes: v.optional(v.string()),
    })
      .index("by_user", ["userId"])
      .index("by_student", ["userId", "studentId"])
      .index("by_status", ["userId", "status"]),

    notifications: defineTable({
      userId: v.id("users"),
      type: v.union(
        v.literal("alert"),
        v.literal("warning"),
        v.literal("improvement"),
        v.literal("info")
      ),
      title: v.string(),
      message: v.string(),
      studentId: v.optional(v.id("students")),
      read: v.boolean(),
    })
      .index("by_user", ["userId"])
      .index("by_user_read", ["userId", "read"]),

    monthlyTrendData: defineTable({
      userId: v.id("users"),
      month: v.string(),
      high: v.number(),
      medium: v.number(),
      low: v.number(),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
