require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const UserModel = require('./models/UserModel'); // Adjust the path to your model

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
    const { blog } = req.body; // Extract blog content

    UserModel.create({
        image: req.file.filename,
        blog
    })
    .then(result => res.json(result))
    .catch(err => {
        console.error('Error creating document:', err);
        res.status(500).json({ error: 'Error creating document' });
    });
});

app.get('/getImage', (req, res) => {
    UserModel.find()
        .then(users => res.json(users))
        .catch(err => {
            console.error('Error fetching documents:', err);
            res.status(500).json({ error: 'Error fetching documents' });
        });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
