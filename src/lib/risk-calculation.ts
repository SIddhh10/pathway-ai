export interface RiskInput {
  attendance: number;
  marks: number;
  failedSubjects: number;
  totalSubjects: number;
  feeStatus: "paid" | "pending" | "overdue";
  trend: "improving" | "declining" | "stable";
}

export interface RiskOutput {
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  riskFactors: string[];
  recommendedAction: string;
}

/**
 * Calculate student dropout risk score based on weighted factors.
 *
 * Weights:
 *   Attendance: 30%
 *   Marks: 25%
 *   Failed Subjects: 20%
 *   Fee Status: 10%
 *   Performance Trend: 15%
 *
 * Score 0–100 where higher = more at risk.
 */
export function calculateRisk(input: RiskInput): RiskOutput {
  const { attendance, marks, failedSubjects, totalSubjects, feeStatus, trend } = input;

  // --- Attendance score (0–30) ---
  // < 40% → full 30 pts; 40–60% → proportional; > 60% → 0
  let attendanceScore: number;
  if (attendance <= 40) {
    attendanceScore = 30;
  } else if (attendance >= 60) {
    attendanceScore = 0;
  } else {
    attendanceScore = ((60 - attendance) / 20) * 30;
  }

  // --- Marks score (0–25) ---
  // < 30% → full 25 pts; 30–50% → proportional; > 50% → 0
  let marksScore: number;
  if (marks <= 30) {
    marksScore = 25;
  } else if (marks >= 50) {
    marksScore = 0;
  } else {
    marksScore = ((50 - marks) / 20) * 25;
  }

  // --- Failed subjects score (0–20) ---
  const failRate = totalSubjects > 0 ? failedSubjects / totalSubjects : 0;
  const failedScore = Math.min(failRate * 2, 1) * 20;

  // --- Fee status score (0–10) ---
  let feeScore: number;
  if (feeStatus === "overdue") {
    feeScore = 10;
  } else if (feeStatus === "pending") {
    feeScore = 5;
  } else {
    feeScore = 0;
  }

  // --- Trend score (0–15) ---
  let trendScore: number;
  if (trend === "declining") {
    trendScore = 15;
  } else if (trend === "stable") {
    trendScore = 5;
  } else {
    trendScore = 0;
  }

  // --- Total risk score ---
  const raw = attendanceScore + marksScore + failedScore + feeScore + trendScore;
  const riskScore = Math.round(Math.min(100, Math.max(0, raw)));

  // --- Risk level ---
  let riskLevel: "low" | "medium" | "high";
  if (riskScore >= 70) {
    riskLevel = "high";
  } else if (riskScore >= 40) {
    riskLevel = "medium";
  } else {
    riskLevel = "low";
  }

  // --- Risk factors ---
  const riskFactors: string[] = [];

  if (attendance < 40) {
    riskFactors.push(`Attendance critically low at ${attendance}%`);
  } else if (attendance < 50) {
    riskFactors.push(`Attendance below 50% at ${attendance}%`);
  } else if (attendance < 60) {
    riskFactors.push(`Attendance below the 60% threshold at ${attendance}%`);
  }

  if (marks < 30) {
    riskFactors.push(`Average marks critically low at ${marks}%`);
  } else if (marks < 40) {
    riskFactors.push(`Average marks below 40% at ${marks}%`);
  } else if (marks < 50) {
    riskFactors.push(`Average marks below passing threshold at ${marks}%`);
  }

  if (failedSubjects >= 3) {
    riskFactors.push(`Failed ${failedSubjects} subjects — multiple backlogs`);
  } else if (failedSubjects >= 2) {
    riskFactors.push(`Failed ${failedSubjects} subjects`);
  } else if (failedSubjects === 1) {
    riskFactors.push(`Failed 1 subject`);
  }

  if (feeStatus === "overdue") {
    riskFactors.push("Fee payment overdue");
  } else if (feeStatus === "pending") {
    riskFactors.push("Fee payment pending");
  }

  if (trend === "declining") {
    riskFactors.push("Academic performance is declining");
  }

  // --- Recommended action ---
  const actions: string[] = [];

  if (riskLevel === "high") {
    if (attendance < 50) {
      actions.push("Urgent: schedule a meeting with the student and their parents/guardian");
    }
    if (marks < 40) {
      actions.push("Arrange academic support and remedial sessions");
    }
    if (failedSubjects >= 2) {
      actions.push("Create a subject-wise improvement plan with the mentor");
    }
    if (feeStatus !== "paid") {
      actions.push("Follow up with the accounts department on fee payment");
    }
    if (trend === "declining") {
      actions.push("Schedule immediate counselling session");
    }
    if (actions.length === 0) {
      actions.push("Schedule counselling session within 3 days");
    }
  } else if (riskLevel === "medium") {
    if (attendance < 65) {
      actions.push("Monitor attendance closely over the next 2 weeks");
    }
    if (marks < 50) {
      actions.push("Share supplementary study materials and check understanding");
    }
    if (failedSubjects >= 1) {
      actions.push("Discuss study strategies for the failed subject(s)");
    }
    if (feeStatus !== "paid") {
      actions.push("Remind the student about pending fee payment");
    }
    if (actions.length === 0) {
      actions.push("Check in during the next weekly mentor meeting");
    }
  } else {
    actions.push("No immediate action needed — student is performing well");
  }

  return {
    riskScore,
    riskLevel,
    riskFactors,
    recommendedAction: actions.join(". ") + ".",
  };
}
