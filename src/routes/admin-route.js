const express = require("express");

const adminController = require('../cotrollers/admin-controller')

const router = express.Router();


router.get('/readAllOrders',adminController.readAllOrders)

router.get('/readAllSales', adminController.readAllSales)

router.get('/readInQueueOrders', adminController.readInQueueOrders )

router.get('/readWorkingStatusOrders',adminController .readWorkingStatusOrders)

router.get('/readNewJobStatusOrders',adminController .readNewJobStatusOrders)

// router.post('/moveInQueueOrderToUrgentStatus', adminController.moveInQueueOrderToUrgentStatus)

router.post('/adminTriggerQueueStatus',adminController. adminTriggerQueueStatus)

router.post('/adminManageOrder', adminController.adminManageOrder)

/////// pc

router.get('/readAllCompletedOrders', adminController.readAllCompletedOrders )

router.get('/readAllCompletedLayoutOrders', adminController.readAllCompletedLayoutOrders)

router.post('/moveCompletedOrderInQueue', adminController.moveCompletedOrderInQueue)

router.post('/moveOutCompletedOrderInQueue', adminController.moveOutCompletedOrderInQueue)


module.exports = router;