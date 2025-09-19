const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../data/tasks.json');

// Helper: load tasks
const loadTasks = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// GET all tasks
router.get('/', (req, res) => {
  res.json(loadTasks());
});

// POST new task
router.post('/', (req, res) => {
  const tasks = loadTasks();
  const newTask = { id: tasks.length + 1, ...req.body };
  tasks.push(newTask);
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
  res.status(201).json(newTask);
});

module.exports = router;
