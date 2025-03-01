const HealthInfo = require('../models/HealthInfo');
const logger = require('../utils/logger'); // Assume a logger utility

const healthInfoController = {};

// Create a new health info entry
healthInfoController.create = async (req, res) => {
    try {
        const body = req.body;
        body.userId = req.user._id; // Associate record with logged-in user
        const healthData = await HealthInfo.create(body);
        res.status(201).json({ success: true, data: healthData });
    } catch (error) {
        logger.error("Error creating health info", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// List health info with pagination and search
healthInfoController.list = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const filter = {
            userId: req.user._id,
            title: { $regex: search, $options: 'i' } // Case-insensitive search
        };

        const healthData = await HealthInfo.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const count = await HealthInfo.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: healthData,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalRecords: count
        });
    } catch (error) {
        logger.error("Error listing health info", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get a single health info entry
healthInfoController.show = async (req, res) => {
    try {
        const healthData = await HealthInfo.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!healthData) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.status(200).json({ success: true, data: healthData });
    } catch (error) {
        logger.error("Error fetching health info", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update a health info entry
healthInfoController.update = async (req, res) => {
    try {
        const healthData = await HealthInfo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!healthData) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.status(200).json({ success: true, data: healthData });
    } catch (error) {
        logger.error("Error updating health info", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Soft delete a health info entry
healthInfoController.softDelete = async (req, res) => {
    try {
        const healthData = await HealthInfo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { isDeleted: true },
            { new: true }
        );

        if (!healthData) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.status(200).json({ success: true, message: "Record soft deleted" });
    } catch (error) {
        logger.error("Error soft deleting health info", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Hard delete (permanent removal)
healthInfoController.hardDelete = async (req, res) => {
    try {
        const healthData = await HealthInfo.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!healthData) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.status(200).json({ success: true, message: "Record permanently deleted" });
    } catch (error) {
        logger.error("Error hard deleting health info", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = healthInfoController;