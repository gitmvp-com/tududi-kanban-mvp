const express = require('express');
const router = express.Router();
const { Project, Task } = require('../models');

router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.findAll({
            where: { user_id: req.session.userId },
            order: [['created_at', 'DESC']],
        });
        res.json({ projects });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

router.get('/projects/:uid', async (req, res) => {
    try {
        const project = await Project.findOne({
            where: { uid: req.params.uid, user_id: req.session.userId },
        });
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        res.json({ project });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

router.get('/projects/:id/tasks', async (req, res) => {
    try {
        const project = await Project.findOne({
            where: { id: req.params.id, user_id: req.session.userId },
        });
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        const tasks = await Task.findAll({
            where: { project_id: project.id, user_id: req.session.userId },
            include: [{ model: Project, attributes: ['id', 'uid', 'title'] }],
            order: [['created_at', 'DESC']],
        });
        
        res.json({ tasks });
    } catch (error) {
        console.error('Get project tasks error:', error);
        res.status(500).json({ error: 'Failed to fetch project tasks' });
    }
});

router.post('/projects', async (req, res) => {
    try {
        const { title, description } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const project = await Project.create({
            title,
            description,
            user_id: req.session.userId,
        });
        
        res.status(201).json({ project });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

router.put('/projects/:uid', async (req, res) => {
    try {
        const project = await Project.findOne({
            where: { uid: req.params.uid, user_id: req.session.userId },
        });
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const { title, description } = req.body;
        
        await project.update({
            title: title !== undefined ? title : project.title,
            description: description !== undefined ? description : project.description,
        });
        
        res.json({ project });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

router.delete('/projects/:uid', async (req, res) => {
    try {
        const project = await Project.findOne({
            where: { uid: req.params.uid, user_id: req.session.userId },
        });
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        await project.destroy();
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

module.exports = router;
