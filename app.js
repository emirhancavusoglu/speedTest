const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const app = express();
const fs = require('fs');
// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

// Ping Test Endpoint
app.get('/ping', (req, res) => {
    res.send({ ping: 'pong', timestamp: new Date() });
});

// Download Test Endpoint
app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, 'a.pdf');
    // Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(data);
    });
});

// Upload Test Endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    // req.file contains the uploaded file
    console.log(req.file);
    
    // Process the file or respond as needed
    res.send({ message: 'Upload received' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
