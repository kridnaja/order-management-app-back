const express = require("express");

const prepressController = require('../cotrollers/prepress-controller')
const authenticatedMiddleware = require('../middlewares/authenticate')



const router = express.Router();



router.post('/getNewJob', prepressController.getNewJob)

router.post('/rejectNewJob', prepressController.rejectNewJob)

router.post('/rejectJobAfterChecked', prepressController.rejectJobAfterChecked)

router.post('/finishNewJob',prepressController. finishNewJob)

router.post('/finishJobAfterChecked', prepressController.finishJobAfterChecked)
///// read
router.get('/readNewJob', prepressController.readNewJob)

router.get('/readWaitToConfirm', prepressController.readWaitToConfirm)

router.get('/readCompleted' , prepressController.readCompleted )

router.get('/readWaitForPrepressToCheck',prepressController.readWaitForPrepressToCheck )

router.get('/readChecking', prepressController.readChecking)

router.get('/readCompletedLayout',prepressController.readCompletedLayout )

router.get('/readAllPrepressQueueMoreMove',prepressController.readAllPrepressQueueMoreMove )
router.get('/readAllPrepress',prepressController.readAllPrepress )


router.get('/readAllQueue',prepressController.readAllQueue)
module.exports = router;