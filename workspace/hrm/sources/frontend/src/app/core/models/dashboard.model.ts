export interface StatCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
  badgeBg: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  description: string;
  badgeColor: string;
}

export interface RecentProject {
  id: string;
  name: string;
  client: string;
  logo: string;
  budget: string;
  progress: number;
  status: 'In Progress' | 'Completed' | 'Pending' | 'On Hold';
  statusColor: string;
}

export interface DashboardOverview {
  stats: StatCard[];
  activities: ActivityItem[];
  projects: RecentProject[];
}
