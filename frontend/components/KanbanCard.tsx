import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Task } from '../types';
import { TrashIcon } from '@heroicons/react/24/outline';
import TaskForm from './TaskForm';

interface KanbanCardProps {
    task: Task;
    onUpdate: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.uid,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        try {
            const response = await fetch(`/api/tasks/${task.uid}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok) {
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
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
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm hover:shadow-md transition-shadow cursor-move"
            {...listeners}
            {...attributes}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {task.title}
                    </h4>
                    {task.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {task.description}
                        </p>
                    )}
                    {task.project && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            📁 {task.project.title}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleDelete}
                    className="ml-2 p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Delete task"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default KanbanCard;
