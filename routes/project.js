require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../utils/index");
const Project = require("../models/project");

// GET /list - Get all projects
router.post("/list", async (req, res) => {
    try {
        const { isAll } = req.body;

        console.log(req.body, isAll);
        // Fetch all projects from the collection
        let projects = await Project.find(isAll ? {} : { is_active: true }).limit(isAll ? 0 : 10);

        // Check if no projects found
        if (projects.length === 0) {
            return res.status(404).send({ message: "No projects found" });
        }


        return res.status(200).json({ body: projects });

    } catch (err) {
        // Log the error for debugging
        console.error("Error fetching projects:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

// GET /:id - Get a single project by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).send({ message: "Project not found" });
        }

        return res.status(200).send({ body: project });
    } catch (err) {
        console.error("Error fetching project:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

// POST / - Create a new project
router.post("/", auth, async (req, res) => {
    try {
        const projectData = req.body;

        if (!projectData.title) {
            return res.status(400).send({ message: "Title is required" });
        }
        if (!projectData.video_url) {
            return res.status(400).send({ message: "Video is required" });
        }

        const newProject = new Project(projectData);

        await newProject.save();

        return res.status(201).send({
            message: "Project created successfully",
            body: newProject
        });
    } catch (err) {
        console.error("Error creating project:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});


// PATCH /:id - Update a project
router.put("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid project ID format" });
        }

        const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProject) {
            return res.status(404).send({ message: "Project not found" });
        }

        return res.status(200).send({ message: "Project updated successfully", body: updatedProject });
    } catch (err) {
        console.error("Error updating project:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid project ID format" });
        }

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).send({ message: "Project not found" });
        }

        return res.status(200).send({ message: "Project deleted successfully" });
    } catch (err) {
        console.error("Error deleting project:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

router.post("/media/upload", auth, async (req, res) => {
    try {
        upload.array("files", 10)(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: err.message });
                }

                if (err.message === "Invalid file type. Only PNG, JPEG, JPG, and MP4 files are allowed.") {
                    return res.status(400).json({ message: err.message });
                }

                return res.status(500).json({ message: "Internal Server Error" });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            return res.status(200).json({
                message: "Files uploaded successfully",
                body: req.files,
            });
        });
    } catch (err) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

router.post("/media/delete", auth, async (req, res) => {
    try {
        const { filepath } = req.body; // The filename to delete, passed in the request body
        if (!filepath) {
            return res.status(400).json({ message: "Filename is required" });
        }

        fs.unlink(filepath, (err) => {
            if (err) {
                console.log("ERROR: ", err)
                return res.status(400).json({ message: "File does not exist" });
            }
            return res.status(200).json({ message: "Success" });
        });

    } catch (err) {
        console.log(multer.MulterError);
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        }

        return res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
