const express = require('express');
const {
    submitComplaint,
    getPatientComplaints,
    getAllComplaints,
    updateComplaint,
    getAnalytics,
    deleteComplaint,
} = require('../controllers/complaintController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['PATIENT']), submitComplaint);
router.get('/my', authMiddleware, roleMiddleware(['PATIENT']), getPatientComplaints);

router.get('/all', authMiddleware, roleMiddleware(['ADMIN', 'STAFF']), getAllComplaints);
router.patch('/:id', authMiddleware, roleMiddleware(['ADMIN', 'STAFF']), updateComplaint);
router.get('/analytics', authMiddleware, roleMiddleware(['ADMIN']), getAnalytics);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteComplaint);

module.exports = router;
