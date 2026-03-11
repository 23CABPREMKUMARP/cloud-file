const prisma = require('../lib/prisma');

const submitComplaint = async (req, res) => {
    try {
        const { patientIdentifier, department, category, description, priority, evidenceUrl } = req.body;
        const patientId = req.user.id;

        const complaint = await prisma.complaint.create({
            data: {
                patientId,
                patientIdentifier,
                department,
                category,
                description,
                priority,
                evidenceUrl,
            },
            include: {
                patient: { select: { name: true, email: true } },
            }
        });

        res.status(201).json(complaint);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting complaint' });
    }
};

const getPatientComplaints = async (req, res) => {
    try {
        const complaints = await prisma.complaint.findMany({
            where: { patientId: req.user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                updates: { orderBy: { createdAt: 'desc' }, include: { updatedBy: { select: { name: true } } } }
            }
        });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching complaints' });
    }
};

const getAllComplaints = async (req, res) => {
    try {
        const { status, category, priority } = req.query;
        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;

        const complaints = await prisma.complaint.findMany({
            where: query,
            include: {
                patient: { select: { name: true, email: true } },
                assignedTo: { select: { name: true } },
                updates: { orderBy: { createdAt: 'desc' }, include: { updatedBy: { select: { name: true } } } }
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching complaints' });
    }
};

const updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedToId, comment } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (assignedToId) updateData.assignedToId = assignedToId;

        const complaint = await prisma.complaint.update({
            where: { id },
            data: updateData,
        });

        if (status || comment) {
            await prisma.complaintUpdate.create({
                data: {
                    complaintId: id,
                    updatedById: req.user.id,
                    statusTo: status || complaint.status,
                    comment: comment || `Status updated to ${status}`,
                },
            });
        }

        res.json(complaint);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating complaint' });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const total = await prisma.complaint.count();
        const resolved = await prisma.complaint.count({ where: { status: 'RESOLVED' } });
        const pending = total - resolved;

        const byCategory = await prisma.complaint.groupBy({
            by: ['category'],
            _count: { id: true },
        });

        const byStatus = await prisma.complaint.groupBy({
            by: ['status'],
            _count: { id: true },
        });

        res.json({ total, resolved, pending, byCategory, byStatus });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching analytics' });
    }
};

const deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete updates first due to relations
        await prisma.complaintUpdate.deleteMany({ where: { complaintId: id } });
        await prisma.complaint.delete({ where: { id } });

        res.json({ message: 'Complaint deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting complaint' });
    }
};

module.exports = {
    submitComplaint,
    getPatientComplaints,
    getAllComplaints,
    updateComplaint,
    getAnalytics,
    deleteComplaint,
};
