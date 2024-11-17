const mongoose = require('mongoose');

const Project = mongoose.model("projects", new mongoose.Schema({
    is_active: { type: Boolean, default: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    video_url: { type: String, default: "" },
    image_urls: { type: Array, default: [] },
    objective: { type: String },
    assignment: { type: String },
    outcome: { type: String },
    link: { type: String },
    created_at: { type: String, default: () => new Date().toISOString() },
    updated_at: { type: String, default: () => new Date().toISOString() },
    details: [{
        title: { type: String },
        description: { type: String },
        image_url: { type: String },
    }]
}));

module.exports = Project;