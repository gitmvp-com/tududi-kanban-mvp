import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { TrashIcon } from '@heroicons/react/24/outline';
import TaskForm from './TaskForm';

interface TaskItemProps {
    task: Task;
    onUpdate: () => void;
    onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/tasks/${task.uid}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok) {
                onDelete();
            }
        } catch (error) {
            console.error('Failed to delete task:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatusBadge = (status: TaskStatus) => {
        const colors = {
            todo: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
            in_progress: 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
            done: 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300',
        };
        const labels = {
            todo: 'To Do',
            in_progress: 'In Progress',
            done: 'Done',
        };
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
                {labels[status]}
            </span>
        );
    };

    if (isEditing) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <TaskForm
                    task={task}
                    onSuccess={() => {
                        setIsEditing(false);
                        onUpdate();
                    }}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => setIsEditing(true)}>
                    <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {task.title}
                        </h3>
                        {getStatusBadge(task.status)}
                    </div>
                    {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {task.description}
                        </p>
                    )}
                    {task.project && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Project: {task.project.title}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="ml-4 p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Delete task"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
