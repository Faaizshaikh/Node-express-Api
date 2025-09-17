const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const tasksFile = path.join(__dirname, "../data/tasks.json");

// Utility function to read tasks
function getTasks() {
  const data = fs.readFileSync(tasksFile);
  return JSON.parse(data);
}

// Utility function to save tasks
function saveTasks(tasks) {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

// GET all tasks
router.get("/", (req, res) => {
  const tasks = getTasks();
  res.json(tasks);
});

// POST create task
router.post("/", (req, res) => {
  const tasks = getTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// PUT update task
router.put("/:id", (req, res) => {
  let tasks = getTasks();
  const taskId = parseInt(req.params.id);

  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  saveTasks(tasks);
  res.json(tasks[taskIndex]);
});

// DELETE task
router.delete("/:id", (req, res) => {
  let tasks = getTasks();
  const taskId = parseInt(req.params.id);

  const newTasks = tasks.filter((t) => t.id !== taskId);
  if (newTasks.length === tasks.length) {
    return res.status(404).json({ message: "Task not found" });
  }

  saveTasks(newTasks);
  res.json({ message: "Task deleted" });
});

module.exports = router;