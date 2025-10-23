import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import ProjectForm from './ProjectForm';

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setProjects(data.projects || []);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectCreated = () => {
        setShowForm(false);
        fetchProjects();
    };

    if (loading) {
        return <div className="p-4">Loading projects...</div>;
    }

    return (
        <div className="px-4 sm:px-0">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    New Project
                </button>
            </div>

            {showForm && (
                <div className="mb-6">
                    <ProjectForm
                        onSuccess={handleProjectCreated}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                        No projects found. Create your first project!
                    </div>
                ) : (
                    projects.map(project => (
                        <Link
                            key={project.id}
                            to={`/project/${project.id}`}
                            className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                {project.title}
                            </h3>
                            {project.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {project.description}
                                </p>
                            )}
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Projects;
