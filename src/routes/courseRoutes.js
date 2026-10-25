const express = require('express');
const courseController = require('../controllers/courseController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.use(optionalAuth);

router.get('/courses', courseController.getAllCourses);
router.get('/courses/:slug', courseController.getCourseBySlug);
router.get('/courses/:slug/tree', courseController.getCourseTree);
router.get('/topics/:topicId/subtopics', courseController.getSubtopicsForTopic);
router.get('/subtopics/:subtopicId', courseController.getSubtopicById);
router.get('/subtopics/:subtopicId/problems', courseController.getProblemsForSubtopic);
router.get('/problems/:problemId', courseController.getProblemById);

module.exports = router;
