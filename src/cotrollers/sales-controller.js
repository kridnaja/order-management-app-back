const prisma = require("../models/prisma");

exports.createOrder = async (req, res, next) => {
  const timeStampOrder = Date.now();
  try {
    console.log(req.body);
    const convertToBoolean = (value) => value === "true";

    const fieldsToConvert = [
      "pantone1",
      "pantone2",
      "pantone3",
      "pantone4",
      "set",
      "pcs",
      "digitalProof",
      "cyan",
      "magenta",
      "yellow",
      "black",
      "white",
      "typeOfFormatErp",
      "removeGlue",
      "spotUv",
      "leaveCoatingUv",
      "pumpHoleEyeAndVine",
      "additionalEtc",
      "materialFSC",
    ];

    fieldsToConvert.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.body[field] = convertToBoolean(req.body[field]);
      }
    });

    const requiredFields = [
      "orderNumber",
      "quotationNumber",
      "jobName",
      "salesManager",
      "contact",
      "c",
      "telephoneNumber",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json(
            `Please Fill Your ${
              field.charAt(0).toUpperCase() + field.slice(1)
            }.`
          );
      }
    }
    const findTargetUser = await prisma.user.findUnique({
      where: {
        id: +req.body.userId,
      },
    });

    const afterCreatedOrder = await prisma.order.create({
      data: {
        orderNumber: req.body.orderNumber,
        quotationNumber: req.body.quotationNumber,

        erpNumber: req.body.erp,

        userId: +req.body.userId,
        status: "newJob",
        createdAt: "" + timeStampOrder,
        timeStamp: "" + timeStampOrder,
      },
    });
    await prisma.orderLog.create({
      data: {
        orderId: +afterCreatedOrder?.id,
        orderNumber: req.body?.orderNumber,
        status: "New Job Created",
        action: "Sales created new order into system.",
        actionOwner: findTargetUser.email ,
        orderOwner: findTargetUser.email ,
        
        timeStamp: "" + timeStampOrder,
        erpNumber: req.body.erp,
      },
    });
    await prisma.subOrder.create({
      data: {
        orderId: +afterCreatedOrder?.id,
        orderNumber: req.body?.orderNumber,
        quotationNumber: req.body?.quotationNumber,
        customerName: req.body?.customerName,
        productCode: req.body?.productCode,
        jobName: req.body?.jobName,
        salesManager: req.body?.salesManager,
        contact: req.body?.contact,
        c: req.body?.c,
        telephoneNumber: req.body?.telephoneNumber,
        email: req.body?.email,
        typeOfPrinterMachine: req.body?.typeOfPrinterMachine,
        typeOfColor: req.body?.typeOfColor,
        cmykEtc: req.body?.cmykEtc,
        pantone1: req.body?.pantone1,
        pantone2: req.body?.pantone2,
        pantone3: req.body?.pantone3,
        pantone4: req.body?.pantone4,
        set: req.body?.set,
        cyan: req.body?.cyan,
        magenta: req.body?.magenta,
        yellow: req.body?.yellow,
        black: req.body?.black,
        white: req.body?.white,
        pcs: req.body?.pcs,
        subPantone1: req.body?.subPantone1,
        subPantone2: req.body?.subPantone2,
        subPantone3: req.body?.subPantone3,
        subPantone4: req.body?.subPantone4,
        typeOfFormat: req.body?.typeOfFormat,
        digitalProof: req.body?.digitalProof,
        typeOfFormatErp: req.body?.typeOfFormatErp,
        subTypeOfFormatErp: req.body?.subTypeOfFormatErp,
        spotUv: req.body?.spotUv,
        removeGlue: req.body.removeGlue,
        leaveCoatingUv: req.body.leaveCoatingUv,
        pumpHoleEyeAndVine: req.body.pumpHoleEyeAndVine,
        additionalEtc: req.body.additionalEtc,
        subAdditionalEtc: req.body.subAdditionalEtc,
        outsourceType: req.body.outsourceType,
        typeOfCoated: req.body.typeOfCoated,
        subCoatedEtc: req.body.subCoatedEtc,
        typeOfUv: req.body.typeOfUv,
        coldFoil: req.body.coldFoil,
        subColdFoilEtc: req.body.subColdFoilEtc,
        materialSticker: req.body.materialSticker,
        materialFSC: req.body.materialFSC,
        unitSizeFrontY: req.body.unitSizeFrontY,
        unitSizeFrontX: req.body.unitSizeFrontX,
        unitSizeBlackY: req.body.unitSizeBlackY,
        unitSizeBlackX: req.body.unitSizeBlackX,
        typeOfCorner: req.body.typeOfCorner,
        subUpperCorner: req.body.subUpperCorner,
        typeOfPacking: req.body.typeOfPacking,
        subSheet: req.body.subSheet,
        subRoll: req.body.subRoll,
        space: req.body.space,
        typeOfCore: req.body.typeOfCore,
        purchaseOrderQty: req.body.purchaseOrderQty,
        typeOfRoll: req.body.typeOfRoll,
        subOuterRoll: req.body.subOuterRoll,
        insideRollRemark: req.body.insideRollRemark,
        remark: req.body.remark,
        erp: req.body.erp,
        confirm: req.body.confirm,
        rev: req.body.rev,
        salesCoName: req.body.salesCoName,
        salesCoDate: req.body.salesCoDate,
        salesCoTime: req.body.salesCoTime,
        salesCoMgr: req.body.salesCoMgr,
        salesCoMgrDate: req.body.salesCoMgrDate,
        salesCoMgrTime: req.body.salesCoMgrTime,
        prepressName: req.body.prepressName,
        prepressDate: req.body.prepressDate,
        prepressTime: req.body.prepressTime,
        prepressNameCheckedBy: req.body.prepressNameCheckedBy,
        prepressDateCheckedBy: req.body.prepressDateCheckedBy,
        prepressTimeCheckedBy: req.body.prepressTimeCheckedBy,
        prepressRemark: req.body.prepressRemark,
        createdAt: "" + timeStampOrder,
      },
    });

    return res.status(201).json({ message: "Created New Order Successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(400).json("This order existed");
  }
};

