const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

router.post('/topics', adminController.createTopic);
router.put('/topics/:id', adminController.updateTopic);
router.delete('/topics/:id', adminController.deleteTopic);

router.post('/subtopics', adminController.createSubtopic);
router.put('/subtopics/:id', adminController.updateSubtopic);
router.delete('/subtopics/:id', adminController.deleteSubtopic);

router.post('/problems', adminController.createProblem);
router.put('/problems/:id', adminController.updateProblem);
router.delete('/problems/:id', adminController.deleteProblem);

router.get('/users', adminController.getAllUsers);

router.post('/site-content', adminController.createSiteContent);
router.put('/site-content/:id', adminController.updateSiteContent);
router.delete('/site-content/:id', adminController.deleteSiteContent);

module.exports = router;
