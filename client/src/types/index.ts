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
