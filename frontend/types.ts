export interface User {
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
    id: number;
    uid: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: number;
    due_date?: string;
    completed: boolean;
    project_id?: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    project?: Project;
}

export interface Project {
    id: number;
    uid: string;
    title: string;
    description?: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    tasks?: Task[];
}
