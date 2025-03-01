const express = require('express')
const router = express.Router()
const {authenticateUser} = require('../app/middlewares/authentication');
const healthInfoController = require('../app/controllers/healthInfoController')


// Health Info
router.get('/health_info', authenticateUser, healthInfoController.list)
router.post('/health_info', authenticateUser, healthInfoController.create)
router.put('/:id', authenticateUser, healthInfoController.update);
// Soft delete a record (marks as deleted)
router.delete('/soft/:id', authenticateUser, healthInfoController.softDelete);

// Hard delete a record (permanent deletion)
router.delete('/hard/:id', authenticateUser, healthInfoController.hardDelete);

router.post('/health', healthInfoController.create); // ✅ Correct
router.get('/health', healthInfoController.list);
router.get('/health/:id', healthInfoController.show);
router.put('/health/:id', healthInfoController.update);
router.delete('/health/:id', healthInfoController.softDelete);
router.delete('/health/:id/hard', healthInfoController.hardDelete);


module.exports = router