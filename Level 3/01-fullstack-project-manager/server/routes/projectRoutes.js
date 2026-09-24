const express = require("express");
const mongoose = require("mongoose");

const Project = require("../models/Project");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const projectTasks = await Task.find({ project: project._id })
      .populate("project", "name client")
      .sort({ createdAt: -1 });

    res.json({
      ...project.toObject(),
      tasks: projectTasks,
    });
  } catch (error) {
    console.error("GET PROJECT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch project",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      client,
      status,
      priority,
      dueDate,
      progress,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    if (!client || !client.trim()) {
      return res.status(400).json({
        message: "Client name is required",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      client: client.trim(),
      status: status || "Planning",
      priority: priority || "Medium",
      dueDate: dueDate || "",
      progress: Number(progress) || 0,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

    res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const {
      name,
      client,
      status,
      priority,
      dueDate,
      progress,
    } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined && { name: name.trim() }),
        ...(client !== undefined && { client: client.trim() }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate }),
        ...(progress !== undefined && { progress: Number(progress) || 0 }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);

    res.status(500).json({
      message: "Failed to update project",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    await Task.deleteMany({ project: req.params.id });

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete project",
      error: error.message,
    });
  }
});

module.exports = router;