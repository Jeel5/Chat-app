const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const socket = require('socket.io');
const http = require('http');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3100;
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use('/', authRoutes);
app.use('/users', userRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('friendRequest', (data) => {
    console.log(`Friend request from ${data.sender} to ${data.recipient}`);
    io.to(data.recipient).emit('friendRequestReceived', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
