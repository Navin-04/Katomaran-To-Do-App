import React from 'react';
import { useTaskStore } from '../../store/taskStore';
import { TaskCard } from './TaskCard';
import { ChevronLeft, ChevronRight, Loader2, Search, Inbox } from 'lucide-react';

export const TaskList = () => {
  const { 
    loading, 
    getPaginatedTasks, 
    getFilteredTasks,
    currentPage, 
    tasksPerPage, 
    setCurrentPage 
  } = useTaskStore();

  const tasks = getPaginatedTasks();
  const filteredTasks = getFilteredTasks();
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">Loading your tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          {filteredTasks.length === 0 ? (
            <Inbox className="h-10 w-10 text-white" />
          ) : (
            <Search className="h-10 w-10 text-white" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {filteredTasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {filteredTasks.length === 0 
            ? "Get started by creating your first task! Click the 'Create New Task' button above to begin organizing your work."
            : "Try adjusting your filters to see more tasks, or create a new task that matches your current criteria."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{(currentPage - 1) * tasksPerPage + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * tasksPerPage, filteredTasks.length)}</span> of{' '}
            <span className="font-medium">{filteredTasks.length}</span> tasks
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            
            <span className="text-sm text-gray-700 dark:text-gray-300 px-4">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};