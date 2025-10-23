import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Tasks from './components/Tasks';
import KanbanBoard from './components/KanbanBoard';
import Projects from './components/Projects';
import ProjectDetails from './components/ProjectDetails';
import { User } from './types';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const storedPreference = localStorage.getItem('isDarkMode');
        return storedPreference !== null
            ? storedPreference === 'true'
            : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const toggleDarkMode = () => {
        const newValue = !isDarkMode;
        setIsDarkMode(newValue);
        localStorage.setItem('isDarkMode', JSON.stringify(newValue));
        document.documentElement.classList.toggle('dark', newValue);
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch('/api/current_user', {
                credentials: 'include',
                headers: { 'Accept': 'application/json' },
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentUser(data.user);
            } else {
                setCurrentUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <Routes>
            {currentUser ? (
                <Route element={<Layout currentUser={currentUser} setCurrentUser={setCurrentUser} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}>
                    <Route index element={<Navigate to="/tasks" replace />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/kanban" element={<KanbanBoard />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/project/:id" element={<ProjectDetails />} />
                    <Route path="*" element={<Navigate to="/tasks" replace />} />
                </Route>
            ) : (
                <>
                    <Route path="/login" element={<Login onLogin={fetchCurrentUser} />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </>
            )}
        </Routes>
    );
};

export default App;
