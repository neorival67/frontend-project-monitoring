/**
 * Entity: Dashboard Summary
 * Representasi data ringkasan analitik dashboard.
 */

export interface DashboardSummary {
  projectStats: ProjectStats;
  financialSummary: FinancialSummary;
  teamStats: TeamStats;
  riskSummary: RiskSummary;
  activityStats: ActivityStats;
  deliverableStats: DeliverableStats;
  topRisks: TopRisk[];
  upcomingDeadlines: UpcomingDeadline[];
}

export interface ProjectStats {
  totalProjects: number;
  inProgress: number;
  completed: number;
  delayed: number;
  notStarted: number;
}

export interface FinancialSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  budgetUtilization: number;
}

export interface TeamStats {
  totalUsers: number;
  activeUsers: number;
  pendingInvitations: number;
}

export interface RiskSummary {
  totalRisks: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}

export interface ActivityStats {
  totalActivities: number;
  completedActivities: number;
  inProgressActivities: number;
  delayedActivities: number;
  averageProgress: number;
}

export interface DeliverableStats {
  totalDeliverables: number;
  approved: number;
  rejected: number;
  pending: number;
}

export interface TopRisk {
  id: string;
  description: string;
  riskScore: number;
  category: string;
}

export interface UpcomingDeadline {
  id: string;
  name: string;
  dueDate: string;
  daysLeft: number;
  progress: number;
}
