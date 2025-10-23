const express = require('express');
const router = express.Router();
const { Task, Project } = require('../models');

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { user_id: req.session.userId },
            include: [{ model: Project, attributes: ['id', 'uid', 'title'] }],
            order: [['created_at', 'DESC']],
        });
        res.json({ tasks });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

router.get('/tasks/:uid', async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { uid: req.params.uid, user_id: req.session.userId },
            include: [{ model: Project, attributes: ['id', 'uid', 'title'] }],
        });
        
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json({ task });
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

router.post('/tasks', async (req, res) => {
    try {
        const { title, description, status, project_id } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const task = await Task.create({
            title,
            description,
            status: status || 'todo',
            project_id: project_id || null,
            user_id: req.session.userId,
        });
        
        const taskWithProject = await Task.findByPk(task.id, {
            include: [{ model: Project, attributes: ['id', 'uid', 'title'] }],
        });
        
        res.status(201).json({ task: taskWithProject });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

router.put('/tasks/:uid', async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { uid: req.params.uid, user_id: req.session.userId },
        });
        
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const { title, description, status, project_id } = req.body;
        
        await task.update({
            title: title !== undefined ? title : task.title,
            description: description !== undefined ? description : task.description,
            status: status !== undefined ? status : task.status,
            project_id: project_id !== undefined ? project_id : task.project_id,
        });
        
        const updatedTask = await Task.findByPk(task.id, {
            include: [{ model: Project, attributes: ['id', 'uid', 'title'] }],
        });
        
        res.json({ task: updatedTask });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

router.delete('/tasks/:uid', async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { uid: req.params.uid, user_id: req.session.userId },
        });
        
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        await task.destroy();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
