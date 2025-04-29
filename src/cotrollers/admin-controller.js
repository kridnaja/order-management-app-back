const prisma = require('../models/prisma')





exports.readAllOrders = async (req, res, next) =>{
    try {
        
        const response = await prisma.order.findMany()



        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

exports.readAllSales = async (req, res, next) =>{
    try {
        const  response = await prisma.user.findMany({
            where:{
                role : "SALES"
            }
        })
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

exports.readInQueueOrders = async (req, res, next) =>{
    try {
        

        const response = await prisma.disPlayQueue.findMany({
            orderBy:{
                id: 'asc'
            }
        })


        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

exports.readWorkingStatusOrders = async (req, res, next) => {
    try {
        const response = await prisma.order.findMany({
            where: {
                status: {
                    in: ["checking", "workingLayout", "working",]
                }
            },orderBy:{
                timeStamp : "asc"
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.readNewJobStatusOrders = async (req, res, next) =>{
    try {
        const response = await prisma.order.findMany({
            where: {
                status: "newJob"

            },orderBy:{
                timeStamp : "asc"
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// exports.moveInQueueOrderToUrgentStatus = async (req, res, next) =>{
//     try {

//         const prepressOwner = req.body.selectTargetPrepress === "Not Specific" ? "Not Specific" : req.body.selectTargetPrepress.email;
//         if(req.body.selectOrderInQueue.status === 'readyToLayout'){
//             await prisma.order.update({
//                 where:{
//                     id: +req.body.selectOrderInQueue.id
//                 },
//                 data:{
//                     prepressOwner: prepressOwner
//                 }
//             })
//             return res.status(200).json('moved!!')
//         }

//         if(req.body.selectOrderInQueue.status === 'working'){
//             await prisma.order.update({
//                 where:{
//                     id: +req.body.selectOrderInQueue.id
//                 },
//                 data:{
//                     status: 'urgentJob',
//                     prepressOwner: prepressOwner
//                 }
//             })

//             await prisma.disPlayQueue.create({
//                 data:{
//                     orderId : +req.body.selectOrderInQueue.id
//                 }
//             })
//             return res.status(200).json('moved!!')
//         }
//         if(req.body.selectOrderInQueue.status === 'checking'){
//             await prisma.order.update({
//                 where:{
//                     id: +req.body.selectOrderInQueue.id
//                 },
//                 data:{
//                     status: 'urgentJob',
//                     prepressOwner: prepressOwner
//                 }
//             })

//             await prisma.disPlayQueue.create({
//                 data:{
//                     orderId : +req.body.selectOrderInQueue.id
//                 }
//             })
//             return res.status(200).json('moved!!')
//         }
//         if(req.body.selectOrderInQueue.status === 'layoutWorking'){
//             await prisma.order.update({
//                 where:{
//                     id: +req.body.selectOrderInQueue.id
//                 },
//                 data:{
//                     status: 'urgentJob',
//                     prepressOwner: prepressOwner
//                 }
//             })

//             await prisma.disPlayQueue.create({
//                 data:{
//                     orderId : +req.body.selectOrderInQueue.id
//                 }
//             })
//             return res.status(200).json('moved!!')
//         }
//         if(req.body.selectOrderInQueue.status === 'urgentJob'){
//             await prisma.order.update({
//                 where:{
//                     id: +req.body.selectOrderInQueue.id
//                 },
//                 data:{
//                     status: 'urgentJob',
//                     prepressOwner: prepressOwner
//                 }
//             })

//             // await prisma.disPlayQueue.create({
//             //     data:{
//             //         orderId : +req.body.selectOrderInQueue.id
//             //     }
//             // })
//             return res.status(200).json('moved!!')
//         }

        



//                await prisma.order.update({
//             where: {
//                 id: +req.body.selectOrderInQueue.id
//             },
//             data: {
//                 status: "urgentJob",
//                 prepressOwner: prepressOwner
//             }
//         });

//         // await prisma.disPlayQueue.create({
//         //     data:{
//         //         orderId : +req.body.selectOrderInQueue.id
//         //     }
//         // })
//       return res.status(200).json("urgent");
//     } catch (error) {
//         console.log(error)
//     }
// }

exports.adminTriggerQueueStatus = async (req, res, next) => {
    try {
       if( req.body.isActive == `true` )
        {
            await prisma.disPlayQueue.updateMany({
    
                data: {
                    isActive: false
                }
            });
            return res.status(200).json({
                message: 'Queue status updated successfully.',
            });

        }
        if(req.body.isActive == `false` ){
            await prisma.disPlayQueue.updateMany({
              
                      data: {
                          isActive:  true
                      }
                  });

                  return res.status(200).json({
                    message: 'Queue status updated successfully.',
                });
        }




        return res.status(200).json({
            message: 'Queue status updated successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'An error occurred while updating the queue status.'
        });
    }
};

exports.adminManageOrder = async (req, res, next) => {
    try {
        const timeStampOrder = Date.now();
        console.log('adminManageOrder', req.body)


        if(req.body.manageInput.queueInOrOut == 'queueOut'){
            await prisma.disPlayQueue.delete({
                where:{
                    orderId: +req.body.manageInput.orderId
                }
            })
        }
        if(req.body.manageInput.queueInOrOut == 'queueIn'){
            await prisma.disPlayQueue.create({
                data:{
                    orderId: +req.body.manageInput.orderId,
                    isActive: true
                }
            })
        }



    const targetOrder = await prisma.order.update({
            where:{
                id : +req.body.manageInput.orderId
            },
            data:{
                status: req.body.manageInput.status,
                prepressOwner: req.body.manageInput.prepressOwner == `null` ? null : req.body.manageInput.prepressOwner,
                prepressToCheck: req.body.manageInput.prepressToCheck == `null` ? null : req.body.manageInput.prepressToCheck,
                prepressToCheckLayout: req.body.manageInput.prepressToCheckLayout == `null` ? null : req.body.manageInput.prepressToCheckLayout,
                timeStamp : ``  + timeStampOrder,
                adminRemark :  req.body.manageInput.adminRemark,        
            }
        })

        const findTargetSales = await prisma.user.findUnique({
            where: {
                id: +targetOrder.userId
            }
        })

        await prisma.orderLog.create({
            data:{
                orderId: targetOrder.id,
                orderNumber: targetOrder.orderNumber,
                erpNumber: targetOrder.erpNumber,
                action: 'Admin managed an order.',
                actionOwner : req.body.authUser.email,
                orderOwner: findTargetSales.email,
                artworkOwner:  targetOrder.prepressOwner,
                artworkChecker: targetOrder.prepressToCheck,
                layoutChecker: targetOrder.prepressToCheckLayout,
                adminRemark:  req.body.manageInput.adminRemark,
                checkedRemark : targetOrder.checkedRemark,
                layoutRejectedRemark: targetOrder.layoutRejectedRemark,
                rejectedRemark: targetOrder.rejectedRemark,
                revisedRemark: targetOrder.revisedRemark,
                status:  req.body.manageInput.status,
                timeStamp : `` + timeStampOrder
            }
        })
        return res.status(200).json({message: 'Admin managed order successfully'})
    } catch (error) {
        console.log(error)
    }
}


///// pc

exports.readAllCompletedOrders = async (req, res, next) =>{
    try {
        const response = await prisma.order.findMany({
            where:{
                status: "completed"
            }
        })

        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}
exports.readAllCompletedLayoutOrders = async (req, res, next) =>{
    try {
        const response = await prisma.order.findMany({
            where:{
                status:"completedAfterLayout"
            },
            orderBy:{
                timeStamp: "asc"
            }
        })
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}
exports.moveCompletedOrderInQueue = async (req,res,next) =>{
    try {
        console.log(req.body)

        const timeStampOrder = Date.now();
        await prisma.order.update({
            where:{
                id: +req.body.data.id
            },data:{
                status: "readyToLayout",
                timeStamp : ""+ timeStampOrder
            }
        })

        await prisma.disPlayQueue.create({
            data:{
                orderId: +req.body.data.id,
                isActive: true
            }
        })

        const findTargetSales = await prisma.user.findUnique({
            where: {
                id: +req.body.data.userId
            }
        })

        await prisma.orderLog.create({
            data: {
                orderId: +req.body.data.id,
                orderNumber: req.body.data.orderNumber,
                erpNumber: req.body.data.erpNumber,
                artworkChecker :  req.body.data.prepressToCheck,
                artworkOwner:  req.body.data.prepressOwner,
                layoutChecker: req.body.data.prepressToCheckLayout,
                orderOwner : findTargetSales.email,
                action: 'The PC team moved the completed artwork order into the queue system, waiting for prepress to work on the layout.',
                actionOwner: req.body.authUser.email,
                status: "Ready for Layout",
                layoutRejectedRemark: req.body.data.layoutRejectedRemark,
                checkedRemark: req.body.data.checkedRemark,
                revisedRemark: req.body.data.revisedRemark,
                rejectedRemark: req.body.data.rejectedRemark,
                adminRemark: req.body.data.adminRemark,
                timeStamp: "" + timeStampOrder,
              },
        })

    return res.status(200).json("Moved !!")
    } catch (error) {
        console.log(error)
    }
}

exports.moveOutCompletedOrderInQueue = async (req, res, next) =>{
    try {
        const timeStampOrder = Date.now();
        await prisma.order.update({
            where:{
                id: +req.body.id
            },
            data:{
                status: 'completed',
                timeStamp : ""+ timeStampOrder
            }
        })

        await prisma.orderLog.create({
            data: {
                orderId: +req.body.id,
                orderNumber: req.body.orderNumber,
                erpNumber: req.body.erpNumber,
                status: "PC admin moved completed order out from queue",
                timeStamp: "" + timeStampOrder,

              },
        })

        await prisma.disPlayQueue.delete({
            where:{
                orderId: +req.body.id
            }
        })
        return res.status(200).json("Moved out !!")
    } catch (error) {
        console.log(error)
    }
}