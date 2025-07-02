import { Task, User } from '../types/task';
import { addDays, subDays, format } from 'date-fns';

export const mockUser: User = {
  id: 'user-1',
  email: 'demo@taskflow.com',
  name: 'Demo User',
  bio: 'Product manager passionate about productivity and team collaboration.',
  timezone: 'America/New_York',
  notifications: {
    email: true,
    push: true,
    taskReminders: true,
    sharedTasks: true,
  },
  preferences: {
    theme: 'system',
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    startOfWeek: 'monday',
  },
  created_at: format(subDays(new Date(), 30), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
  updated_at: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
};

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern, responsive landing page with hero section, features, and testimonials',
    status: 'in_progress',
    priority: 'high',
    due_date: format(addDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    shared_with: ['colleague@company.com'],
    created_by: 'user-1',
    created_at: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    updated_at: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx')
  },
  {
    id: '2',
    title: 'Review quarterly reports',
    description: 'Analyze Q4 performance metrics and prepare presentation for stakeholders',
    status: 'todo',
    priority: 'medium',
    due_date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    shared_with: ['manager@company.com', 'analyst@company.com'],
    created_by: 'user-1',
    created_at: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    updated_at: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx')
  },
  {
    id: '3',
    title: 'Update documentation',
    description: 'Revise API documentation and add new endpoint examples',
    status: 'done',
    priority: 'low',
    due_date: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    shared_with: [],
    created_by: 'user-1',
    created_at: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    updated_at: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx')
  },
  {
    id: '4',
    title: 'Team meeting preparation',
    description: 'Prepare agenda and materials for weekly team sync',
    status: 'todo',
    priority: 'medium',
    due_date: format(addDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    shared_with: [],
    created_by: 'user-1',
    created_at: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    updated_at: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx')
  },
  {
    id: '5',
    title: 'Database optimization',
    description: 'Optimize slow queries and implement proper indexing strategies',
    status: 'in_progress',
    priority: 'high',
    due_date: format(addDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    shared_with: ['dev@company.com'],
    created_by: 'user-1',
    created_at: format(subDays(new Date(), 4), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    updated_at: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx')
  },
  {
    id: '6',
    title: 'Client presentation',
    description: 'Prepare and deliver project status presentation to client stakeholders',
    status: 'todo',
    priority: 'high',
    due_date: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    shared_with: ['sales@company.com'],
    created_by: 'user-1',
    created_at: format(subDays(new Date(), 6), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    updated_at: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx')
  },
  {
    id: '7',
    title: 'Code review',
    description: 'Review pull requests and provide feedback to team members',
    status: 'done',
    priority: 'medium',
    due_date: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    shared_with: [],
    created_by: 'user-1',
    created_at: format(subDays(new Date(), 7), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    updated_at: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx')
  },
  {
    id: '8',
    title: 'Security audit',
    description: 'Conduct comprehensive security review of the application',
    status: 'todo',
    priority: 'high',
    due_date: format(addDays(new Date(), 7), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    shared_with: ['security@company.com'],
    created_by: 'user-1',
    created_at: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    updated_at: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx')
  }
];