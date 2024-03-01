const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const db = require('./db/connection')
const errorMiddleware = require('./middlewares/error')
require('dotenv').config();

// Routes
const authroute = require("./routes/userRoutes")
const categoryroute = require('./routes/categoryRoutes')
const productRoute = require('./routes/postRoutes')
const cartRoute = require('./routes/cartRoutes')
const shippingRoute = require('./routes/shippingRoutes')
const paymentRoute = require('./routes/paymentRoutes')
const messageRoutes = require("./routes/messageRoutes");

const app = express()
const socket = require("socket.io")

app.use(cookieParser());
app.use(express.json())
app.use(cors({
  origin: 'https://friendly-narwhal-5df89d.netlify.app',
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}));// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname,'uploads') ) )

// db connection
db()

app.get('/' , (req,res) => {
    res.send('<h1>welcome to InstaMart server</h1>')
})

app.use('/api' , authroute )
app.use('/api' , categoryroute)
app.use('/api' , productRoute)
app.use('/api' , cartRoute)
app.use('/api' , shippingRoute)
app.use('/api/payment' , paymentRoute)
app.use("/api/messages", messageRoutes);

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

app.use(errorMiddleware)

const PORT =process.env.PORT || 4005

const server = app.listen(PORT, () => {
    console.log(
      `Server Running on port ${PORT}`
    );
  });


  const io = socket(server, {
    cors: {
      origin: 'https://friendly-narwhal-5df89d.netlify.app/',
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });
