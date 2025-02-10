const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/reports/:sessionID', reportController.createReport);

router.get('/reports', reportController.getAllReports);

router.get('/reports/:sessionID', reportController.getReportBySessionID);

module.exports = router;
