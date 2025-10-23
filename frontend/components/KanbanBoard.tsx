import React, { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Task, TaskStatus } from '../types';
import KanbanColumn from './KanbanColumn';
import TaskForm from './TaskForm';

const KanbanBoard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setTasks(data.tasks || []);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const taskId = active.id as string;
        const newStatus = over.id as TaskStatus;

        // Optimistically update UI
        setTasks(prev => prev.map(task => 
            task.uid === taskId ? { ...task, status: newStatus } : task
        ));

        // Update on server
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                // Revert on error
                fetchTasks();
            }
        } catch (error) {
            console.error('Failed to update task status:', error);
            fetchTasks();
        }
    };

    const handleTaskCreated = () => {
        setShowForm(false);
        fetchTasks();
    };

    const getTasksByStatus = (status: TaskStatus) => {
        return tasks.filter(task => task.status === status);
    };

    if (loading) {
        return <div className="p-4">Loading kanban board...</div>;
    }

    return (
        <div className="px-4 sm:px-0">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    New Task
                </button>
            </div>

            {showForm && (
                <div className="mb-6">
                    <TaskForm
                        onSuccess={handleTaskCreated}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <KanbanColumn
                        id="todo"
                        title="To Do"
                        tasks={getTasksByStatus('todo')}
                        onTaskUpdate={fetchTasks}
                    />
                    <KanbanColumn
                        id="in_progress"
                        title="In Progress"
                        tasks={getTasksByStatus('in_progress')}
                        onTaskUpdate={fetchTasks}
                    />
                    <KanbanColumn
                        id="done"
                        title="Done"
                        tasks={getTasksByStatus('done')}
                        onTaskUpdate={fetchTasks}
                    />
                </div>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;
