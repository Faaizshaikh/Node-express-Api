const express = require("express");
const fs = require("fs").promises; // Use promise-based FS API
const path = require("path");

const router = express.Router();
const tasksFile = path.join(__dirname, "../data/tasks.json");

// Utility function to read tasks (async)
async function getTasks() {
  try {
    const data = await fs.readFile(tasksFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Utility function to save tasks (async)
async function saveTasks(tasks) {
  await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2));
}

// GET all tasks
router.get("/", async (req, res, next) => {
  try {
    const tasks = await getTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// POST create task
router.post("/", async (req, res, next) => {
  try {
    // Input validation
    if (!req.body.title || typeof req.body.title !== 'string') {
      return res.status(400).json({ message: "Title is required and must be a string" });
    }

    const tasks = await getTasks();
    const newTask = {
      id: Date.now(),
      title: req.body.title.trim(),
      completed: req.body.completed || false,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    await saveTasks(tasks);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

// PUT update task
router.put("/:id", async (req, res, next) => {
  try {
    const tasks = await getTasks();
    const taskId = parseInt(req.params.id);

    // Validate ID
    if (isNaN(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Validate input
    if (req.body.title && typeof req.body.title !== 'string') {
      return res.status(400).json({ message: "Title must be a string" });
    }

    if (req.body.completed && typeof req.body.completed !== 'boolean') {
      return res.status(400).json({ message: "Completed must be a boolean" });
    }

    // Update task
    tasks[taskIndex] = { 
      ...tasks[taskIndex], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await saveTasks(tasks);
    res.json(tasks[taskIndex]);
  } catch (error) {
    next(error);
  }
});

// DELETE task
router.delete("/:id", async (req, res, next) => {
  try {
    const tasks = await getTasks();
    const taskId = parseInt(req.params.id);

    // Validate ID
    if (isNaN(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const initialLength = tasks.length;
    const newTasks = tasks.filter((t) => t.id !== taskId);
    
    if (newTasks.length === initialLength) {
      return res.status(404).json({ message: "Task not found" });
    }

    await saveTasks(newTasks);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
