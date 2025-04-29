const express = require("express");

const salesController = require('../cotrollers/sales-controller')
const authenticatedMiddleware = require('../middlewares/authenticate')

const router = express.Router();


router.post("/createOrder", salesController.createOrder)

router.delete('/deleteOrder',salesController.deleteOrder) 

router.get('/addOrderInQueue', salesController.addOrderInQueue)

router.post('/addOrderInQueueAfterGotRejected', salesController.addOrderInQueueAfterGotRejected)

router.post('/reviseOrderAndAddInQueue', salesController.reviseOrderAndAddInQueue)

router.post('/confirmOrder', salesController.confirmOrder)

router.post('/holdOrder',salesController.holdOrder )

router.post('/editOrder', salesController.editOrder)

/////read data
router.get('/readNewOrderAfterCreated',salesController.readNewOrderAfterCreated )

router.get('/readFollowOrderAfterRejected',salesController.readFollowOrderAfterRejected )

router.get('/readRevisedOrder', salesController.readRevisedOrder)

router.get('/readFollowOrderAfterInQueue',salesController.readFollowOrderAfterInQueue )

router.get('/readWaitToConfirmOrder',salesController.readWaitToConfirmOrder )

router.get('/readOnWorkingOrder',salesController.readOnWorkingOrder )

router.get('/readCompletedOrder',salesController.readCompletedOrder )

router.get('/readHoldingOrder',salesController.readHoldingOrder)

router.get("/readSelectedOrderToEdit",salesController.readSelectedOrderToEdit )

router.get('/readAllPrepress',salesController.readAllPrepress )

router.get('/readPreview', salesController.readPreview)
///

// router.get('/readNoti',salesController. readNoti )

// router.post('/deleteNoti', salesController.deleteNoti)

// router.post('deleteNoti', salesController.deleteNoti)

module.exports = router;