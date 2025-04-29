const prisma = require("../models/prisma");

exports.getNewJob = async (req, res, next) => {
  try {
    const allOrderInQueue = await prisma.disPlayQueue.findMany({
      orderBy: {
        id: "asc",
      },
    });

    if (!allOrderInQueue.length) {
      return res.status(400).json("No jobs are currently in the queue.");
    }

    const findIfTheIsActiveOrNot = await prisma.disPlayQueue.findMany({
      where: {
        isActive: false
      }
    })
    if(findIfTheIsActiveOrNot[0]?.isActive == false){
      return res.status(400).json('The queue system was not activated as the admin was managing an order in the queue system. Please try to retrieve your order again in 30 seconds.')
    }

    ///number 1 rejected after review layout
    const findOrderRejectedAfterCheckedLayout = await prisma.order.findMany({
      where: {
        id: {
          in: allOrderInQueue.map((data) => data.orderId),
        },
        status: "rejectedAfterCheckedLayout",
      },
      orderBy: {
        timeStamp: "asc",
      },
    })


    const isThisYourRejectedAfterCheckedLayout = findOrderRejectedAfterCheckedLayout.filter(( data) => data.prepressOwner == req.body.email)


    if(isThisYourRejectedAfterCheckedLayout[0]){
      const timeStampOrder = Date.now();

      await prisma.order.update({
        where: {
          id : +isThisYourRejectedAfterCheckedLayout[0].id
        },
        data:{
          status : 'workingLayout',
          timeStamp: ``+ timeStampOrder,
        }
      })

      await prisma.disPlayQueue.delete({
        where: {
          orderId : +isThisYourRejectedAfterCheckedLayout[0].id
        }
      })

      const findTargetSales = await prisma.user.findUnique({
        where:{
          id : +isThisYourRejectedAfterCheckedLayout[0].userId
        }
      })

      await prisma.orderLog.create({
        data:{
          orderNumber : isThisYourRejectedAfterCheckedLayout[0].orderNumber,
          orderId: +isThisYourRejectedAfterCheckedLayout[0].id,
          erpNumber : isThisYourRejectedAfterCheckedLayout[0].erpNumber,
          action : 'Prepress received an order from the queue system after the artwork layout was rejected during a review by another prepress team member.',
          actionOwner : req.body.email,
          artworkChecker: isThisYourRejectedAfterCheckedLayout[0].prepressToCheck,
          artworkOwner : isThisYourRejectedAfterCheckedLayout[0].prepressOwner,
          orderOwner : findTargetSales.email,
          layoutChecker : isThisYourRejectedAfterCheckedLayout[0].prepressToCheckLayout,
          status : 'Layout in Progress',
          checkedRemark :  isThisYourRejectedAfterCheckedLayout[0].checkedRemark,
          layoutRejectedRemark :  isThisYourRejectedAfterCheckedLayout[0].layoutRejectedRemark,
          rejectedRemark :  isThisYourRejectedAfterCheckedLayout[0].rejectedRemark,
          revisedRemark :  isThisYourRejectedAfterCheckedLayout[0].revisedRemark,
          timeStamp : ``+ timeStampOrder,
          adminRemark :  isThisYourRejectedAfterCheckedLayout[0].adminRemark,
        }
      })

      return res
      .status(200)
      .json("This is the laid-out artwork that was checked and rejected by your prepress team member. You need to review and rework it.");
    }

    //// number2
    const findOrderWaitForPrepressToCheckLayout = await prisma.order.findMany({
      where: {
        id: {
          in: allOrderInQueue.map((data) => data.orderId),
        },
        status: "waitForPrepressToCheckLayout",
      },
      orderBy: {
        timeStamp: "asc",
      },
    })

    const isThisYourCheckingLayout = findOrderWaitForPrepressToCheckLayout.filter(( data) => data.prepressOwner !== req.body.email)

    if(isThisYourCheckingLayout[0]){
      const timeStampOrder = Date.now();

   const res =    await prisma.order.update({
        where: {
          id: +isThisYourCheckingLayout[0].id
        },
        data: {
          status: 'checkingLayout',
          timeStamp: ``+ timeStampOrder,
          prepressToCheckLayout: req.body.email
        }
      })

      await prisma.disPlayQueue.delete({
        where:{
          orderId:  +isThisYourCheckingLayout[0].id
        }
      })

      const findTargetUser = await prisma.user.findUnique({
        where:{
          id : +isThisYourCheckingLayout[0].userId
        }
      })

      await prisma.orderLog.create({
        data:{
          orderId: +isThisYourCheckingLayout[0].id,
          orderNumber: isThisYourCheckingLayout[0].orderNumber,
          erpNumber: isThisYourCheckingLayout[0].erpNumber,
          action: 'Prepress received an order from the queue system. The order is a layouted artwork that needs to be checked before being sent to the next department.',
          actionOwner: req.body.email,
          artworkChecker: isThisYourCheckingLayout[0].prepressToCheck,
          artworkOwner : isThisYourCheckingLayout[0].prepressOwner,
          layoutChecker: res.prepressToCheckLayout,
          orderOwner: findTargetUser.email,
          status: 'Layout Under Review',
          checkedRemark : isThisYourCheckingLayout[0].checkedRemark,
          revisedRemark: isThisYourCheckingLayout[0].revisedRemark,
          rejectedRemark: isThisYourCheckingLayout[0].rejectedRemark,
          layoutRejectedRemark : isThisYourCheckingLayout[0].layoutRejectedRemark,
          timeStamp: "" + timeStampOrder,
          adminRemark: isThisYourCheckingLayout[0].adminRemark
        }
      })

      return res
        .status(200)
        .json("This is the layouted artwork that needs your review and confirmation.");

    }
    /////
    ////// number3
    const findOrderReadyToLayout = await prisma.order.findMany({
      where: {
        id: {
          in: allOrderInQueue.map((data) => data.orderId),
        },
        status: "readyToLayout",
      },
      orderBy: {
        timeStamp: "asc",
      },
    });

    const isThisYourLayoutOrder = findOrderReadyToLayout.filter(
      (data) => data.prepressOwner === req.body.email
    );


    if (isThisYourLayoutOrder[0]?.prepressOwner === req.body.email) {
      const timeStampOrder = Date.now();
      await prisma.order.update({
        where: {
          id: +isThisYourLayoutOrder[0]?.id,
        },
        data: {
          status: "workingLayout",
          timeStamp: "" + timeStampOrder,
        },
      });

      await prisma.disPlayQueue.delete({
        where: {
          orderId: +isThisYourLayoutOrder[0]?.id,
        },
      });


      const findTargetSales = await prisma.user.findUnique({
        where: {
          id:  +isThisYourLayoutOrder[0]?.userId
        }
      })

      await prisma.orderLog.create({
        data: {
          orderId: +isThisYourLayoutOrder[0]?.id,
          orderNumber: isThisYourLayoutOrder[0]?.orderNumber,
          erpNumber: isThisYourLayoutOrder[0]?.erpNumber,
          action: 'Prepress received the order from the queue system, and the order was ready for layouting.',
          actionOwner: req.body.email,
          artworkChecker: isThisYourLayoutOrder[0]?.prepressToCheck,
          artworkOwner: req.body.email,
          layoutChecker: isThisYourLayoutOrder[0]?.prepressToCheckLayout,
          orderOwner: findTargetSales.email,
          checkedRemark : isThisYourLayoutOrder[0]?.checkedRemark,
          revisedRemark: isThisYourLayoutOrder[0]?.revisedRemark,
          rejectedRemark: isThisYourLayoutOrder[0]?.rejectedRemark,
          adminRemark: isThisYourLayoutOrder[0]?.adminRemark,
          layoutRejectedRemark: isThisYourLayoutOrder[0]?.layoutRejectedRemark,
          status: "Layout in Progress",
          timeStamp: "" + timeStampOrder,
        },
      });

      return res
        .status(200)
        .json("This is the order that ready to work on layout");
    }
    /////


    const findOrderUrgentStatus = await prisma.order.findMany({
      where: {
        id: {
          in: allOrderInQueue.map((data) => data.orderId),
        },
        status: "urgentJob",
      },
      orderBy: {
        timeStamp: "asc",
      },
    });

    const notSpecific = findOrderUrgentStatus.filter(
      (data) => data.prepressOwner === null
    );
    const specific = findOrderUrgentStatus.filter(
      (data) => data.prepressOwner === req.body.email
    );

    if (specific[0]?.prepressOwner === req.body.email) {
      const timeStampOrder = Date.now();
      await prisma.order.update({
        where: {
          id: +specific[0].id,
        },
        data: {
          status: "working",
          prepressOwner: req.body.email,
          timeStamp: "" + timeStampOrder,
        },
      });
      await prisma.disPlayQueue.delete({
        where: {
          orderId: +specific[0].id,
        },
      });

      const findTargetSales = await prisma.user.findUnique({
        where:{
          id: +specific[0].userId
        }
      })
      await prisma.orderLog.create({
        data: {
          orderNumber: specific[0].orderNumber,
          erpNumber : specific[0].erpNumber,
          action: 'Prepress received an urgent order from the queue system, and it was specifically assigned to this prepress.',
          actionOwner: req.body.email,
          artworkOwner: specific[0].prepressOwner,
          artworkChecker: specific[0].prepressToCheck,
          layoutChecker : specific[0].prepressToCheckLayout,
          orderOwner: findTargetSales.email,
          adminRemark : specific[0].adminRemark,
          checkedRemark: specific[0].checkedRemark,
          layoutRejectedRemark: specific[0].layoutRejectedRemark,
          rejectedRemark: specific[0].rejectedRemark,
          revisedRemark: specific[0].revisedRemark,
          status: "Urgent Job",
          orderId: +specific[0].id,
          timeStamp: "" + timeStampOrder,
        },
      });
      return res
        .status(200)
        .json("This is an urgent task specifically for you.");
    }

    if (notSpecific[0]) {
      const timeStampOrder = Date.now();
      await prisma.order.update({
        where: {
          id: +notSpecific[0].id,
        },
        data: {
          status: "working",
          prepressOwner: req.body.email,
          timeStamp: "" + timeStampOrder,
        },
      });
      await prisma.disPlayQueue.delete({
        where: {
          orderId: +notSpecific[0].id,
        },
      });

      const findTargetSales = await prisma.user.findUnique({
        where:{
          id : +notSpecific[0].userId
        }
      })
      await prisma.orderLog.create({
        data: {
          orderId: +notSpecific[0].id,
          orderNumber: notSpecific[0].orderNumber,
          erpNumber: notSpecific[0].erpNumber,
          action: 'Prepress received an urgent order from the queue system, but it was not specifically assigned to any particular prepress.',
          actionOwner: req.body.email,
          orderOwner: findTargetSales.email,
          artworkOwner: notSpecific[0].prepressOwner,
          artworkChecker: notSpecific[0].prepressToCheck,
          layoutChecker: notSpecific[0].prepressToCheckLayout,
          adminRemark: notSpecific[0].adminRemark,
          checkedRemark: notSpecific[0].checkedRemark,
          layoutRejectedRemark: notSpecific[0].layoutRejectedRemark,
          rejectedRemark: notSpecific[0].rejectedRemark,
          revisedRemark: notSpecific[0].revisedRemark,
          status: "Urgent Job",
          timeStamp: "" + timeStampOrder,
        },
      });
      return res.status(200).json("This is an urgent task");
    }
    ///////


    const findYourRevisedOrder = await prisma.order.findMany({
      where: {
        id: {
          in: allOrderInQueue.map((data) => data.orderId),
        },
        status: "revised",
      },
      orderBy: {
        timeStamp: "asc",
      },
    });

    const isThisYourRevisedOrder = findYourRevisedOrder.filter(
      (data) => data.prepressOwner === req.body.email
    );
    if (isThisYourRevisedOrder[0]) {
      const timeStampOrder = Date.now();
      await prisma.order.update({
        where: {
          id: +isThisYourRevisedOrder[0]?.id,
        },
        data: {
          status: "working",
          timeStamp: "" + timeStampOrder,
        },
      });

      const findTargetUser = await prisma.user.findUnique({
        where:{
          id : +isThisYourRevisedOrder[0]?.userId
        }
      })


      await prisma.orderLog.create({
        data: {
          orderId: +isThisYourRevisedOrder[0]?.id,
          orderNumber: isThisYourRevisedOrder[0]?.orderNumber,
          erpNumber: isThisYourRevisedOrder[0]?.erpNumber,
          checkedRemark: isThisYourRevisedOrder[0]?.checkedRemark,
          rejectedRemark: isThisYourRevisedOrder[0]?.rejectedRemark,
          revisedRemark: isThisYourRevisedOrder[0]?.revisedRemark,
          layoutChecker:  isThisYourRevisedOrder[0]?.prepressToCheckLayout,
          layoutRejectedRemark:  isThisYourRevisedOrder[0]?.layoutRejectedRemark,
          adminRemark: isThisYourRevisedOrder[0]?.adminRemark,
          action: 'Prepress received an order from the queue system that was sent back for revision by the sales team.',
          actionOwner:  req.body.email,
          artworkOwner:  req.body.email,
          artworkChecker: isThisYourRevisedOrder[0]?.prepressToCheck,
          orderOwner: findTargetUser.email,
          status: "In Progress",
          timeStamp: "" + timeStampOrder,
        },
      });
      await prisma.disPlayQueue.delete({
        where: {
          orderId: +isThisYourRevisedOrder[0]?.id,
        },
      });

      return res
        .status(200)
        .json(
          "This is the order that the sales team revised, so you need to work on it again."
        );
    }
    /////


   




    
    // const isThisLayoutOrderWithoutOwner = findOrderReadyToLayout.filter(
    //   (data) => data.prepressOwner === "Not Specific"
    // );

    // if (isThisLayoutOrderWithoutOwner[0]?.prepressOwner === "Not Specific") {
    //   const timeStampOrder = Date.now();
    //   await prisma.order.update({
    //     where: {
    //       id: +isThisLayoutOrderWithoutOwner[0]?.id,
    //     },
    //     data: {
    //       prepressOwner: req.body.email,
    //       status: "layoutWorking",
    //       timeStamp: "" + timeStampOrder,
    //     },
    //   });

    //   await prisma.disPlayQueue.delete({
    //     where: {
    //       orderId: +isThisLayoutOrderWithoutOwner[0]?.id,
    //     },
    //   });

    //   await prisma.orderLog.create({
    //     data: {
    //       orderId: +isThisLayoutOrderWithoutOwner[0]?.id,
    //       orderNumber: isThisLayoutOrderWithoutOwner[0]?.orderNumber,
    //       prepressInCharge: req.body.email,
    //       status: "Working On Layout",
    //       timeStamp: "" + timeStampOrder,
    //     },
    //   });

    //   return res
    //     .status(200)
    //     .json("This is the order that ready to work on layout");
    // }


    //  this is the order when the first prepress finish woeking on it and other prepress cheked the order and reject
    const findOrderGotRejectedAfterChecked = await prisma.order.findMany({
      where: {
        id: {
          in: allOrderInQueue.map((data) => data.orderId),
        },
        status: "rejectedAfterChecked",
      },
      orderBy: {
        timeStamp: "asc",
      },
    });
    const isYourJobAfterGotRejected = findOrderGotRejectedAfterChecked.filter(
      (data) => data.prepressOwner === req.body.email
    );
    /////////// Your job got rejected after prepress checked
    if (isYourJobAfterGotRejected[0]) {
      const timeStampOrder = Date.now();
      await prisma.order.update({
        where: {
          id: +isYourJobAfterGotRejected[0]?.id,
        },
        data: {
          status: "working",
          timeStamp: "" + timeStampOrder,
        },
      });

      const findTargetUser = await prisma.user.findUnique({
        where:{
          id: +isYourJobAfterGotRejected[0]?.userId
        }
      })

      await prisma.orderLog.create({
        data: {
          orderId: +isYourJobAfterGotRejected[0]?.id,
          orderNumber: isYourJobAfterGotRejected[0].orderNumber,
          erpNumber: isYourJobAfterGotRejected[0].erpNumber,
          artworkOwner: isYourJobAfterGotRejected[0].prepressOwner,
          artworkChecker:  isYourJobAfterGotRejected[0].prepressToCheck,
          layoutChecker: isYourJobAfterGotRejected[0].prepressToCheckLayout,
          checkedRemark : isYourJobAfterGotRejected[0].checkedRemark,
          layoutRejectedRemark: isYourJobAfterGotRejected[0].layoutRejectedRemark,
          rejectedRemark: isYourJobAfterGotRejected[0].rejectedRemark,
          revisedRemark : isYourJobAfterGotRejected[0].revisedRemark,
          adminRemark: isYourJobAfterGotRejected[0].adminRemark,
          orderOwner: findTargetUser.email,
          status: "In Progress",
          action: 'Prepress received the order from the queue system that had been checked and rejected by another Prepress team member for rework.',
          actionOwner: req.body.email,
          timeStamp: "" + timeStampOrder,
        },
      });
      await prisma.disPlayQueue.delete({
        where: {
          orderId: +isYourJobAfterGotRejected[0]?.id,
        },
      });
      return res
        .status(200)
        .json(
          "Your job was rejected after being reviewed by prepress, so you'll need to work on it again."
        );
    }


    const findOrderWaitForPrepressToCheck = await prisma.order.findMany({
      where: {
        id: {
          in: allOrderInQueue.map((data) => data.orderId),
        },
        status: "waitForPrepressToCheck",
      },
      orderBy: {
        timeStamp: "asc",
      },
    });



    const isTheJobToCheck = findOrderWaitForPrepressToCheck.filter(
      (data) =>
        data.prepressOwner !== req.body.email &&
        data.prepressToCheck === req.body.email
    );

    // const isYourOwnJob = findOrderWaitForPrepressToCheck.filter(
    //   (data) =>
    //     data.prepressOwner === req.body.email &&
    //     data.prepressToCheck === req.body.email
    // );
    if (isTheJobToCheck[0]) {
      const timeStampOrder = Date.now();

      await prisma.order.update({
        where: {
          id: +isTheJobToCheck[0].id,
        },
        data: {
          status: "checking",
        },
      });

      const findTargetUser = await prisma.user.findUnique({
        where:{
          id: +isTheJobToCheck[0]?.userId
        }
      })

      await prisma.orderLog.create({
        data: {
          orderId: +isTheJobToCheck[0].id,

          orderNumber: isTheJobToCheck[0].orderNumber,
          erpNumber: isTheJobToCheck[0].erpNumber,
          artworkOwner: isTheJobToCheck[0].prepressOwner,
          layoutChecker : isTheJobToCheck[0].prepressToCheckLayout,
          checkedRemark: isTheJobToCheck[0].checkedRemark,
          layoutRejectedRemark: isTheJobToCheck[0].layoutRejectedRemark,
          rejectedRemark : isTheJobToCheck[0].rejectedRemark,
          revisedRemark: isTheJobToCheck[0].revisedRemark,
          adminRemark:  isTheJobToCheck[0].adminRemark,
          actionOwner: req.body.email,
          artworkChecker: req.body.email,
          
          orderOwner: findTargetUser.email,
          status: "Under Prepress Review",
          action: 'Prepress received the order and checked it before sending it to the sales team.',
          timeStamp: "" + timeStampOrder,
        },
      });

      await prisma.disPlayQueue.delete({
        where: {
          orderId: +isTheJobToCheck[0].id,
        },
      });

      return res.status(200).json("You need to check this order again.");
    }

    const isNotYourOwnJob = findOrderWaitForPrepressToCheck.filter(
      (data) =>
        data.prepressOwner !== req.body.email && data.prepressToCheck === null
    );

    if (isNotYourOwnJob[0]) {
      const timeStampOrder = Date.now();
      await prisma.order.update({
        where: {
          id: +isNotYourOwnJob[0].id,
        },
        data: {
          status: "checking",
          prepressToCheck: req.body.email,
          timeStamp: "" + timeStampOrder,
        },
      });
      const findTargetUser = await prisma.user.findUnique({
        where:{
          id: +isNotYourOwnJob[0].userId
        }
      })

      await prisma.orderLog.create({
        data: {
          orderId: +isNotYourOwnJob[0].id,
          orderNumber: isNotYourOwnJob[0].orderNumber,
          erpNumber: isNotYourOwnJob[0].erpNumber,
          artworkChecker: req.body.email,
          artworkOwner: isNotYourOwnJob[0].prepressOwner,
          layoutChecker: isNotYourOwnJob[0].prepressToCheckLayout,
          checkedRemark: isNotYourOwnJob[0].checkedRemark,
          layoutRejectedRemark: isNotYourOwnJob[0].layoutRejectedRemark,
          rejectedRemark: isNotYourOwnJob[0].rejectedRemark,
          revisedRemark: isNotYourOwnJob[0].revisedRemark,
          adminRemark:  isNotYourOwnJob[0].adminRemark,
          orderOwner : findTargetUser.email,
          status: "Under Prepress Review",
          action: 'Prepress received the order and checked it before sending it to the sales team.',
          actionOwner: req.body.email,
          timeStamp: "" + timeStampOrder,
        },
      });

      await prisma.disPlayQueue.delete({
        where: {
          orderId: +isNotYourOwnJob[0].id,
        },
      });
      return res
        .status(200)
        .json(
          "This is the order that you need to recheck before sending it to the sales team."
        );
    }

    // if (isYourOwnJob[0]) {
    //   const timeStampOrder = Date.now();
    //   await prisma.order.update({
    //     where: {
    //       id: +isYourOwnJob[0].id,
    //     },
    //     data: {
    //       status: "checking",
    //       prepressToCheck: req.body.email,
    //       timeStamp: "" + timeStampOrder,
    //     },
    //   });

    //   await prisma.orderLog.create({
    //     data: {
    //       orderId: +isYourOwnJob[0].id,
    //       orderNumber: isYourOwnJob[0].orderNumber,
    //       prepressInCharge: req.body.email,
    //       status: "checking",
    //       timeStamp: "" + timeStampOrder,
    //     },
    //   });

    //   await prisma.disPlayQueue.delete({
    //     where: {
    //       orderId: +isYourOwnJob[0].id,
    //     },
    //   });
    //   return res
    //     .status(200)
    //     .json(
    //       "This is the order that you need to recheck before sending it to the sales team."
    //     );
    // }




    const findNewOrderInQueue = await prisma.order.findMany({
      where: {
        id: {
          in: allOrderInQueue.map((data) => data.orderId),
        },
        status: "inQueue",
      },
      orderBy: {
        timeStamp: "asc",
      },
    });

    const isThisTheNewOrderThatYouRejected = findNewOrderInQueue.filter((data)=> data.prepressOwner == req.body.email)

    if(isThisTheNewOrderThatYouRejected[0]?.id){
    const timeStampOrder = Date.now();

      await prisma.order.update({
        where:{
          id : +isThisTheNewOrderThatYouRejected[0]?.id
        },
        data:{
          timeStamp: `` + timeStampOrder,
          status: 'working',
          prepressOwner: req.body.email
        }
      })

      const findTargetUser = await prisma.user.findUnique({
        where:{
          id : +isThisTheNewOrderThatYouRejected[0]?.userId
        }
      })

      await prisma.disPlayQueue.delete({
        where: {
          orderId: +isThisTheNewOrderThatYouRejected[0]?.id
        }
      })

      await prisma.orderLog.create({
        data:{
          orderId: +isThisTheNewOrderThatYouRejected[0]?.id,
          orderNumber: isThisTheNewOrderThatYouRejected[0]?.orderNumber,
          erpNumber: isThisTheNewOrderThatYouRejected[0]?.erpNumber,
          artworkChecker: isThisTheNewOrderThatYouRejected[0].prepressToCheck,
          layoutChecker: isThisTheNewOrderThatYouRejected[0].prepressToCheckLayout,
          artworkOwner: req.body.email,
          orderOwner:findTargetUser.email,
          checkedRemark: isThisTheNewOrderThatYouRejected[0].checkedRemark,
          layoutRejectedRemark: isThisTheNewOrderThatYouRejected[0].layoutRejectedRemark,
          rejectedRemark : isThisTheNewOrderThatYouRejected[0].rejectedRemark,
          revisedRemark: isThisTheNewOrderThatYouRejected[0].revisedRemark,
          adminRemark: isThisTheNewOrderThatYouRejected[0].adminRemark,
          status: 'In Progress',
          action: 'Prepress received a new order that was initially rejected from the queue system and has been working on it since.',
          actionOwner: req.body.email,
          timeStamp:  `` + timeStampOrder,

        }
      })
      return res.status(200).json("This is the new order that has just arrived in the queue and has been rejected by you.")
    }


    const isThisTheNewOrderThatJustArrived = findNewOrderInQueue.filter((data)=> data.prepressOwner == null)


    if(isThisTheNewOrderThatJustArrived[0]?.id){
      const timeStampOrder = Date.now();
      await prisma.order.update({
        where: {
          id: +isThisTheNewOrderThatJustArrived[0]?.id
        },
        data:{
          timeStamp: `` + timeStampOrder,
          status: 'working',
          prepressOwner: req.body.email
        }
      })

      const findTargetUser = await prisma.user.findUnique({
        where:{
          id : +isThisTheNewOrderThatJustArrived[0]?.userId
        }
      })

      await prisma.disPlayQueue.delete({
        where: {
          orderId: +isThisTheNewOrderThatJustArrived[0]?.id
        }
      })

      await prisma.orderLog.create({
        data:{
          orderId: +isThisTheNewOrderThatJustArrived[0]?.id,
          orderNumber: isThisTheNewOrderThatJustArrived[0]?.orderNumber,
          erpNumber: isThisTheNewOrderThatJustArrived[0]?.erpNumber,
          artworkChecker: isThisTheNewOrderThatJustArrived[0]?.prepressToCheck,
          layoutChecker: isThisTheNewOrderThatJustArrived[0]?.prepressToCheckLayout,
          artworkOwner: req.body.email,
          orderOwner:findTargetUser.email,
          checkedRemark: isThisTheNewOrderThatJustArrived[0]?.checkedRemark,
          layoutRejectedRemark: isThisTheNewOrderThatJustArrived[0]?.layoutRejectedRemark,
          rejectedRemark: isThisTheNewOrderThatJustArrived[0]?.rejectedRemark,
          revisedRemark: isThisTheNewOrderThatJustArrived[0]?.revisedRemark,
          adminRemark:  isThisTheNewOrderThatJustArrived[0]?.adminRemark,
          status: 'In Progress',
          action: 'Prepress received a new order that just arrived from the queue system and has been working on it since.',
          actionOwner: req.body.email,
          timeStamp:  `` + timeStampOrder,

        }
      })
      return res.status(200).json("This is the new order that has just arrived in the queue.")

    }


    const timeStampOrder = Date.now();

    await prisma.prepressLog.create({
      data: {
        email: req.body.email,

        timeStamp: "" + timeStampOrder,
        action:
          "This account tried to take next job but they were not for this account.",
      },
    });
    // await prisma.orderLog.create({
    //   data:{
    //     action: 'Prepress tried to get a new order from the queue system. There were orders in the queue, but none for this account.',
    //     timeStamp: "" + timeStampOrder,
    //    actionOwner : req.body.email,
    //   }
    // })

    return res
      .status(400)
      .json(
        "There is no job available for you currently."
      );
  } catch (error) {
    console.log(error);
  }
};

