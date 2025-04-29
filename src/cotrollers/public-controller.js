const prisma = require("../models/prisma");

exports.readAllQueue = async (req, res, next) => {
  try {
    const response = await prisma.disPlayQueue.findMany();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

exports.readAllOrder = async (req, res, next) => {
  try {
    const response = await prisma.order.findMany();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

exports.readAllPrepress = async (req, res, next) => {
  try {
    const response = await prisma.user.findMany({
      where: {
        role: "PREPRESS",
        // email: 'pp11@123eva.com'
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

exports.readWeeklyReport = async (req, res, next) => {
  try {
    console.log("readWeeklyReport", req.body);
    // Expected req.body format: { start: '2024-12-22T17:00:00.000Z', end: '2024-12-29T16:59:59.999Z' }

    const { start, end } = req.body;

    const dateStart = new Date(start);
    const unixTimeStart = Math.floor(dateStart.getTime());

    const dateEnd = new Date(end);
    const unixTimeEnd = Math.floor(dateEnd.getTime());

    const findTargetCompletedArtwork = await prisma.orderLog.findMany({
      where: {
        timeStamp: {
          gte: "" + unixTimeStart,
          lte: "" + unixTimeEnd,
        },
        status: "Job Completed",
        orderNumber: { not: { startsWith: "eva" } },
      },
    });
    console.log(findTargetCompletedArtwork.length)

    const orderIds = findTargetCompletedArtwork.map((order) => order.orderId);

    const targetOrders = await Promise.all(
      orderIds.map((orderId) =>
        prisma.order.findFirst({
          where: {
            id: orderId,
          },
        })
      )
    );
    const latestSubOrders = await Promise.all(
      orderIds.map((orderId) =>
        prisma.subOrder.findFirst({
          where: {
            orderId: orderId,
          },
          orderBy: { createdAt: "desc" },
        })
      )
    );

    res.status(200).json({ orders: findTargetCompletedArtwork, subOrders: latestSubOrders });
  } catch (error) {
    console.error("Error in readWeeklyReport:", error);
    res.status(500).json({
      message: "Failed to retrieve weekly report",
      error: error.message,
    });
  }
};