exports.editOrder = async (req, res, next) => {
  try {
    const timeStampOrder = Date.now();
    const result = await prisma.order.update({
      where: {
        id: +req.body.data.orderId,
      },
      data: {
        orderNumber: req.body.data.orderNumber,
        erpNumber: req.body.data.erp,
      },
    });

    await prisma.subOrder.create({
      data: {
        orderId: +req.body.data.orderId,
        orderNumber: req.body.data?.orderNumber,
        quotationNumber: req.body.data?.quotationNumber,
        customerName: req.body.data?.customerName,
        productCode: req.body.data?.productCode,
        jobName: req.body.data?.jobName,
        salesManager: req.body.data?.salesManager,
        contact: req.body.data?.contact,
        c: req.body.data?.c,
        telephoneNumber: req.body.data?.telephoneNumber,
        email: req.body.data?.email,
        typeOfPrinterMachine: req.body.data?.typeOfPrinterMachine,
        typeOfColor: req.body.data?.typeOfColor,
        cmykEtc: req.body.data?.cmykEtc,
        cyan: req.body.data?.cyan,
        magenta: req.body.data?.magenta,
        yellow: req.body.data?.yellow,
        black: req.body.data?.black,
        white: req.body.data?.white,
        pantone1: req.body.data?.pantone1,
        pantone2: req.body.data?.pantone2,
        pantone3: req.body.data?.pantone3,
        pantone4: req.body.data?.pantone4,
        subPantone1: req.body.data?.subPantone1,
        subPantone2: req.body.data?.subPantone2,
        subPantone3: req.body.data?.subPantone3,
        subPantone4: req.body.data?.subPantone4,
        set: req.body.data?.set,
        pcs: req.body.data?.pcs,
        typeOfFormat: req.body.data?.typeOfFormat,
        digitalProof: req.body.data?.digitalProof,
        typeOfFormatErp: req.body.data?.typeOfFormatErp,
        subTypeOfFormatErp: req.body.data?.subTypeOfFormatErp,
        spotUv: req.body.data?.spotUv,
        removeGlue: req.body.data?.removeGlue,
        leaveCoatingUv: req.body.data?.leaveCoatingUv,
        pumpHoleEyeAndVine: req.body.data?.pumpHoleEyeAndVine,
        additionalEtc: req.body.data?.additionalEtc,
        subAdditionalEtc: req.body.data?.subAdditionalEtc,
        outsourceType: req.body.data?.outsourceType,
        typeOfCoated: req.body.data?.typeOfCoated,
        subCoatedEtc: req.body.data?.subCoatedEtc,
        typeOfUv: req.body.data?.typeOfUv,
        coldFoil: req.body.data?.coldFoil,
        subColdFoilEtc: req.body.data?.subColdFoilEtc,
        materialSticker: req.body.data?.materialSticker,
        materialFSC: req.body.data?.materialFSC,
        unitSizeFrontY: req.body.data?.unitSizeFrontY,
        unitSizeFrontX: req.body.data?.unitSizeFrontX,
        unitSizeBlackY: req.body.data?.unitSizeBlackY,
        unitSizeBlackX: req.body.data?.unitSizeBlackX,
        typeOfCorner: req.body.data?.typeOfCorner,
        subUpperCorner: req.body.data?.subUpperCorner,
        typeOfPacking: req.body.data?.typeOfPacking,
        subSheet: req.body.data?.subSheet,
        subRoll: req.body.data?.subRoll,
        space: req.body.data?.space,
        typeOfCore: req.body.data?.typeOfCore,
        purchaseOrderQty: req.body.data?.purchaseOrderQty,
        typeOfRoll: req.body.data?.typeOfRoll,
        subOuterRoll: req.body.data?.subOuterRoll,
        insideRollRemark: req.body.data?.insideRollRemark,
        remark: req.body.data?.remark,
        erp: req.body.data?.erp,
        confirm: req.body.data?.confirm,
        rev: req.body.data?.rev,
        salesCoName: req.body.data?.salesCoName,
        salesCoDate: req.body.data?.salesCoDate,
        salesCoTime: req.body.data?.salesCoTime,
        salesCoMgr: req.body.data?.salesCoMgr,
        salesCoMgrDate: req.body.data?.salesCoMgrDate,
        salesCoMgrTime: req.body.data?.salesCoMgrTime,
        prepressName: req.body.data?.prepressName,
        prepressDate: req.body.data?.prepressDate,
        prepressTime: req.body.data?.prepressTime,
        prepressNameCheckedBy: req.body.data?.prepressNameCheckedBy,
        prepressDateCheckedBy: req.body.data?.prepressDateCheckedBy,
        prepressTimeCheckedBy: req.body.data?.prepressTimeCheckedBy,
        prepressRemark: req.body.data?.prepressRemark,
        createdAt: "" + timeStampOrder,
      },
    });


      const findTargetPrepess = await prisma.user.findFirst({
        where: {
          email : result?.prepressOwner && result?.prepressOwner
        }
      })



    await prisma.orderLog.create({
      data: {
        timeStamp: "" + timeStampOrder,
        orderNumber: req.body?.data.orderNumber,
        erpNumber: result.erpNumber,
        action: "Sales edited the details of the order.",
        actionOwner: req.body.authUser.email ,
        artworkChecker: result.prepressToCheck,
        artworkOwner: result.prepressOwner ,
        layoutChecker: result.prepressToCheckLayout,
        orderOwner: req.body.authUser.email,
        checkedRemark: result.checkedRemark,
        layoutRejectedRemark: result.layoutRejectedRemark,
        rejectedRemark: result.rejectedRemark,
        revisedRemark: result.revisedRemark,
        adminRemark: result.adminRemark,
        orderId: +req.body?.data.id,
        status: "On Hold",

      },
    });

    res.status(200).json("already edited !!");
  } catch (error) {
    console.log(error);
  }
};