exports.readNewJob = async (req, res, next) => {
  try {
    const afterReadReadyToLayout = await prisma.order.findFirst({
      where: {
        prepressOwner: req.query.email,
        status: "workingLayout",
      },
    });

    if (afterReadReadyToLayout) {
      return res.status(200).json(afterReadReadyToLayout);
    }

    const afterReadCheckingLayout = await prisma.order.findFirst({
      where: {
        prepressToCheckLayout: req.query.email,
        status: 'checkingLayout'
      }
    })

    if (afterReadCheckingLayout) {
      return res.status(200).json(afterReadCheckingLayout);
    }

    const afterReadWaitToPrepressToCheck = await prisma.order.findFirst({
      where: {
        prepressToCheck: req.query.email,
        status: "checking",
      },
    });

    if (afterReadWaitToPrepressToCheck) {
      return res.status(200).json(afterReadWaitToPrepressToCheck);
    }
    const afterReadNewJob = await prisma.order.findFirst({
      where: {
        prepressOwner: req.query.email,
        status: "working",
      },
    });


    return res.status(200).json(afterReadNewJob);
  } catch (error) {
    console.log(error);
  }
};

exports.readWaitToConfirm = async (req, res, next) => {
  try {
    const afterWaitToConfirm = await prisma.order.findMany({
      where: {
        prepressOwner: req.query.email,
        status: "waitToConfirm",
      },
    });

    res.status(200).json(afterWaitToConfirm);
  } catch (error) {
    console.log(error);
  }
};

