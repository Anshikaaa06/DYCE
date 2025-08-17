const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv')
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log(`Loaded config file .env✅ `);

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// routers
app.use('/api', require('./routes/index.route'));


app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ status: false, message: "Endpoint not found" });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`);
});