exports.readSelectedOrderToEdit = async (req, res, next) => {
  try {
    const afterReadTargetOrderToEdit = await prisma.subOrder.findFirst({
      where: {
        orderId: +req.query.orderId,
      },
      orderBy: {
        id: "desc",
      },
    });
    res.status(200).json(afterReadTargetOrderToEdit);
  } catch (error) {
    console.log(error);
  }
};

exports.readAllPrepress = async (req, res, next) => {
  try {
    const response = await prisma.user.findMany({
      where: {
        role: "PREPRESS",
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

exports.readPreview = async (req, res, next) => {
  try {
    console.log(req.query.orderNumber);
    const response = await prisma.subOrder.findFirst({
      where: {
        orderNumber: req.query.orderNumber,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // console.log(response)
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    console.log(+req.query.targetId);
    const timeStampOrder = Date.now();

    const afterDel = await prisma.order.delete({
      where: {
        id: +req.query.targetId,
      },
    });

    await prisma.deletedOrderLog.create({
      data: {
        orderId: +req.query.targetId,
        orderNumber: afterDel.orderNumber,
        timeStamp: "" + timeStampOrder,
        status: "Sales deleted an order.",

      },
    });

    const findTargetUser = await prisma.user.findUnique({
      where: {
        id: +afterDel.userId,
      },
    });

    await prisma.orderLog.create({
      data: {
        orderId: +afterDel.id,
        orderNumber: afterDel.orderNumber,
        erpNumber: afterDel.erpNumber,
        timeStamp: "" + timeStampOrder,
        status: "Job Delected",
        action: "Sales deleted an order.",
        actionOwner: findTargetUser.email,
        orderOwner: findTargetUser.email,
        artworkOwner: afterDel.prepressOwner,
        artworkChecker: afterDel.prepressToCheck,
        layoutChecker: afterDel.prepressToCheckLayout,
        adminRemark: afterDel.adminRemark,
        checkedRemark: afterDel.checkedRemark,
        layoutRejectedRemark: afterDel.layoutRejectedRemark,
        rejectedRemark: afterDel.rejectedRemark,
        revisedRemark: afterDel.revisedRemark,
        
      },
    });

    return res.status(200).json(afterDel);
  } catch (error) {
    console.log(error);
  }
};

exports.addOrderInQueue = async (req, res, next) => {
  try {
    // if( req.query.orderNumber.slice(-3) === "eva"){

    //   return res.status(400).json("Your device was not allow!!")
    // }
    const timeStampOrder = Date.now();
    const afterFindExistOrderNumber = await prisma.order.findUnique({
      where: {
        orderNumber: req.query.orderNumber,
      },
    });

    const afterFindExistOrderId = await prisma.disPlayQueue.findFirst({
      where: {
        orderId: +afterFindExistOrderNumber.id,
        isActive: true
      },
    });

    if (afterFindExistOrderId) {
      return res.status(400).json("This order was already in queue !!");
    }
    const afterFindExistOrderOnWorking = await prisma.order.findFirst({
      where: {
        orderNumber: req.query.orderNumber,
      },
    });

    if (afterFindExistOrderOnWorking.status !== "newJob") {
      return res.status(500).json("This order was already in queue !");
    }

    await prisma.disPlayQueue.create({
      data: {
        orderId: +afterFindExistOrderNumber.id,
      },
    });

    const afterUpdateStatus = await prisma.order.update({
      where: {
        orderNumber: req.query.orderNumber,
      },
      data: {
        status: "inQueue",
        timeStamp: "" + timeStampOrder,
      },
    });
    const findTargetUser = await prisma.user.findUnique({
      where: {
        id: +afterUpdateStatus.userId,
      },
    });

    await prisma.orderLog.create({
      data: {
        orderId: +afterUpdateStatus.id,
        orderNumber: afterUpdateStatus.orderNumber,
        erpNumber: afterUpdateStatus.erpNumber,
        action: "Sales scanned and added an order in queue system",
        artworkChecker: afterUpdateStatus.prepressToCheck,
        artworkOwner: afterUpdateStatus.prepressOwner,
        layoutChecker: afterUpdateStatus.prepressToCheckLayout,
        checkedRemark: afterUpdateStatus.checkedRemark,
        layoutRejectedRemark: afterUpdateStatus.layoutRejectedRemark,
        rejectedRemark: afterUpdateStatus.rejectedRemark,
        revisedRemark: afterUpdateStatus.revisedRemark,
        actionOwner: findTargetUser.email,
        orderOwner: findTargetUser.email,
        adminRemark: afterUpdateStatus.adminRemark,
        status: "Waiting in Queue",
        timeStamp: "" + timeStampOrder,
      },
    });

    res
      .status(201)
      .json("Your order was added into queue system successfully!!");
  } catch (error) {
    console.log(error);
  }
};

exports.addOrderInQueueAfterGotRejected = async (req, res, next) => {
  try {
    console.log(req.body);
    const timeStampOrder = Date.now();

    const afterUpdatedResult = await prisma.order.update({
      where: {
        id: +req.body.id,
      },
      data: {
        status: "inQueue",
        timeStamp: "" + timeStampOrder,
      },
    });

    const findTargetUser = await prisma.user.findUnique({
      where: {
        id: +afterUpdatedResult.userId,
      },
    });

    await prisma.orderLog.create({
      data: {
        orderId: +req.body.id,
        orderNumber: req.body.orderNumber,
        erpNumber: req.body.erpNumber,
        action:
          req.body.status == "holding"
            ? "Sales added the order to the queue system after it was held."
            : "Sales added the order to the queue system after it was rejected.",
        actionOwner: findTargetUser.email,
        orderOwner: findTargetUser.email,
        artworkChecker: req.body.prepressToCheck,
        layoutChecker: req.body.prepressToCheckLayout,
        checkedRemark: req.body.checkedRemark,
        layoutRejectedRemark: req.body.layoutRejectedRemark,
        rejectedRemark: req.body.rejectedRemark,
        revisedRemark: req.body.revisedRemark,
        adminRemark: req.body.adminRemark,
        artworkOwner: req.body.prepressOwner,
        status: "On Hold",
        timeStamp: "" + timeStampOrder,

      },
    });
    const afterAddOrder = await prisma.disPlayQueue.create({
      data: {
        orderId: +req.body.id,
        isActive: true
      },
    });
    res.status(201).json(afterAddOrder)
  } catch (error) {
    console.log(error);
  }
};

exports.reviseOrderAndAddInQueue = async (req, res, next) => {
  try {
    const timeStampOrder = Date.now();
    if (!req.body.revisedRemark) {
      return res
        .status(400)
        .json("Please Fill Your Remark Before Revise Your Job");
    }

    if (req.body.reviseCount === null) {
      req.body.reviseCount = 1;
    }

    if (req.body.reviseCount !== null) {
      req.body.reviseCount = 1 + +req.body.reviseCount;
    }
    const afterRevised = await prisma.order.update({
      where: {
        id: +req.body.id,
      },
      data: {
        status: "revised",
        revisedRemark: req.body.revisedRemark,
        reviseCount: +req.body.reviseCount,
        timeStamp: "" + timeStampOrder,
      },
    });

    const findTargetUser = await prisma.user.findUnique({
      where: {
        id: +req.body.userId,
      },
    });

    await prisma.orderLog.create({
      data: {
        orderId: +req.body.id,
        timeStamp: "" + timeStampOrder,
        status: "Job Revised",
        orderNumber: req.body.orderNumber,
        erpNumber: req.body.erpNumber,
        orderOwner: findTargetUser.email,
        artworkChecker: req.body.prepressToCheck,
        artworkOwner: req.body.prepressOwner,
        layoutChecker: req.body.prepressToCheck,
        layoutRejectedRemark: req.body.layoutRejectedRemark,
        checkedRemark: req.body.checkedRemark,
        rejectedRemark: req.body.rejectedRemark,
        adminRemark : req.body.adminRemark,
        revisedRemark: req.body.revisedRemark,
        action:
          "Sales rejected the artwork and sent it back to the queue system for prepress to revise.",
        actionOwner: findTargetUser.email,

      },
    });
    await prisma.disPlayQueue.create({
      data: {
        orderId: +req.body.id,
        isActive : true
      },
    });
    res.status(200).json(afterRevised);
  } catch (error) {
    console.log(error);
  }
};

exports.confirmOrder = async (req, res, next) => {
  try {
     await prisma.subOrder.findFirst({
      where: {
        orderNumber: req.body.orderNumber,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // console.log("subOrderResult", subOrderResult)

    // const propertiesToCheck = [
    //   'cyan', 'magenta', 'yellow', 'black', 'white',
    //   'subPantone1', 'subPantone2', 'subPantone3', 'subPantone4',
    //   'removeGlue', 'typeOfCoated', 'typeOfUv', 'coldFoil'
    // ];

    // let countIsHard = propertiesToCheck.reduce((count, prop) => {
    //   if (subOrderResult[prop] || (prop === 'typeOfCoated' && subOrderResult[prop] === 'BOPP')) {
    //     return count + 1;
    //   }
    //   return count;
    // }, 0);
    // const time = new Date();
    // time.setHours(time.getHours() + 7);
    // console.log("countIsHard", countIsHard)
    // if(countIsHard >= 6){
    //  await prisma.prepressWeeklyReport.create({
    //     data: {
    //       orderNumber: req.body.orderNumber,
    //       prepressOwner: req.body.prepressOwner,
    //       prepressToCheck: req.body.prepressToCheck,
    //       createdAt: time,
    //       isHardJob: 'HARD_JOB'
    //     }
    //   });
    // }
    // if( countIsHard < 6){
    //   await prisma.prepressWeeklyReport.create({
    //     data: {
    //       orderNumber: req.body.orderNumber,
    //       prepressOwner: req.body.prepressOwner,
    //       prepressToCheck: req.body.prepressToCheck,
    //       createdAt: time,
    //       isHardJob: 'EASY_JOB'
    //     }
    //   });
    // }

    const timeStampOrder = Date.now();
    const afterConfirm = await prisma.order.update({
      where: {
        id: +req.body.id,
      },
      data: {
        status: "completed",
        timeStamp: "" + timeStampOrder,
      },
    });

    const findTargetUser = await prisma.user.findUnique({
      where: {
        id: +req.body.userId,
      },
    });
    await prisma.orderLog.create({
      data: {
        orderId: +req.body.id,
        orderNumber: req.body.orderNumber,
        erpNumber: req.body.erpNumber,
        action: "The sales team checked the artwork and confirmed the order.",
        actionOwner: findTargetUser.email,
        artworkChecker: req.body.prepressToCheck,
        artworkOwner: req.body.prepressOwner,
        orderOwner: findTargetUser.email,
        layoutChecker: req.body.prepressToCheckLayout,
        layoutRejectedRemark: req.body.layoutRejectedRemark,
        checkedRemark: req.body.checkedRemark,
        rejectedRemark: req.body.rejectedRemark,
        revisedRemark: req.body.revisedRemark,
        adminRemark: req.body.adminRemark,
        status: "Job Completed",
        timeStamp: "" + timeStampOrder,

      },
    });
    res.status(200).json(afterConfirm);
  } catch (error) {
    console.log(error);
  }
};

exports.holdOrder = async (req, res, next) => {
  try {
    const isQueue = await prisma.disPlayQueue.findUnique({
      where: {
        orderId: +req.body.id,
      },
    });
    if (!isQueue) {
      return res.status(200).json("not found");
    }
    const timeStampOrder = Date.now();
    const afterHold = await prisma.order.update({
      where: {
        id: +req.body.id,
      },
      data: {
        status: "holding",
        timeStamp: "" + timeStampOrder,
      },
    });
    await prisma.disPlayQueue.delete({
      where: {
        orderId: +req.body.id,
      },
    });

    const findTargetUser = await prisma.user.findUnique({
      where: {
        id: +req.body.userId,
      },
    });

    await prisma.orderLog.create({
      data: {
        orderId: +req.body.id,
        orderNumber: req.body.orderNumber,
        erpNumber: req.body.erpNumber,
        action: "Sales held an order out of the queue.",
        actionOwner: findTargetUser.email,
        artworkOwner: req.body.prepressOwner,
        artworkChecker: req.body.prepressToCheck,
        layoutChecker: req.body.prepressToCheckLayout,
        layoutRejectedRemark: req.body.layoutRejectedRemark,
        rejectedRemark: req.body.rejectedRemark,
        revisedRemark: req.body.revisedRemark,
        orderOwner: findTargetUser.email,
        checkedRemark: req.body.checkedRemark,
        adminRemark: req.body.adminRemark,
        status: "On Hold",
        timeStamp: "" + timeStampOrder,

      },
    });

    res.status(200).json(afterHold);
  } catch (error) {
    console.log(error);
  }
};

/////////////////////////

exports.readNewOrderAfterCreated = async (req, res, next) => {
  try {
    const afterReadNewJob = await prisma.order.findMany({
      where: {
        userId: +req.query.userId,
        status: "newJob",
      },
    });

    res.status(200).json(afterReadNewJob);
  } catch (error) {
    console.log(error);
  }
};

exports.readFollowOrderAfterInQueue = async (req, res, next) => {
  try {
    const afterReadFollowJob = await prisma.order.findMany({
      where: {
        userId: +req.query.userId,
        status: {
          in: ["inQueue", "urgentJob"],
        },
      },

      orderBy: {
        timeStamp: "asc",
      },
    });
    res.status(200).json(afterReadFollowJob);
  } catch (error) {
    console.log(error);
  }
};

exports.readFollowOrderAfterRejected = async (req, res, next) => {
  try {
    const afterReadFollowJob = await prisma.order.findMany({
      where: {
        userId: +req.query.userId,
        status: "rejected",
      },
    });

    res.status(200).json(afterReadFollowJob);
  } catch (error) {
    console.log(error);
  }
};

exports.readRevisedOrder = async (req, res, next) => {
  try {
    const afterReadRevised = await prisma.order.findMany({
      where: {
        userId: +req.query.userId,
        status: "revised",
      },
    });
    res.status(200).json(afterReadRevised);
  } catch (error) {
    console.log(error);
  }
};

exports.readWaitToConfirmOrder = async (req, res, next) => {
  try {
    const afterReadWaitToConfirm = await prisma.order.findMany({
      where: {
        userId: +req.query.userId,
        status: "waitToConfirm",
      },
      orderBy: {
        timeStamp: "asc",
      },
    });

    res.status(200).json(afterReadWaitToConfirm);
  } catch (error) {
    console.log(error);
  }
};

exports.readOnWorkingOrder = async (req, res, next) => {
  try {
    const afterReadOnWorking = await prisma.order.findMany({
      where: {
        userId: +req.query.userId,
        status: {
          in: [
            "waitForPrepressToCheck",
            "checking",
            "working",
            "rejectedAfterChecked",
          ],
        },
      },
      orderBy: {
        timeStamp: "asc",
      },
    });
    res.status(200).json(afterReadOnWorking);
  } catch (error) {
    console.log(error);
  }
};

exports.readCompletedOrder = async (req, res, next) => {
  try {
    const afterReadCompleted = await prisma.order.findMany({
      where: {
        userId: +req.query.userId,
        status: {
          in: [
            "completed",
            "workingLayout",
            "readyToLayout",
            "completedAfterLayout",
          ],
        },
      },
    });

    res.status(200).json(afterReadCompleted);
  } catch (error) {
    console.log(error);
  }
};

exports.readHoldingOrder = async (req, res, next) => {
  try {
    const afterReadHolding = await prisma.order.findMany({
      where: {
        userId: +req.query.userId,
        status: "holding",
      },
      orderBy: {
        timeStamp: "asc",
      },
    });

    res.status(200).json(afterReadHolding);
  } catch (error) {
    console.log(error);
  }
};

// exports.readNoti = async (req, res, next) => {
//   try {

//     const afterReadNoti = await prisma.notification.findMany({
//       where:{
//         userId : +req.query.userId
//       }
//     });

//     res.status(200).json(afterReadNoti);
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.deleteNoti = async (req, res, next) =>{
//   try {
//   } catch (error) {
//     console.log(error)
//   }
// }