exports.readCompleted = async (req, res, next) => {
  try {
    const afterCompleted = await prisma.order.findMany({
      where: {
        prepressOwner: req.query.email,
        status: "completed",
      },
    });

    res.status(200).json(afterCompleted);
  } catch (error) {
    console.log(error);
  }
};
exports.readCompletedLayout = async (req, res, next) => {
  try {
    const afterCompletedLayout = await prisma.order.findMany({
      where: {
        prepressOwner: req.query.email,
        status: "completedAfterLayout",
      },
    });

    res.status(200).json(afterCompletedLayout);
  } catch (error) {
    console.log(error);
  }
};

exports.readWaitForPrepressToCheck = async (req, res, next) => {
  try {
    const afterWaitPrepressToCheck = await prisma.order.findMany({
      where: {
        prepressOwner: req.query.email,
        status: "waitForPrepressToCheck",
      },
    });
    res.status(200).json(afterWaitPrepressToCheck);
  } catch (error) {
    console.log(error);
  }
};

exports.readChecking = async (req, res, next) => {
  try {
    const readChecking = await prisma.order.findMany({
      where: {
        prepressOwner: req.query.email,
        status: "checking",
      },
    });
    res.status(200).json(readChecking);
  } catch (error) {
    console.log(error);
  }
};

