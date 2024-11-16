require('dotenv').config();

const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../utils/index");
const Project = require("../models/project");

// GET /list - Get all projects
router.get("/list", async (req, res) => {
    try {
        // Fetch all projects from the collection
        const projects = await Project.find();

        // Check if no projects found
        if (projects.length === 0) {
            return res.status(404).send({ message: "No projects found" });
        }

        // Return the projects in response
        return res.status(200).send({ body: projects });
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

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid project ID format" });
        }

        // Find the project by ID and remove it
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

router.post("/uploadMedia", upload.array("files", 10), async (req, res) => {
    try {

        console.log("REQUEST: ", req.files);

        if (!req.files) {
            return res.status(400).send('No file uploaded');
        }

        return res.status(200).send({
            message: 'File uploaded successfully',
            body: req.files
        });
    } catch (err) {
        console.error("Error deleting project:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
