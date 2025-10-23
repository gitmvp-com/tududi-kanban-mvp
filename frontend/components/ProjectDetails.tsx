import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, Task } from '../types';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import ProjectForm from './ProjectForm';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const ProjectDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [isEditingProject, setIsEditingProject] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProject();
            fetchProjectTasks();
        }
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${id}`, { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setProject(data.project);
            }
        } catch (error) {
            console.error('Failed to fetch project:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectTasks = async () => {
        try {
            const response = await fetch(`/api/projects/${id}/tasks`, { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setTasks(data.tasks || []);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    const handleDeleteProject = async () => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        
        try {
            const response = await fetch(`/api/projects/${project?.uid}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok) {
                navigate('/projects');
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    if (loading) {
        return <div className="p-4">Loading project...</div>;
    }

    if (!project) {
        return <div className="p-4">Project not found</div>;
    }

    return (
        <div className="px-4 sm:px-0">
            {isEditingProject ? (
                <div className="mb-6">
                    <ProjectForm
                        project={project}
                        onSuccess={() => {
                            setIsEditingProject(false);
                            fetchProject();
                        }}
                        onCancel={() => setIsEditingProject(false)}
                    />
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {project.title}
                            </h2>
                            {project.description && (
                                <p className="text-gray-600 dark:text-gray-400">
                                    {project.description}
                                </p>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsEditingProject(true)}
                                className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                aria-label="Edit project"
                            >
                                <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400"
                                aria-label="Delete project"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Tasks</h3>
                <button
                    onClick={() => setShowTaskForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Add Task
                </button>
            </div>

            {showTaskForm && (
                <div className="mb-6">
                    <TaskForm
                        onSuccess={() => {
                            setShowTaskForm(false);
                            fetchProjectTasks();
                        }}
                        onCancel={() => setShowTaskForm(false)}
                    />
                </div>
            )}

            <div className="space-y-2">
                {tasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No tasks in this project yet.
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onUpdate={fetchProjectTasks}
                            onDelete={fetchProjectTasks}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
