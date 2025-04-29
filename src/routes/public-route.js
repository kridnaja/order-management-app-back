const express = require("express");


const publicControlelr = require('../cotrollers/public-controller')

const router = express.Router();


router.get("/readAllQueue", publicControlelr.readAllQueue)

router.get('/readAllOrder',publicControlelr.readAllOrder )

router.get('/readAllPrepress',publicControlelr. readAllPrepress)

router.post('/readWeeklyReport', publicControlelr.readWeeklyReport)

module.exports = router;