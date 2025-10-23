import React, { useEffect, useState } from 'react';
import { Task, TaskStatus } from '../types';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

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

    const handleTaskCreated = () => {
        setShowForm(false);
        fetchTasks();
    };

    const handleTaskUpdated = () => {
        fetchTasks();
    };

    const handleTaskDeleted = () => {
        fetchTasks();
    };

    const filteredTasks = filterStatus === 'all' 
        ? tasks 
        : tasks.filter(task => task.status === filterStatus);

    if (loading) {
        return <div className="p-4">Loading tasks...</div>;
    }

    return (
        <div className="px-4 sm:px-0">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    New Task
                </button>
            </div>

            <div className="mb-4 flex space-x-2">
                {(['all', 'todo', 'in_progress', 'done'] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            filterStatus === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                        {status === 'all' ? 'All' : status === 'todo' ? 'To Do' : status === 'in_progress' ? 'In Progress' : 'Done'}
                    </button>
                ))}
            </div>

            {showForm && (
                <div className="mb-6">
                    <TaskForm
                        onSuccess={handleTaskCreated}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            <div className="space-y-2">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No tasks found. Create your first task!
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onUpdate={handleTaskUpdated}
                            onDelete={handleTaskDeleted}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Tasks;
