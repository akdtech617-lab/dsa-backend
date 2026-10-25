const express = require('express');
const progressController = require('../controllers/progressController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.post('/:problemId', progressController.updateProblemStatus);
router.get('/dashboard', progressController.getDashboardStats);
router.get('/heatmap', progressController.getHeatmap);

module.exports = router;