exports.readAllPrepressQueueMoreMove = async (req, res, next) => {
  try {
    const afterReadAllPrepress = await prisma.user.findMany({
      where: {
        role: "PREPRESS",
      },
    });

    const findPrePressWhoHadOrderInHand = await prisma.order.findMany({
      where: {
        prepressOwner: {
          in: afterReadAllPrepress.map((data) => data.email),
        },
        status: "working",
      },
    });
    res.status(200).json(findPrePressWhoHadOrderInHand);
  } catch (error) {
    console.log(error);
  }
};

exports.readAllPrepress = async (req, res, next) => {
  try {
    const afterReadAllPrepress = await prisma.user.findMany({
      where: {
        role: "PREPRESS",
      },
    });
    res.status(200).json(afterReadAllPrepress);
  } catch (error) {
    console.log(error);
  }
};

exports.readAllQueue = async (req, res, next) => {
  try {
    const response = await prisma.disPlayQueue.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

exports.rejectNewJob = async (req, res, next) => {
  try {

    console.log(req.body)
    const timeStampOrder = Date.now();
    if (req.body.data.status === "checking") {
      if (!req.body.data.rejectedRemark) {
        return res.status(400).json("Please provide your remarks");
      }
      if (req.body.data.rejectCount === null) {
        req.body.data.rejectCount = 1;
      }

      if (req.body.data.rejectCount !== null) {
        req.body.data.rejectCount = 1 + +req.body.data.rejectCount;
      }
      await prisma.order.update({
        where: {
          id: +req.body.data.id,
        },
        data: {
          status: "rejectedAfterChecked",
          checkedRemark: req.body.data.rejectedRemark,
          rejectCount: +req.body.data.rejectCount,
          timeStamp: "" + timeStampOrder,
        },
      });

      const findTargetUser = await prisma.user.findUnique({
        where:{
          id: +req.body.data.userId
        }
      })

      await prisma.orderLog.create({
        data: {
          orderId: +req.body.data.id,
          orderNumber: req.body.data.orderNumber,
          erpNumber: req.body.data.erpNumber,
          artworkOwner: req.body.data.prepressOwner,
          orderOwner: findTargetUser.email,
          status: "Rejected After Review",
          action: 'Prepress rejected the order after checking it and added it back to the queue system for rework.',
          layoutChecker: req.body.data.prepressToCheckLayout,
          actionOwner:  req.body.data.prepressToCheck,
          artworkChecker:  req.body.data.prepressToCheck,
          layoutRejectedRemark : req.body.data.layoutRejectedRemark,
          rejectedRemark: req.body.data.rejectedRemark,
          revisedRemark : req.body.data.revisedRemark,
          timeStamp: "" + timeStampOrder,
          checkedRemark: req.body.data.rejectedRemark,
          adminRemark: req.body.data.adminRemark
        },
      });

      await prisma.disPlayQueue.create({
        data: {
          orderId: +req.body.data.id,
          isActive : true
        },
      });

      return res
        .status(200)
        .json("You just rejected an order and sent it back to the sales team.");
    }

    if(req.body.data.status == 'checkingLayout'){

      if(!req.body.data.rejectedRemark){
        return res.status(400).json("Please provide your remarks");
      }



      await prisma.order.update({
        where:{
          id: +req.body.data.id,
        },
        data:{
          status: "rejectedAfterCheckedLayout",
          layoutRejectedRemark: req.body.data.rejectedRemark,
          prepressToCheckLayout: req.body.authUser.email,
          timeStamp: "" + timeStampOrder,
        }
      })

      const findTargetUser = await prisma.user.findUnique({
        where:{
          id: +req.body.data.userId
        }
      })

      await prisma.orderLog.create({
        data: {
          orderId: +req.body.data.id,
          orderNumber: req.body.data.orderNumber,
          erpNumber: req.body.data.erpNumber,
          artworkOwner: req.body.data.prepressOwner,
          orderOwner: findTargetUser.email,
          status: "Layout Rejected After Review",
          action: 'Prepress rejected the layouted order after reviewing it and returned it to the queue system for rework.',
          actionOwner:  req.body.authUser.email,
          artworkChecker:  req.body.data.prepressToCheck,
          layoutChecker:  req.body.authUser.email,
          layoutRejectedRemark:  req.body.data.rejectedRemark,
          timeStamp: "" + timeStampOrder,
          checkedRemark: req.body.data.checkedRemark,
          rejectedRemark: req.body.data.rejectedRemark,
          revisedRemark: req.body.data.revisedRemark,
          adminRemark: req.body.data.adminRemark
        },
      });

      await prisma.disPlayQueue.create({
        data: {
          orderId: +req.body.data.id,
          isActive : true
        },
      });

      return res
        .status(200)
        .json("You just rejected an order and sent it back to the queue system to rework");
    }

    if (!req.body.data.rejectedRemark) {
      return res.status(400).json("Please provide your remarks");
    }

    const afterReject = await prisma.order.update({
      where: {
        id: +req.body.data.id,
      },
      data: {
        status: "rejected",
        rejectedRemark: req.body.data.rejectedRemark,
        timeStamp: "" + timeStampOrder,
      },
    });

    const findTargetUser = await prisma.user.findUnique({
      where: {
        id: +afterReject.userId
      }
    })

    await prisma.orderLog.create({
      data: {
        orderId: +req.body.data.id,
        orderNumber: req.body.data.orderNumber,
        erpNumber: req.body.data.erpNumber,
        action: 'Prepress rejected the new order and sent it back to the sales team.',
        actionOwner:  req.body.data.prepressOwner,
        artworkOwner: req.body.data.prepressOwner,
        orderOwner: findTargetUser.email,
        artworkChecker : req.body.data.prepressToCheck,
        layoutChecker : req.body.data.prepressToCheckLayout,
        status: "Job Rejected",
        timeStamp: "" + timeStampOrder,
        checkedRemark : req.body.data.checkedRemark,
        rejectedRemark: req.body.data.rejectedRemark,
        layoutRejectedRemark : req.body.data.layoutRejectedRemark,
        revisedRemark : req.body.data.revisedRemark,
        adminRemark: req.body.data.adminRemark
      },
    });


    res.status(201).json(afterReject);
  } catch (error) {
    console.log(error);
  }
};

exports.rejectJobAfterChecked = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

exports.finishNewJob = async (req, res, next) => {
  try {
    console.log(req.body)
    const timeStampOrder = Date.now();
    const findTargetUser = await prisma.user.findUnique({
      where: {
        id: +req.body.data.userId
      }
    })

    if (req.body.data.status === "workingLayout") {
      const timeStampOrder = Date.now();

      await prisma.order.update({
        where: {
          id: +req.body.data.id,
        },
        data: {
          status: "waitForPrepressToCheckLayout",
          timeStamp: "" + timeStampOrder,
        },
      });

      await prisma.disPlayQueue.create({
        data: {
          orderId: +req.body.data.id,
          isActive : true
        },
      });

      const findTargetSales = await prisma.user.findUnique({
        where: {
          id : +req.body.data.userId
        }
      })

      await prisma.orderLog.create({
        data: {
          orderId: +req.body.data.id,
          orderNumber: req.body.data.orderNumber,
          erpNumber:  req.body.data.erpNumber,
          action: 'Prepress completed the layout for the order and sent it to the queue system to wait for their review and confirmation.',
          actionOwner: req.body.data.prepressOwner,
          artworkChecker: req.body.data.prepressToCheck,
          artworkOwner: req.body.data.prepressOwner,
          layoutChecker : req.body.data. prepressToCheckLayout,
          orderOwner: findTargetSales.email,
          status: "Awaiting Layout Check",
          layoutRejectedRemark : req.body.data.layoutRejectedRemark,
          checkedRemark: req.body.data.checkedRemark,
          rejectedRemark: req.body.data.rejectedRemark,
          revisedRemark : req.body.data.revisedRemark,
          adminRemark: req.body.data.adminRemark,
          timeStamp: "" + timeStampOrder,
        },
      });
      return res.status(200).json({ message: 'Prepress finish an order as layoutWaitForPrepressToCheck successfully'});
    }

    ///////////////////////////////////
    //////////////////////////////////


    const findTargetOrder = await prisma.order.findUnique({
      where: {
        orderNumber: req.body.data.orderNumber,
      },
    });

    if (findTargetOrder.status !== "working") {
      return res.status(200).json("Your order was moved by admin");
    }

  if(req.body.data.status == 'working' && req.body.data.prepressToCheck){
    await prisma.order.update({
      where: {
        id: +req.body.data.id,
      },
      data: {
        status: "waitForPrepressToCheck",
        timeStamp: "" + timeStampOrder,
      }
    })
    await prisma.disPlayQueue.create({
      data: {
        orderId: +req.body.data.id,
        isActive : true
      },
    });

    await prisma.orderLog.create({
      data: {
        orderId: +req.body.data.id,
        orderNumber: req.body.data.orderNumber,
        erpNumber:  req.body.data.erpNumber,
        action:'Prepress finished the order and sent it to the queue system to wait for Prepress to check and confirm it after it was rejected.',
        actionOwner: req.body.data.prepressOwner,
        artworkChecker: req.body.data.prepressToCheck,
        artworkOwner : req.body.data.prepressOwner,
        layoutChecker : req.body.data.prepressToCheckLayout,
        orderOwner: findTargetUser.email,
        status: "Awaiting Prepress Check",
        checkedRemark : req.body.data.checkedRemark,
        layoutRejectedRemark : req.body.data.layoutRejectedRemark,
        rejectedRemark : req.body.data.rejectedRemark,
        revisedRemark : req.body.data.revisedRemark,
        adminRemark: req.body.data.adminRemark,
        timeStamp: "" + timeStampOrder,     

      },
    });

  return res.status(200).json({ message: 'Prepress finish an order as waitForPrepressToCheck after it was rejected successfully'});
  }
  //////////////////////////////
  /////////////////////////////

    await prisma.order.update({
      where: {
        id: +req.body.data.id,
      },
      data: {
        status: "waitForPrepressToCheck",
        timeStamp: "" + timeStampOrder,
      },
    });

    await prisma.disPlayQueue.create({
      data: {
        orderId: +req.body.data.id,
        isActive : true
      },
    });
    await prisma.orderLog.create({
      data: {
        orderId: +req.body.data.id,
        orderNumber: req.body.data.orderNumber,
        erpNumber:  req.body.data.erpNumber,
        action:'Prepress finished the order and sent it to the queue system to wait for Prepress to check and confirm it.',
        rejectedRemark: req.body.data.rejectedRemark,
        actionOwner: req.body.authUser.email,
        artworkOwner: req.body.authUser.email,
        orderOwner: findTargetUser.email,
        layoutChecker : req.body.data.prepressToCheckLayout,
        artworkChecker : req.body.data.prepressToCheck,
        status: "Awaiting Prepress Check",
        checkedRemark : req.body.data.checkedRemark,
        layoutRejectedRemark : req.body.data.layoutRejectedRemark,
        revisedRemark : req.body.data.revisedRemark,
        adminRemark: req.body.data.adminRemark,
        timeStamp: "" + timeStampOrder,
      },
    });

  return res.status(200).json({ message: 'Prepress finish an order as waitForPrepressToCheck successfully'});
  } catch (error) {
    console.log(error);
  }
};

exports.finishJobAfterChecked = async (req, res, next) => {
  try {
    const timeStampOrder = Date.now();


    if(req.body.data.status == 'checkingLayout') {
      await prisma.order.update({
        where: {
          id: +req.body.data.id
        },
        data:{
          status: 'completedAfterLayout',
          timeStamp: "" + timeStampOrder,
        }
      })

          const findTargetUser = await prisma.user.findUnique({
      where: {
        id : +req.body.data.userId
      }
    })

        await prisma.orderLog.create({
          data:{
            orderId : + req.body.data.id,
            orderNumber: req.body.data.orderNumber,
            erpNumber: req.body.data.erpNumber,
            action: 'Prepress reviewed and confirmed the layouted artwork.', 
            actionOwner: req.body.authUser.email   ,
            artworkChecker: req.body.data.prepressToCheck,
            artworkOwner: req.body.data.prepressOwner,
            orderOwner:      findTargetUser.email,
            layoutChecker : req.body.authUser.email ,
            timeStamp   :  "" + timeStampOrder,
            checkedRemark: req.body.data.checkedRemark,
            layoutRejectedRemark: req.body.data.layoutRejectedRemark,
            rejectedRemark: req.body.data.rejectedRemark,
            revisedRemark: req.body.data.revisedRemark,
            adminRemark: req.body.data.adminRemark,
            status: 'Layout Completed'
          }
        })

        return res.status(200).json({ message: 'Prepress check and finish layouted artwork'});
    }


    await prisma.order.update({
      where: {
        id: +req.body.data.id,
      },
      data: {
        status: "waitToConfirm",
        timeStamp: "" + timeStampOrder,
      },
    });

    const findTargetUser = await prisma.user.findUnique({
      where: {
        id : +req.body.data.userId
      }
    })

    await prisma.orderLog.create({
      data: {
        orderId: +req.body.data.id,
        orderNumber: req.body.data.orderNumber,
        erpNumber: req.body.data.erpNumber,
        artworkOwner : req.body.data.prepressOwner,
        orderOwner : findTargetUser.email,
        artworkChecker: req.body.data.prepressToCheck,
        layoutChecker: req.body.data.prepressToCheckLayout,
        status: "Awaiting Confirmation",
        action: 'Prepress checked and confirmed the order, then sent it to the sales team for confirmation.',
        actionOwner:  req.body.data.prepressToCheck,
        checkedRemark : req.body.data.checkedRemark,
        layoutRejectedRemark : req.body.data.layoutRejectedRemark,
        rejectedRemark : req.body.data.rejectedRemark,
        revisedRemark : req.body.data.revisedRemark,
        adminRemark : req.body.data.adminRemark,
        timeStamp: "" + timeStampOrder,
      },
    });

    return res.status(200).json({ message: 'Prepress checked and confirmed the order, then sent it to the sales team for confirmation.'});
  } catch (error) {
    console.log(error);
  }
};
