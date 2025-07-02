import { create } from 'zustand';
import { Task, TaskFilters, CreateTaskData, UpdateTaskData } from '../types/task';
import { mockTasks } from '../data/mockData';
import { isToday, isPast, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  filters: TaskFilters;
  currentPage: number;
  tasksPerPage: number;
  
  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (task: CreateTaskData) => Promise<void>;
  updateTask: (task: UpdateTaskData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  shareTask: (taskId: string, emails: string[]) => Promise<void>;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setCurrentPage: (page: number) => void;
  
  // Computed
  getFilteredTasks: () => Task[];
  getPaginatedTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  filters: {
    status: 'all',
    priority: 'all',
    dueFilter: 'all',
    sharedWithMe: false,
  },
  currentPage: 1,
  tasksPerPage: 10,

  fetchTasks: async () => {
    set({ loading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set({ 
      tasks: mockTasks,
      loading: false 
    });
  },

  createTask: async (taskData: CreateTaskData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || null,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      due_date: taskData.due_date || null,
      shared_with: taskData.shared_with || [],
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set((state) => ({
      tasks: [newTask, ...state.tasks]
    }));
    
    toast.success('Task created successfully');
  },

  updateTask: async (taskData: UpdateTaskData) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === taskData.id 
          ? { ...task, ...taskData, updated_at: new Date().toISOString() }
          : task
      )
    }));
    
    toast.success('Task updated successfully');
  },

  deleteTask: async (id: string) => {
    set((state) => ({
      tasks: state.tasks.filter(task => task.id !== id)
    }));
    
    toast.success('Task deleted successfully');
  },

  shareTask: async (taskId: string, emails: string[]) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === taskId 
          ? { ...task, shared_with: emails, updated_at: new Date().toISOString() }
          : task
      )
    }));
    
    toast.success('Task shared successfully');
  },

  setFilters: (newFilters: Partial<TaskFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
    }));
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  getFilteredTasks: () => {
    const { tasks, filters } = get();
    
    return tasks.filter((task) => {
      // Status filter
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }
      
      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }
      
      // Due date filter
      if (filters.dueFilter !== 'all' && task.due_date) {
        const dueDate = parseISO(task.due_date);
        switch (filters.dueFilter) {
          case 'today':
            if (!isToday(dueDate)) return false;
            break;
          case 'overdue':
            if (!isPast(dueDate) || isToday(dueDate)) return false;
            break;
          case 'upcoming':
            if (isPast(dueDate)) return false;
            break;
        }
      }
      
      // Shared with me filter
      if (filters.sharedWithMe) {
        if (task.shared_with.length === 0) {
          return false;
        }
      }
      
      return true;
    });
  },

  getPaginatedTasks: () => {
    const { currentPage, tasksPerPage } = get();
    const filteredTasks = get().getFilteredTasks();
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    
    return filteredTasks.slice(startIndex, endIndex);
  },
}));