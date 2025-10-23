import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task, TaskStatus } from '../types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
    id: TaskStatus;
    title: string;
    tasks: Task[];
    onTaskUpdate: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks, onTaskUpdate }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    const columnColors = {
        todo: 'bg-gray-100 dark:bg-gray-800',
        in_progress: 'bg-blue-50 dark:bg-blue-900/20',
        done: 'bg-green-50 dark:bg-green-900/20',
    };

    return (
        <div className="flex flex-col">
            <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </p>
            </div>
            <div
                ref={setNodeRef}
                className={`flex-1 p-4 rounded-lg min-h-[400px] transition-colors ${
                    columnColors[id]
                } ${isOver ? 'ring-2 ring-blue-500' : ''}`}
            >
                <div className="space-y-3">
                    {tasks.map(task => (
                        <KanbanCard key={task.uid} task={task} onUpdate={onTaskUpdate} />
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center py-8 text-gray-400 dark:text-gray-600">
                            No tasks
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KanbanColumn;
