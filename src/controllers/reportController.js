const Report = require('../models/Report');  // Import the Report model
const Session = require('../models/Session');  // Import the Session model

// Create a new report for a session
exports.createReport = async (req, res) => {
    try {
        const { sessionID } = req.params;
        const session = await Session.findOne({ uniqueID: sessionID });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const report = {
            sessionID: session.uniqueID,
            feedbacks: session.feedbacks,
            startTime: session.startTime,
            endTime: session.endTime,
            totalJoinees: session.joinee.length,
            sessionDuration: (new Date(session.endTime) - new Date(session.startTime)) / 60000, // Duration in minutes
            sessionSummary: "Detailed session summary goes here.",
            additionalNotes: "Any additional notes about the session can be added here."
        };

        const newReport = new Report(report);
        await newReport.save();
        res.status(201).json({ message: 'Report created successfully', report: newReport });
    } catch (err) {
        console.error('Error creating report:', err);
        res.status(500).json({ message: 'Server Error', error: err });
    }
};

// Get all reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json({ reports });
    } catch (err) {
        console.error('Error fetching reports:', err);
        res.status(500).json({ message: 'Server Error', error: err });
    }
};

// Get a specific report by session ID
exports.getReportBySessionID = async (req, res) => {
    try {
        const { sessionID } = req.params;
        const report = await Report.findOne({ sessionID });

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json({ report });
    } catch (err) {
        console.error('Error fetching report by session ID:', err);
        res.status(500).json({ message: 'Server Error', error: err });
    }
};
