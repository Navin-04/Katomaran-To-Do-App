export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  shared_with: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TaskFilters {
  status?: 'todo' | 'in_progress' | 'done' | 'all';
  priority?: 'low' | 'medium' | 'high' | 'all';
  dueFilter?: 'today' | 'overdue' | 'upcoming' | 'all';
  sharedWithMe?: boolean;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  shared_with?: string[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
  timezone?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    taskReminders: boolean;
    sharedTasks: boolean;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    dateFormat: string;
    startOfWeek: 'monday' | 'sunday';
  };
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    taskReminders: boolean;
    sharedTasks: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    dateFormat: string;
    startOfWeek: 'monday' | 'sunday';
  };
}