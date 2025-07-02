import React, { useState } from 'react';
import { Task } from '../../types/task';
import { useTaskStore } from '../../store/taskStore';
import { 
  Calendar, 
  Clock, 
  Users, 
  Edit, 
  Trash2, 
  Share2,
  AlertCircle,
  CheckCircle2,
  Circle,
  MoreHorizontal
} from 'lucide-react';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { TaskForm } from './TaskForm';
import { ShareTaskModal } from './ShareTaskModal';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      await updateTask({ id: task.id, status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'todo':
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getDueDateInfo = () => {
    if (!task.due_date) return null;
    
    const dueDate = parseISO(task.due_date);
    const isOverdue = isPast(dueDate) && !isToday(dueDate);
    const isDueToday = isToday(dueDate);
    
    return {
      formatted: format(dueDate, 'MMM dd, yyyy'),
      isOverdue,
      isDueToday,
    };
  };

  const dueDateInfo = getDueDateInfo();

  const StatusIcon = () => {
    switch (task.status) {
      case 'done':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-6 w-6 text-blue-600" />;
      default:
        return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  if (isEditing) {
    return (
      <TaskForm
        task={task}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <button
              onClick={() => handleStatusChange(
                task.status === 'done' ? 'todo' : 
                task.status === 'todo' ? 'in_progress' : 'done'
              )}
              className="mt-1 hover:scale-110 transition-transform duration-200"
            >
              <StatusIcon />
            </button>
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold mb-2 ${
                task.status === 'done' 
                  ? 'line-through text-gray-500 dark:text-gray-400' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </span>

                {dueDateInfo && (
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${
                    dueDateInfo.isOverdue 
                      ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' 
                      : dueDateInfo.isDueToday 
                        ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
                  }`}>
                    <Calendar className="h-3 w-3" />
                    <span>{dueDateInfo.formatted}</span>
                    {dueDateInfo.isOverdue && <AlertCircle className="h-3 w-3" />}
                  </div>
                )}

                {task.shared_with.length > 0 && (
                  <div className="flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-medium dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                    <Users className="h-3 w-3" />
                    <span>{task.shared_with.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

            {showActions && (
              <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 min-w-[160px]">
                <button
                  onClick={() => {
                    setShowShareModal(true);
                    setShowActions(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowActions(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                
                <button
                  onClick={() => {
                    handleDelete();
                    setShowActions(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-xl"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareTaskModal
          task={task}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
};