export interface RecurringExpense {
    id: number;
    name: string;
    description: string | null;
    amount: number;
    category: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreateRecurringExpenseRequest {
    name: string;
    description: string | null;
    amount: number;
    category: string;
}

export interface UpdateRecurringExpenseRequest {
    name: string;
    description: string | null;
    amount: number;
    category: string;
    isActive: boolean;
}

export type ProjectStatus = 'Draft' | 'InProgress' | 'Published' | 'Archived';

export interface Project {
    id: number;
    title: string;
    description: string | null;
    status: ProjectStatus;
    targetPublishDate: string | null;
    publishedDate: string | null;
    createdAt: string;
    updatedAt: string;
    shortsCount: number;
    grossProfit: number;
    totalHours: number;
}

export interface DashboardProjectDto {
    id: number;
    title: string;
    status: string;
    publishedDate: string | null;
    grossProfit: number;
    totalHours: number;
}

export interface DashboardData {
    monthlyRecurringTotal: number;
    publishedProjectsThisMonth: number;
    totalProjects: number;
    totalRevenue: number;
    totalDirectExpenses: number;
    totalGrossProfit: number;
    totalHours: number;
    recentProjects: DashboardProjectDto[];
}

export interface Short {
    id: number;
    title: string;
    youtubeUrl: string | null;
    publishedDate: string | null;
    createdAt: string;
}

export interface ProjectDetail extends Omit<Project, 'shortsCount'> {
    shorts: Short[];
}

export interface CreateProjectRequest {
    title: string;
    description: string | null;
    status: ProjectStatus;
    targetPublishDate: string | null;
}

export interface UpdateProjectRequest {
    title: string;
    description: string | null;
    status: ProjectStatus;
    targetPublishDate: string | null;
    publishedDate: string | null;
}

export interface CreateShortRequest {
    title: string;
    youtubeUrl: string | null;
    publishedDate: string | null;
}

export interface ProjectExpense {
    id: number;
    description: string;
    amount: number;
    category: string;
    date: string;
    createdAt: string;
}

export interface CreateProjectExpenseRequest {
    description: string;
    amount: number;
    category: string;
    date: string;
}

export interface RevenueEntry {
    id: number;
    source: string;
    amount: number;
    date: string;
    notes: string | null;
    createdAt: string;
}

export interface CreateRevenueEntryRequest {
    source: string;
    amount: number;
    date: string;
    notes: string | null;
}

export interface TimeLog {
    id: number;
    category: string;
    hours: number;
    date: string;
    notes: string | null;
    createdAt: string;
}

export interface CreateTimeLogRequest {
    category: string;
    hours: number;
    date: string;
    notes: string | null;
}

export interface CategoryBreakdown {
    category: string;
    total: number;
}

export interface TimeBreakdown {
    category: string;
    hours: number;
}

export interface ProfitabilityData {
    totalRevenue: number;
    totalDirectExpenses: number;
    grossProfit: number;
    totalHours: number;
    revenuePerHour: number | null;
    monthlyRecurringTotal: number;
    publishedProjectsThisMonth: number;
    autoAllocatedRecurring: number;
    netProfitAuto: number;
    roiAuto: number | null;
    expensesByCategory: CategoryBreakdown[];
    timeByCategory: TimeBreakdown[];
}
