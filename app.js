require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoute = require("./src/routes/auth-route");
const salesRoute = require("./src/routes/sales-route");
const adminRoute = require("./src/routes/admin-route");
const prepressRoute = require("./src/routes/prepress-route");
const publicRoute = require('./src/routes/public-route')

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
const http = require("http");
// const { Server } = require("socket.io");
const prisma = require("./src/models/prisma");

const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://192.168.0.169:5173",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {

//   socket.on("joinRoom", (room) => {
//     socket.join(room);
//     // console.log(`User joined room: ${room}`);
//     // socket.to(room).emit("message", `A new user has joined the room: ${room}`);
//     socket.to(room)
//   });

//   socket.on("getNewJob", async (data) => {
//     const timeStampOrder = Date.now();
//     if (data) {
//       io.to(data.userId).emit("message", data);
//       await prisma.notification.create({
//         data: {
//           orderId: +data.id,
//           userId: data.userId,
//           notiOrderNumber: data.orderNumber,
//           notiStatus: data.status,
//           timeStamp: "" + timeStampOrder,
//         },
//       });
//     }
//   });
//   socket.on("finishNewJob", async (data) => {
//     const timeStampOrder = Date.now();
//     if (data.status === "working") {
//       io.to(data.userId).emit("message", data);
//       await prisma.notification.create({
//         data: {
//           orderId: +data.id,
//           userId: data.userId,
//           notiErpNumber: data.quotationNumber,
//           notiOrderNumber: data.orderNumber,
//           notiStatus: "Wait for checking again",
//           timeStamp: "" + timeStampOrder,
//         },
//       });
//     }

//     if (data.status === "checking") {
//       io.to(data.userId).emit("message", data);
//       await prisma.notification.create({
//         data: {
//           orderId: +data.id,
//           userId: data.userId,
//           notiErpNumber: data.quotationNumber,
//           notiOrderNumber: data.orderNumber,
//           notiStatus: "Wait To ConFirm",
//           timeStamp: "" + timeStampOrder,
//         },
//       });
//     }
//   });

//   socket.on("rejectNewJob", async (data) => {
//     if (data.status === "checking") {
//       const timeStampOrder = Date.now();
//       io.to(data.userId).emit("message", data);
//       await prisma.notification.create({
//         data: {
//           orderId: +data.id,
//           userId: data.userId,
//           notiErpNumber: data.quotationNumber,
//           notiOrderNumber: data.orderNumber,
//           notiStatus: "Rejected After Checked",
//           timeStamp: "" + timeStampOrder,
//         },
//       });
//       return;
//     }

//     const timeStampOrder = Date.now();
//     io.to(data.userId).emit("message", data);
//     await prisma.notification.create({
//       data: {
//         orderId: +data.id,
//         userId: data.userId,
//         notiErpNumber: data.quotationNumber,
//         notiOrderNumber: data.orderNumber,
//         notiStatus: "Rejected",
//         timeStamp: "" + timeStampOrder,
//       },
//     });
//   });

 

//   socket.on("deleteOrderFromReadNoti", async (data) => {

//     const afterDelNoti = await prisma.notification.delete({
//       where: {
//         id: +data.id,
//       },
//     });
//   });

//   socket.on("deleteAllOrderFromReadNoti", async (data) => {
//     await prisma.notification.deleteMany({
//       where: {
//         userId: data.id,
//       },
//     });
//   });



//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

app.use("/auth", authRoute);

app.use("/sales", salesRoute);

app.use("/prepress", prepressRoute);

app.use("/admin", adminRoute);

app.use('/public', publicRoute)

// const cron = require("node-cron");
// const { DateTime } = require("luxon");

// async function saveWeeklyRange() {
//   try {
//     // Fetch the most recent weekly range (if exists)
//     const lastWeeklyRange = await prisma.weeklyRange.findFirst({
//       orderBy: {
//         endDate: 'desc', // Get the last record based on the most recent endDate
//       }
//     });

//     let startDate, endDate;

//     if (lastWeeklyRange) {
//       // If there's existing data, calculate the next week's range
//       startDate = DateTime.fromJSDate(lastWeeklyRange.endDate).plus({ days: 1 }); // Start date is the day after the last week's end date
//       endDate = startDate.plus({ days: 6 }); // End date is exactly 7 days from the new start date (Monday to Sunday)
//     } else {
//       // If no data exists, start with the current week (in Thailand timezone)
//       const today = DateTime.now().setZone('Asia/Bangkok');

//       // Calculate the start of the current week (Monday in Thailand timezone)
//       const dayOfWeek = today.weekday; // Monday = 1, Tuesday = 2, ..., Sunday = 7
//       const diffToMonday = (dayOfWeek === 7 ? -6 : 1 - dayOfWeek); // Adjust to the most recent Monday
//       startDate = today.plus({ days: diffToMonday }).startOf('day'); // Start of the day

//       // Calculate the end of the week (Sunday in Thailand timezone)
//       endDate = startDate.plus({ days: 6 }).endOf('day'); // Exactly 6 days after the start date, set to the end of Sunday
//     }

//     // Save the new weekly range to MySQL using Prisma
//     await prisma.weeklyRange.create({
//       data: {
//         startDate: startDate.toJSDate(), // Convert Luxon DateTime to JS Date
//         endDate: endDate.toJSDate() // Convert Luxon DateTime to JS Date
//       }
//     });

//     console.log(`Saved weekly range: ${startDate.toISO()} - ${endDate.toISO()}`);
//   } catch (error) {
//     console.error("Error saving weekly range:", error);
//   }
// }

// // Schedule the cron job to run at 15:30 Thailand Time (ICT)
// cron.schedule("22 16 * * 1", async () => {
//   // Get the current time in Thailand timezone (ICT)
//   const thailandTime = DateTime.now().setZone("Asia/Bangkok");

//   // Check if it's the correct time in Thailand timezone (15:30 ICT)
//   if (thailandTime.hour === 16 && thailandTime.minute ===  22) {
//     console.log("Running weekly job at 15:30 Thailand time...");
//     await saveWeeklyRange();
//   } else {
//     console.log("It's not 15:30 in Thailand timezone yet...asdadasdasdasdasdasdasdasdasdsad");
//   }                   
// });
const editDatabase = async() =>{


    const findTargetOrderLog = await prisma.orderLog.findMany({
        where: {
            artworkOwner: null,
            artworkChecker: null
        }
    });
    
    const orderIds = findTargetOrderLog.map((data) => data.orderId);
    
    const findDataOrder = await prisma.order.findMany({
        where: {
            id: {
                in: orderIds 
            }
        }
    });
    
    console.log(findDataOrder)

    findDataOrder.map(async(data)=>{
        await prisma.orderLog.update
    })
    
    // const orderNumbers = findDataOrder.map((data)=>data.orderNumber)
    // console.log(findDataOrder);

    // await prisma.orderLog.updateMany({
    //     where: {
    //         orderNumber:{
    //             in: findDataOrder
    //         },
    //     }
    // })
    
}
server.listen(8888, () => console.log("running 9999"));

// const PORT = process.env.PORT || "5000";

// app.listen(PORT, () => console.log(`server runnig on port: ${PORT}`));
