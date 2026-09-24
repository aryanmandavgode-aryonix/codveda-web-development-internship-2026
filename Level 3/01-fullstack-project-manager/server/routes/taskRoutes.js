const express = require("express");
const mongoose = require("mongoose");

const Task = require("../models/Task");
const Project = require("../models/Project");

const router = express.Router();

/*
GET ALL TASKS
*/
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "name client")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("GET TASKS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

/*
GET SINGLE TASK
*/
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(req.params.id).populate(
      "project",
      "name client"
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    console.error("GET TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch task",
      error: error.message,
    });
  }
});

/*
CREATE TASK
*/
router.post("/", async (req, res) => {
  try {
    const {
      title,
      project,
      priority,
      completed = false,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    if (!project) {
      return res.status(400).json({
        message: "Project is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(project)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const existingProject = await Project.findById(project);

    if (!existingProject) {
      return res.status(404).json({
        message: "Selected project was not found",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      project,
      priority: priority || "Medium",
      completed: Boolean(completed),
    });

    const populatedTask = await Task.findById(task._id).populate(
      "project",
      "name client"
    );

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});

/*
UPDATE TASK
*/
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const {
      title,
      project,
      priority,
      completed,
    } = req.body;

    if (project && !mongoose.Types.ObjectId.isValid(project)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    if (project) {
      const existingProject = await Project.findById(project);

      if (!existingProject) {
        return res.status(404).json({
          message: "Selected project was not found",
        });
      }
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && {
          title: title.trim(),
        }),

        ...(project !== undefined && {
          project,
        }),

        ...(priority !== undefined && {
          priority,
        }),

        ...(completed !== undefined && {
          completed: Boolean(completed),
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("project", "name client");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});

/*
DELETE TASK
*/
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

module.exports = router;